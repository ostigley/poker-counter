# Poker Blind Timer - Project Documentation

## Project Overview

Single-page React application for tracking poker blinds during home games. Features a configurable countdown timer that automatically doubles blinds at each level, with visual chip payment breakdowns.

**Repository:** https://github.com/ostigley/poker-counter

## Tech Stack

- **Framework:** React 19.0.0
- **Build Tool:** Vite 6.0.0
- **Styling:** CSS Modules (retro terminal aesthetic)
- **Audio:** Web Audio API (square wave beep)
- **Persistence:** localStorage API
- **Package Manager:** npm

## Architecture Philosophy

**Single-Component Design:** Intentionally minimal architecture with all logic in `App.jsx` (~250 lines). This was a deliberate choice over a modular approach for simplicity and ease of maintenance for a small application.

**No External Dependencies:** Zero runtime dependencies beyond React and ReactDOM. All features (audio, storage, styling) use browser-native APIs.

## Chip Value System

Five chip colors with **binary progression** (each tier = 2× previous):

```javascript
const chipValues = {
  red: 1,     // Base unit
  green: 2,   // 2 reds = 1 green
  black: 4,   // 2 greens = 1 black
  blue: 8,    // 2 blacks = 1 blue
  white: 16   // 2 blues = 1 white
}
```

**Initial Blinds:**
- Small blind: 1 red
- Big blind: 2 reds

**Progression:** Blinds double every level (1→2→4→8→16→32→64...)

## Key Implementation Details

### Timer Logic

The timer completion logic is **inlined within the useEffect** to avoid React closure issues:

```javascript
useEffect(() => {
  if (!isRunning) return

  const interval = setInterval(() => {
    setTimeRemaining(prev => {
      if (prev === 1) {
        // Completion logic here - inline to avoid stale closures
        playBeep()
        setSmallBlind(prevBlind => prevBlind * 2)
        setBigBlind(prevBlind => prevBlind * 2)
        setCurrentLevel(prevLevel => prevLevel + 1)
        setIsRunning(false)
        return timerDuration * 60
      }
      return prev > 0 ? prev - 1 : 0
    })
  }, 1000)

  return () => clearInterval(interval)
}, [isRunning, timerDuration]) // Critical: includes timerDuration
```

**Important:** Do NOT extract completion logic to separate function - causes stale closure bugs.

### Payment Options Display

Uses `calculateAllPaymentOptions()` which shows **all valid single-chip-type payment methods**, not just the minimum chips needed:

- For blind amount = 8 reds → Shows: "8 red OR 4 green OR 2 black OR 1 blue"
- Only includes options where `blindAmount % chipValue === 0`
- Displays vertically with yellow "OR" dividers between options

This replaced an initial greedy algorithm approach that only showed minimum chips.

### React StrictMode

**REMOVED from production code.** StrictMode causes effects to run twice in development, which created duplicate intervals and caused blinds to quadruple instead of double. The timer logic requires a single interval instance.

### State Persistence

All game state persists to localStorage on every update:

```javascript
{
  timeRemaining: number,
  timerDuration: number,
  currentLevel: number,
  smallBlind: number,
  bigBlind: number
}
```

Automatically restores on page load. RESET button clears localStorage.

## File Structure

```
poker-counter/
├── src/
│   ├── App.jsx              # Main component (~250 lines, all logic here)
│   ├── App.module.css       # Retro terminal styling
│   ├── main.jsx             # React entry (NO StrictMode wrapper)
│   └── index.css            # Global resets only
├── index.html               # Entry point
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
├── IMPLEMENTATION_PLAN.md   # Development progress tracker
├── TESTING_CHECKLIST.md     # Manual testing guide
└── .gitignore               # Excludes node_modules, dist, .DS_Store
```

## Development Workflow

### Running Locally

```bash
npm install
npm run dev
```

Visit: http://localhost:5173/

### Testing

