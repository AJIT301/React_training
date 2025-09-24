# React training notes

## **22nd September 2025**

✅ **Built Persistent Toggle Widgets with `useImperativeHandle` and `forwardRef`**

- Implemented a reusable `Widget` component:
  - Local toggle state (`isToggled`) persisted in `localStorage`
  - Status message shows "Saved" after user interaction
  - Avoids showing status on initial load
- Used `useImperativeHandle` to expose a `reset()` method:
  - Parent component can reset any widget to its default state
  - Works with multiple widgets via `ref` forwarding
- Built `Assignment1` parent component:
  - Renders 3 `Widget` instances
  - Provides a "Reset All Widgets" button calling each widget’s `reset()` method
  - Demonstrated controlled imperative behavior from parent to child

✅ **Fixed State Persistence and UI Flicker**

- Initialized state directly from `localStorage` in `useState` initializer to prevent flickering on refresh
- Refactored `useEffect` logic to avoid showing "Saved" message on initial render
- Removed unnecessary animations (Framer Motion) in favor of CSS transitions for simpler, robust behavior

✅ **Deepened Understanding of React Patterns**

- Clarified use of `defaultToggled` as a fallback state
- Used `useRef` (`isInitialMount`) to distinguish between initial mount vs. user-triggered state changes
- Learned how imperative handles can be forwarded across multiple component layers:
  - Parent → Child → Nested Child → Final Child exposing `reset()` method

✅ **CSS & UX Notes**

- Added `.as-saved-message` class with opacity & transform transitions for smooth status message display
- Verified visual feedback works without animations and does not flash on page load
- Ensured equal-height boxes using CSS Grid and flex layout for responsive design

---

## **19th September 2025**

✅ **Enhanced UX with State Logic**

- Built `Task1` (now `Comp1`) with:
  - Conditional button states (enable/disable + visual feedback)
  - Dynamic messages based on counter value
  - Confetti celebration on reaching goal (count >= 10)
  - Reset + decrement functionality with interaction tracking

✅ **Built a Persistent React Component Registry System**

- Created `useCompRegistry` hook to manage dynamic component state
- Implemented localStorage persistence — components survive reloads
- Added descriptions for learning context — no bloat, pure utility

✅ **Fixed Critical Rendering Bug**

- Identified and resolved serialization issue: storing JSX → switched to string keys
- Rebuilt UI from data (`CompComponents` map) — scalable, maintainable architecture
- Added runtime validation: `console.error` if component key missing

✅ **Component Architecture Cleanup**

- Renamed all instances from “task” → “comp” for conceptual clarity
- Verified all wiring: `registerComp`, `toggleComp`, props, keys
- Confirmed `NavModal` correctly receives and renders `comps` array
