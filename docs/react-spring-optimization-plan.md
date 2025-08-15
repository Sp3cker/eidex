### React Spring usage audit and memory-lean optimization plan

This doc proposes targeted, low-risk edits to reduce memory footprint and mount-time work across components that use `@react-spring/web`. Each item includes the rationale and pros/cons. Nothing here changes UX; where tradeoffs exist, they’re called out.

### Global recommendations

- **Hoist spring configs to module scope**
  - What: move `{ tension, friction, mass, … }` objects to `const` at file top.
  - Why: avoids re-creating objects on every render; lets React memo compare by reference.
  - Pros: zero behavior change; fewer allocations. Cons: none.

- **Prefer function initializers for springs**
  - What: `useSpring(() => ({ ...initial }), [deps])` instead of object literal.
  - Why: creates springs lazily and avoids unnecessary resets on first render.
  - Pros: less work at mount. Cons: none.

- **Use `useSpringValue` for single primitives**
  - What: when animating a single numeric/string value (e.g., width), prefer `useSpringValue`.
  - Why: lighter than a full spring object.
  - Pros: lower memory; fewer subscriptions. Cons: minimal API differences.

- **Use WAAPI/CSS for simple fades/backdrops**
  - What: offload simple opacity/blur transitions to CSS or Web Animations API.
  - Why: frees react-spring from handling paint-only transitions.
  - Pros: lower JS overhead. Cons: lose unified animation API.

- **`prefers-reduced-motion` guard**
  - What: detect reduced motion and disable non-essential animations.
  - Why: reduces CPU and respects user settings.
  - Pros: accessibility + perf. Cons: conditional branches to maintain.

- **`expires: true` for transitions that can unmount**
  - What: allow transition items to unmount after leave.
  - Why: frees memory tied to offscreen transition nodes.
  - Pros: lower retained memory. Cons: if you rely on hidden nodes, keep `expires: false`.

### Component-specific suggestions

#### `src/components/ui/Modal/Modal.tsx`
- Hoist the config:
  ```ts
  const MODAL_SPRING = Object.freeze({ tension: 220, friction: 21 });
  ```
- Keep a single `useSpring` for `{ opacity, translateY, translateX, scale }` (already good).
- Keep using `useSpring` (multiple values) rather than multiple `useSpringValue`s.
- If the modal backdrop only fades, consider CSS class with transition instead of spring.
  - Pros: less JS work; Cons: marginal.

Pros: minor allocation savings on each open/close; consistent configs. Cons: none.

#### `src/components/Map/MapContainer.tsx`
- Already uses function initializer and hoisted config; good.
- Consider memoizing `bounds` object passed to `useDrag` if renders get hot.
- Keep `to()` aggregator; it’s efficient.

Pros: minimal change; avoids re-allocations. Cons: none.

#### `src/components/Map/ItemsBox/index.tsx`
- Hoist transition configs:
  ```ts
  const ITEMS_BOX_SPRING = Object.freeze({ mass: 1, tension: 220, damping: 0.2 });
  const ITEMS_BOX_PAGE_TRANSITION = Object.freeze({ tension: 280, friction: 25, mass: 0.8 });
  ```
- Optional: set `expires: true` on page transitions if leave elements don’t need to persist.
  - Pros: frees memory when offscreen. Cons: if you depend on hidden node state, keep existing.

Pros: fewer config allocations; smoother GC profile. Cons: none or minimal.

#### `src/components/Map/MapPlaceInfo/MapPlaceInfo.tsx`
- Remove unnecessary `animated(MapPlaceInfoContent)` wrapper (already done) and use `MapPlaceInfoContent` directly; outer `animated.div` handles animation.
- Hoist spring/transition configs.
- Consider `expires: true` in `useTransition(trainersListOpen, …)` if unmounting is acceptable.

Pros: less animated wrapper overhead; lower retained memory. Cons: unmount may reset internal state.

#### `src/components/Map/PlacesList/index.tsx`
- Already uses WAAPI for the backdrop; keep it. Keep `useSpring` only for the sliding panel.
- Hoist `{ mass: 0.5, friction: 20 }` to a const.

Pros: fewer small allocations; spring only where needed. Cons: none.

#### `src/components/Map/Search/SearchResultsList.tsx`
- You currently compose `useSprings` (hover/press) with `useTransition` (enter/update). Keep this split if UX relies on both.
- Hoist configs:
  ```ts
  const RESULT_TRANSITION = Object.freeze({ frequency: 0.21, damping: 1.2 });
  const RESULT_SPRING = Object.freeze({ friction: 50, tension: 500 });
  ```
- If list sizes can be large, consider:
  - Using `visible` to short-circuit early (already present).
  - Using `trail` only for first N items; immediate for the rest.
  - Switching to virtualization if items > ~100.

Pros: lower per-item allocations; better large-list perf. Cons: slightly less flourish on big lists if you limit trail.

#### `src/components/PokemonView/StatBars.tsx`
- Hoist transition config for the per-stat transitions.
- Consider `useSpringValue` for the single `bstValue` animation if only one primitive is needed.
- If the `stats` seldom change, guard re-runs with referentially stable props or memoized mapping.

Pros: fewer subscriptions; reduced churn on updates. Cons: negligible.

#### `src/components/Drawer.tsx` and `src/components/DrawerContent.tsx`
- Hoist configs and keep a single `useSpring` controlling translateX.
- For `DrawerContent`’s `useTransition`, set `expires: true` if unmount on leave is fine.

Pros: fewer retained nodes; smaller memory footprint over time. Cons: unmount resets state.

### Cross-cutting cleanups

- Replace inline style objects that are stable with classNames or hoisted constants (reduces object churn).
- Prefer `className` changes to drive CSS transitions for simple visual tweaks.
- Reuse arrays/objects passed into springs/transitions via top-level constants.

### Quick checklist (PR-friendly)

- [ ] Hoist all spring/transition configs to top-level `const` in files listed above
- [ ] Remove `animated()` HOC in `MapPlaceInfoContent` (done)
- [ ] Consider `expires: true` in transitions where hidden state is not needed
- [ ] Convert single-value springs to `useSpringValue` where applicable
- [ ] Keep WAAPI/CSS for backdrops and simple fades
- [ ] Add `prefers-reduced-motion` guard for heavy animations

### Validation plan

- Use React Profiler to compare mount/update commits before/after (focus on `Map` route interactions).
- Record memory timeline in DevTools while toggling modals/lists repeatedly; verify retained size trend decreases.
- Manually test transitions for visual parity on:
  - Opening/closing modal
  - ItemsBox shuffle transitions
  - Trainers list toggle in MapPlaceInfo
  - Search results interactions (hover/press/enter)