Manual testing only. Follow `TESTING_CHECKLIST.md` for comprehensive scenarios.

**Key test cases:**
- Timer accuracy over 10+ minutes
- Blind doubling at level transitions
- localStorage persistence across page refreshes
- Audio alert on timer completion (may not work until user interaction due to browser policies)
- Manual blind adjustment controls
- Payment option calculations at various blind levels

### Git Workflow

User prefers to manage commits manually. When changes are complete:
1. Stage changes: `git add <files>`
2. User will create commit with conventional commit format
3. Push to origin/main

**Conventional Commit Format:**
- `feature(scope):` for new features
- `fix(scope):` for bug fixes
- `style(scope):` for UI/styling changes

## Design Principles

### Retro Terminal Aesthetic

- Dark background (#1a1a1a)
- Bright green text (#00ff00) with glow effects
- Monospace font (Courier New)
- Blocky buttons with drop shadows
- Yellow accents for level display and dividers
- Border effects with box-shadow glows

### Chip Colors

```css
.red { background: linear-gradient(135deg, #ff4444, #cc0000); }
.green { background: linear-gradient(135deg, #22aa22, #006600); } /* Darker shade */
.black { background: linear-gradient(135deg, #555555, #222222); }
.blue { background: linear-gradient(135deg, #4444ff, #0000cc); }
.white { background: linear-gradient(135deg, #ffffff, #cccccc); }
```

Green was intentionally darkened from initial bright green for better visibility.

### Responsive Design

- Desktop: Side-by-side blind displays
- Tablet (<768px): Stacked blind displays
- Mobile (<480px): Full-width buttons, reduced font sizes

## Known Issues & Limitations

1. **Timer Drift:** `setInterval` can drift slightly over long periods (acceptable for poker use case)
2. **Audio Autoplay:** First beep may not play due to browser autoplay policies - requires user interaction first
3. **No Multi-Table:** Supports one game session at a time
4. **localStorage Corruption:** No validation - refresh page if state becomes corrupted

## Common Modifications

### Change Timer Default Duration

```javascript
const [timerDuration, setTimerDuration] = useState(25) // Change this value
const [timeRemaining, setTimeRemaining] = useState(1500) // And this (duration * 60)
```

### Adjust Audio Alert

Modify `playBeep()` function in `App.jsx`:
- `oscillator.frequency.value` - Change pitch (Hz)
- `oscillator.type` - Change waveform ('sine', 'square', 'sawtooth', 'triangle')
- Duration in `oscillator.stop()` call

### Add More Chip Colors

1. Add to `chipValues` object
2. Add CSS class in `App.module.css`
3. Update `calculateAllPaymentOptions()` chipOrder array

## Critical Bugs Fixed

### Blinds Quadrupling Bug (Fixed)

**Symptom:** Blinds increased 4× instead of 2× (1→4→16 instead of 1→2→4)

**Root Cause:** React StrictMode running effects twice + stale closure in timer completion handler

**Solution:**
- Removed StrictMode from `main.jsx`
- Inlined completion logic within useEffect
- Added `timerDuration` to dependency array
- Changed to exact match: `if (prev === 1)`
- Used functional setState throughout

## Future Enhancement Ideas

(Not implemented, but potential features to consider)

- Customizable blind structure (small/big blind ratios)
- Break timer mode
- Sound on/off toggle
- Multiple timer presets
- Chip stack calculator
- Dark/light theme toggle
- Ante support
- Tournament payout calculator

## Browser Compatibility

Tested and working on:
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS)

**Required APIs:**
- Web Audio API (audio alerts)
- localStorage (persistence)
- CSS Grid (layout)
- ES6+ JavaScript (React 19 requirement)

## Questions or Issues?

Refer to:
- `TESTING_CHECKLIST.md` - Complete manual testing scenarios
- `IMPLEMENTATION_PLAN.md` - Original development phases
- Git commit history - Detailed change log with explanations
