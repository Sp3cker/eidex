# Caught Encounter Tracker Plan

## Goal

Let users track which route encounters they have caught. The tracker is per route encounter, persisted in IndexedDB, and visually integrated into the encounter listing rows with Pokeball states.

The core interaction is:

1. First click on an encounter row selects the species and opens/shows Encounter Details.
2. Second click on the already-selected row toggles caught/uncaught.
3. Caught rows show a closed Pokeball at all times.
4. Selected uncaught rows show an open Pokeball.
5. Unselected uncaught rows show no Pokeball.

## Product Decisions

- Track caught status only. Do not track seen/encountered.
- Tracking is per route encounter, not global species.
- Method/rod/slot does not matter. One row represents one catch target for a species in a route zone.
- The persisted key is based on `selectedEncounterLevel`, `zone`, and `speciesId`.
- Randomized mode tracks the randomized species currently shown.
- There is a single caught tracker database/run. Uploading a new save clears it.
- `Clear Save` is a full reset and clears the caught tracker with no confirmation.
- A separate PlacesList action clears only the caught tracker and does not deselect the current encounter or current map.
- If IndexedDB is unavailable, the app behaves as if the feature does not exist: no Pokeballs, no caught toggles, no clear button.

## Current Code Touchpoints

- Encounter rows live in `src/components/Map/MapPlaceInfo/EncounterMonsList.tsx`.
- Encounter list data is read through `useEncounter()` in `src/components/Map/MapPlaceInfo/useEncounter.ts`.
- The currently selected encounter is stored as `selectedEncounter: number | null` in `useMapStore`.
- Selecting an encounter calls `setSelectedEncounter(speciesId)`, which also sets `showEncounter: true`.
- Encounter Details reads `selectedEncounter` and uses `pokemonSearchStore.getDetailedEncounterInfo(speciesId)`.
- The route encounter level identifier is `selectedEncounterLevel`.
- PlacesList lives in `src/components/Map/PlacesList/index.tsx`.
- Upload/Clear Save UI lives in `src/components/ui/Modal/UploadSaveFile.tsx`.
- Randomizer reset lives in `src/stores/randomizerStore.ts`.
- The package already has `idb` installed.

## Data Model

Use an IndexedDB database managed directly with `idb`.

Database:

```ts
const CAUGHT_TRACKER_DB_NAME = "eidex-caught-tracker";
const CAUGHT_TRACKER_STORE_NAME = "caught-encounters";
const CAUGHT_TRACKER_DB_VERSION = 1;
```

Record:

```ts
type EncounterZone = "land" | "water" | "fishing";

type CaughtEncounterRecord = {
  key: string;
  levelId: string;
  zone: EncounterZone;
  speciesId: number;
  caughtAt: number;
};
```

Key format:

```ts
`${levelId}:${zone}:${speciesId}`
```

The store uses `keyPath: "key"`.

## Store Design

Add `src/stores/caughtEncounterStore.ts`.

The store should be safe to import and must not open IndexedDB at module load.

Suggested public state/actions:

```ts
type CaughtEncounterStatus = "unavailable" | "dormant" | "loading" | "ready";

type CaughtEncounterStore = {
  status: CaughtEncounterStatus;
  caughtKeys: Set<string>;
  beginLazyLoad: () => Promise<void>;
  hasCaughtRecords: () => Promise<boolean>;
  toggleCaught: (input: CaughtEncounterInput) => void;
  clearCaught: () => Promise<void>;
};
```

Rules:

- Initialize to `unavailable` if `window.indexedDB` is not available.
- Initialize to `dormant` if IndexedDB is available.
- `beginLazyLoad()` is idempotent.
- `beginLazyLoad()` reads all caught records into an in-memory `Set`.
- If hydration fails before Pokeballs appear, attempt one wipe/recreate.
- If recovery succeeds, become `ready` with an empty set.
- If recovery fails, become `unavailable`.
- `hasCaughtRecords()` performs a count-only DB check when not ready. It must not hydrate `caughtKeys`.
- `toggleCaught()` is ignored unless `status === "ready"`.
- `toggleCaught()` updates `caughtKeys` optimistically and queues a write/delete.
- Write flushing should happen via `queueMicrotask`, because writes are expected to be fast enough and should happen as soon as possible.
- Writes should be coalesced by key so rapid toggles only persist the final desired state.
- `clearCaught()` clears memory immediately when ready and clears the object store. It should also cancel pending writes.

## Idle Scheduling

Add a shared helper, likely `src/lib/scheduleIdleTask.ts`.

Use it for lazy hydration only:

```ts
export function scheduleIdleTask(task: () => void): number;
export function cancelIdleTask(id: number): void;
```

Implementation:

- Prefer `requestIdleCallback`.
- Fallback to `setTimeout`.
- The goal is to protect opening transitions, not because the read itself is expected to be huge.

Do not use idle scheduling for writes. Writes use microtasks.

## Hydration Triggers

### MapPlaceInfo

In `src/components/Map/MapPlaceInfo/MapPlaceInfo.tsx`:

- After the heavy MapPlaceInfo entrance spring rests with a selected map visible, schedule `caughtStore.beginLazyLoad()` with `scheduleIdleTask`.
- Do not block rendering.
- Do not show a loading indicator.

### PlacesList

In `src/components/Map/PlacesList/index.tsx`:

