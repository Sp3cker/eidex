# Eidex Domain Context

This document captures app terminology and domain rules that matter when changing encounter, map, randomizer, and tracker behavior.

## App Shape

Eidex is an interactive map/dex tool for Pokemon Emerald Imperium. Users browse Hoenn locations, inspect route encounters, view where a Pokemon appears, inspect trainers/items, and optionally upload a save file to randomize encounters based on save-derived randomizer data.

The app is route/map centered. A selected map drives the side panels and the bottom detail panel.

## Core Terms

### Map

A map is the base location selected from the SVG/map UI or PlacesList. In `useMapStore`, this is `selectedMap`.

Examples include route or location names such as `Route101`, cave floors, town maps, underwater variants, and other Emerald map identifiers.

### Level / Encounter Level

A map can have multiple internal levels or encounter variants. The encounter-list selector uses `selectedEncounterLevel` to identify which encounter level is currently displayed.

Use `selectedEncounterLevel` as the durable route/location identifier for encounter tracking. It is more precise than the base `selectedMap`.

### Zone

Encounter lists are grouped by zone:

- `land`
- `water`
- `fishing`

Rock smash appears in detailed encounter lookup data, but the route encounter list currently tracks/list-renders land, water, and fishing.

### Encounter Row

An encounter row is the rendered row for one displayed Pokemon in one zone on the current encounter level.

The UI consolidates duplicate species within a zone. For example, fishing method/rod details can be combined into one displayed row. Method/rod/slot should not create separate caught tracker records.

### Species

Species are numeric IDs in rendered encounter data. Encounter rows use `mon.species`, and detailed lookup uses `pokemonSearchStore.getDetailedEncounterInfo(speciesId)`.

### Selected Encounter

`selectedEncounter` is currently species-only: `number | null`.

Selecting an encounter row sets `selectedEncounter` to the row's species ID and opens the Encounter Details panel by setting `showEncounter`.

The current product assumption is that a species does not appear in multiple zones within one encounter level. This allows species-only selection while caught persistence still uses zone for the key.

### Encounter Details

Encounter Details is the lower/detail panel view that shows where else a selected Pokemon can be found. It is driven by selected species, not by route-zone identity.

The first click on an encounter row is for selection/details, not persistence.

### Caught Tracker

The caught tracker is user progress for route encounters.

Rules:

- Track caught only. Do not track seen/encountered.
- Track per route encounter, not globally per species.
- Key by `selectedEncounterLevel`, zone, and species ID.
- Use the displayed/randomized species ID.
- Store one single caught database/run.
- Keep the persistence store separate from map and randomizer stores.

Visual rules:

- No Pokeball appears until the caught store is ready.
- Caught row: closed Pokeball always.
- Selected uncaught row: open Pokeball.
- Unselected uncaught row: no Pokeball.
- If IndexedDB is unavailable or unrecoverable, no Pokeballs or caught actions appear.

Interaction rules:

- First click selects a row/species.
- Second click on the already-selected row toggles caught.
- A row must be selected before it can be caught or uncaught.
- If the caught store is not ready, caught/uncaught toggles silently do nothing.
- Clearing caught progress does not deselect the current map or selected encounter.

### PlacesList

PlacesList is the left slide-out location browser. It has a header with Hoenn title/count and a sort bar.

The caught tracker clear control belongs in this PlacesList header/sort area as a text button for now:

- Text: `Clear caught`
- Hidden unless caught tracker is ready and has records.
- Clears only caught tracker data.
- Does not deselect the current map.
- Does not clear randomizer/save state.

Opening PlacesList may trigger caught-store hydration after idle, but should not change PlacesList rendering or animation behavior.

### Upload Save

Upload Save is the modal flow for applying randomized encounter data from an Emerald Imperium save file.

Uploading a save changes the encounter dataset. If caught tracker records exist, the modal should show a warning label that uploading will clear the caught tracker.

The warning check should touch IndexedDB with a count-only operation. It should not fully hydrate the caught store.

Uploading clears the caught tracker before randomizing.

### Clear Save

Clear Save is a full reset of uploaded/randomized save state. It returns encounters to default and clears the caught tracker.

Clear Save does not require confirmation.

### Randomized Encounters

When randomized mode is active, the tracker records the randomized species shown in the UI, not the original vanilla species underneath.

Randomization is expected to keep displayed encounters unique enough that the species-only selected encounter model remains usable.

## Performance Rules

The caught store must be dormant until needed.

Do not open IndexedDB at module import time.

Lazy hydration triggers:

- MapPlaceInfo entrance transition finishes, then schedule hydration after idle.
- PlacesList opens, then schedule hydration after idle.

The idle scheduling is primarily to keep opening transitions smooth.

Writes should not wait for idle. Toggle writes are expected to be small and should be queued with `queueMicrotask` after optimistic memory update.

No loading UI is shown for caught tracker hydration.

## Failure Rules

If IndexedDB is unavailable, disable the feature by behavior:

- no Pokeballs
- no caught toggles
- no clear caught button
- app otherwise behaves normally

If hydration fails before Pokeballs appear:

1. Attempt one wipe/recreate of the caught tracker database/store.
2. If recovery succeeds, become ready with an empty tracker.
3. If recovery fails, mark caught tracking unavailable.

The user should not see an error for hydration failure; the app should feel as if the feature does not exist.

Schema changes should use explicit IndexedDB version upgrades.

## Testing Assumptions

Add tests under `src/test`.

Important invariant: within one processed encounter level, the same species should not appear in more than one zone. Duplicates inside the same zone are allowed because the UI treats method/slot duplicates as one displayed catch target.

This invariant protects the current species-only `selectedEncounter` state while caught persistence remains per zone.
