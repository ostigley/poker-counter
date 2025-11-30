# Poker Blind Timer - Implementation Plan

**Approach:** Minimal Single-Component
**Tech Stack:** Vite + React 19 + CSS Modules
**Started:** 2025-11-30

---

## Phase 1: Project Setup ✅

- [x] Initialize Vite project with React template
- [x] Install dependencies (React 19)
- [x] Verify dev server runs
- [x] Set up basic project structure

---

## Phase 2: Basic Timer (MVP) ✅

- [x] Create App.jsx with timer state
- [x] Implement countdown logic with useEffect
- [x] Add start/pause/reset buttons
- [x] Display timer in MM:SS format
- [x] Test timer accuracy

---

## Phase 3: Blind Level System ✅

- [x] Add blind state (currentLevel, smallBlind, bigBlind)
- [x] Implement timer completion handler
- [x] Double blinds on completion
- [x] Display current level and blind amounts
- [x] Test blind progression

---

## Phase 4: Chip Breakdown Calculation ✅

- [x] Define chip values (red=1, green=2, black=4, blue=8, white=16 relative units)
- [x] Implement calculateChipBreakdown function (greedy algorithm)
- [x] Display chip quantities for small blind
- [x] Display chip quantities for big blind
- [x] Test chip calculations with various blind amounts

---

## Phase 5: Audio Alert ✅

- [x] Add Web Audio API beep generator
- [x] Implement audio playback on timer completion
- [x] Test audio alert works in browser

---

## Phase 6: Timer Configuration ✅

- [x] Add input field for timer duration (minutes)
- [x] Allow duration changes when timer is stopped
- [x] Disable duration changes when timer is running
- [x] Test configuration persistence in current session

---

## Phase 7: localStorage Persistence ✅

- [x] Implement localStorage save on state changes
- [x] Implement localStorage load on page mount
- [x] Add reset button to clear localStorage and reset to defaults
- [x] Test page reload scenarios

---

## Phase 8: Retro Visual Design ✅

- [x] Create retro CSS theme (dark background, green text, borders)
- [x] Style chip colors (red, green, black, blue, white circles)
- [x] Add visual polish (shadows, borders, spacing)
- [x] Make responsive for single-page view
- [x] Test visual layout on different screen sizes

---

## Phase 9: Final Testing & Polish ⏳

- [ ] Test complete user flow (config → start → pause → resume → completion)
- [ ] Test blind doubling progression (multiple levels)
- [ ] Test localStorage persistence (reload page mid-game)
- [ ] Test reset functionality
- [ ] Verify all chip calculations are correct
- [ ] Fix any bugs found

---

## Technical Notes

### Chip Value System
- Base unit doubles for each color tier
- Red = 1 unit (base)
- Green = 2 reds
- Black = 2 greens = 4 reds
- Blue = 2 blacks = 8 reds
- White = 2 blues = 16 reds

### Initial Blind Structure
- Starting small blind: 1 red
- Starting big blind: 2 reds (or 1 green)
- After each timer: blinds double

### State Management
- All state in App.jsx using useState
- Timer uses useEffect with setInterval
- localStorage saves on every state change
- No custom hooks needed

---

## File Structure
```
poker-counter/
├── index.html
├── package.json
├── vite.config.js
├── IMPLEMENTATION_PLAN.md (this file)
├── public/
│   └── alert.mp3
└── src/
    ├── main.jsx
    ├── App.jsx (main component ~250 lines)
    ├── App.module.css
    └── index.css (global resets)
```

---

## Success Criteria

✅ Timer counts down accurately
✅ Pause/resume works correctly
✅ Blinds double after each timer completion
✅ Chip breakdown shows correct quantities for each color
✅ Audio alert plays on completion
✅ State persists across page reloads
✅ Reset button clears everything
✅ Retro visual design looks good

---

## Completion Status

**Current Phase:** Phase 9 - Final Testing & Polish
**Overall Progress:** 8/9 phases complete (89%)