- Keep the existing render/animation behavior.
- When `isPlacesListOpen` becomes true, schedule `caughtStore.beginLazyLoad()` after idle.
- Do not await it.
- Do not change slide/backdrop behavior.

## Encounter Row Behavior

Update `EncounterMonListItem` in `src/components/Map/MapPlaceInfo/EncounterMonsList.tsx`.

Use a real button:

```tsx
<button type="button" ...>
```

Click behavior:

```ts
if (selectedEncounter !== mon.species) {
  setSelectedEncounter(mon.species);
  return;
}

if (caughtStore.status !== "ready") {
  return;
}

if (!selectedEncounterLevel) {
  return;
}

toggleCaught({ levelId: selectedEncounterLevel, zone, speciesId: mon.species });
```

Visual state:

```ts
if (caughtStore.status !== "ready") {
  iconState = "hidden";
} else if (isCaught) {
  iconState = "closed";
} else if (isSelected) {
  iconState = "open";
} else {
  iconState = "hidden";
}
```

Do not refactor `selectedEncounter` to include zone for this feature. The current product/data assumption is that a species does not appear in multiple zones within one encounter level. Add a test for that.

## Pokeball Icon

Create an inline React SVG component, not a flattened static SVG.

Suggested file:

```txt
src/components/Map/MapPlaceInfo/PokeballStatusIcon.tsx
```

States:

- `hidden`
- `open`
- `closed`

Animation policy:

- No Pokeball renders until caught store is ready.
- Hydrated caught icons render static.
- Selecting an uncaught row may spin-fade in the open Pokeball.
- Catching a selected row should twitch/close into the closed Pokeball.
- Uncatching a selected row should pop open.
- Unselecting an uncaught row hides the open Pokeball immediately.
- Bulk clear may cause the selected row to show the open Pokeball; a small state-change animation is acceptable.

Use CSS keyframes rather than `react-spring` per row.

## PlacesList Clear Button

Add a text button in the PlacesList header area marked by the design note.

Behavior:

- Hidden unless `caughtStore.status === "ready"` and `caughtKeys.size > 0`.
- Text: `Clear caught`.
- On click: call `caughtStore.clearCaught()`.
- Do not call `deselectMap()`.
- Do not clear `selectedEncounter`.
- Do not clear randomizer/save state.
- The current route/list should update immediately because memory clears.

Styling:

- Use the upload button's interaction and shape style, but not the upload green color.
- Start with neutral styling:

```tsx
className="hover-active-button font-pkmnem rounded-sm bg-neutral-200 px-2 py-1 text-sm font-bold text-neutral-700 ring-1 ring-neutral-300"
```

## Upload/Clear Save Integration

In `UploadSaveFile`:

- Import the caught store. Importing it must not open IndexedDB.
- On modal mount/open, call `hasCaughtRecords()` for a count-only DB check.
- If true, show a warning label:

```txt
Uploading a save will clear your caught tracker.
```

- Do not fully hydrate the store for this warning.
- On upload, clear the caught tracker before calling `handleUpload(file)`.
- On `Clear Save`, clear the caught tracker as part of the full reset.
- `Clear Save` does not require confirmation.

The caught store and randomizer store stay separate. UI/actions orchestrate both when needed.

## Tests

Keep new tests under `src/test`.

### Caught Store Tests

Add `src/test/caughtEncounterStore.test.ts`.

Cover:

- Initial unavailable state when IndexedDB is absent, if feasible in test environment.
- `beginLazyLoad()` is idempotent.
- Hydration populates `caughtKeys`.
- `toggleCaught()` does nothing before ready.
- `toggleCaught()` updates memory optimistically when ready.
- queued writes are coalesced by key.
- `clearCaught()` clears memory and pending writes.
- `hasCaughtRecords()` does a count-only check and does not hydrate `caughtKeys`.

Use a fake IndexedDB test helper if the existing test setup already provides one. If not, add the smallest local mock needed for the store tests.

### Encounter Data Invariant Test

Add `src/test/encounterZoneUniqueness.test.ts`.

Assert:

- For each processed encounter level, no species appears in more than one zone.
- Duplicates within the same zone are allowed.

This protects the current species-only `selectedEncounter` model.

Pseudo-code:

```ts
for (const encounterLevel of allProcessedEncounterLevels) {
  const zonesBySpecies = new Map<number, Set<EncounterZone>>();

  addZone(encounterLevel.land?.mons, "land");
  addZone(encounterLevel.water?.mons, "water");
  addZone(encounterLevel.fish?.mons, "fishing");

  expect([...zonesBySpecies].filter(([, zones]) => zones.size > 1)).toEqual([]);
}
```

## Validation

Run:

```sh
npm test
npm run build
```

If focused tests are available, run them first during implementation, then the full test/build pass.

Manual checks:

- Select a route with encounters.
- Wait for MapPlaceInfo to finish animating; caught store should hydrate without visible loading.
- First click selects a mon and opens Encounter Details.
- Second click catches it and shows closed Pokeball.
- Select another mon; caught Pokeball stays on first row.
- Select caught mon again and click once more; it becomes uncaught and shows open Pokeball.
- Open PlacesList; `Clear caught` appears only when caught records exist.
- Click `Clear caught`; current map and selected encounter remain, caught icons clear.
- Reload page, open a route, and verify caught records hydrate back.
- Upload modal shows warning when DB has caught records, even if the store has not fully hydrated.
- Clear Save clears caught tracker and randomizer state.
