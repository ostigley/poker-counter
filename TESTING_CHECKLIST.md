# Poker Blind Timer - Testing Checklist

## Manual Testing Guide

Visit: http://localhost:5173/

---

## Test 1: Basic Timer Operation
- [ ] Timer displays 25:00 on first load
- [ ] Click START - timer counts down (25:00 → 24:59 → 24:58...)
- [ ] Click PAUSE - timer stops counting
- [ ] Click START again - timer resumes from where it stopped
- [ ] Click RESET - timer returns to 25:00 and stops

---

## Test 2: Timer Duration Configuration
- [ ] Change duration to 5 minutes
- [ ] Verify timer displays 5:00
- [ ] Start timer - verify it counts from 5:00
- [ ] Try to change duration while timer is running - input should be disabled
- [ ] Pause timer - verify you can now change duration

---

## Test 3: Blind Level Progression
- [ ] Set timer to 1 minute for quick testing
- [ ] Initial state: Level 1, Small=1, Big=2
- [ ] Let timer run to completion (0:00)
- [ ] Verify audio beep plays
- [ ] Verify blinds double: Level 2, Small=2, Big=4
- [ ] Verify timer resets to 1:00 but does NOT auto-start
- [ ] Manually start timer again
- [ ] Let it complete again
- [ ] Verify: Level 3, Small=4, Big=8
- [ ] Repeat for Level 4: Small=8, Big=16

---

## Test 4: Chip Breakdown Accuracy

### Level 1 (Small=1, Big=2)
- [ ] Small blind shows: Red × 1
- [ ] Big blind shows: Green × 1 (or Red × 2)

### Level 2 (Small=2, Big=4)
- [ ] Small blind shows: Green × 1 (2 reds = 1 green)
- [ ] Big blind shows: Black × 1 (4 reds = 1 black)

### Level 3 (Small=4, Big=8)
- [ ] Small blind shows: Black × 1
- [ ] Big blind shows: Blue × 1

### Level 4 (Small=8, Big=16)
- [ ] Small blind shows: Blue × 1
- [ ] Big blind shows: White × 1

### Level 5 (Small=16, Big=32)
- [ ] Small blind shows: White × 1
- [ ] Big blind shows: White × 2

### Level 6 (Small=32, Big=64)
- [ ] Small blind shows: White × 2
- [ ] Big blind shows: White × 4

---

## Test 5: localStorage Persistence

### Scenario A: Mid-Timer Reload
- [ ] Start timer at 25:00
- [ ] Let it count down to ~20:00
- [ ] Refresh the page (Cmd+R or F5)
- [ ] Verify timer shows 20:00 (paused)
- [ ] Verify level is still 1
- [ ] Verify blinds are still Small=1, Big=2

### Scenario B: Mid-Game Reload
- [ ] Advance to Level 3 (Small=4, Big=8)
- [ ] Timer at ~15:00
- [ ] Refresh the page
- [ ] Verify Level 3, Small=4, Big=8 still displayed
- [ ] Verify timer shows ~15:00

### Scenario C: Reset Clears localStorage
- [ ] Click RESET button
- [ ] Refresh the page
- [ ] Verify everything resets to defaults

---

## Test 6: Audio Alert

### Test Audio Playback
- [ ] Set timer to 1 second
- [ ] Start timer
- [ ] Wait for completion
- [ ] Verify you hear a beep sound (retro square wave)
- [ ] If no sound: Check browser isn't muted
- [ ] If still no sound: Open browser console for errors

### Browser Audio Policies
- [ ] Note: Some browsers block audio until user interaction
- [ ] If first beep doesn't play, try starting/stopping timer first
- [ ] Audio should work on subsequent completions

---

## Test 7: Visual Design

### Layout Check
- [ ] Header displays "♠ POKER BLIND TIMER ♣" with green border and glow
- [ ] Timer is large (96px font) and readable
- [ ] Level display is yellow
- [ ] Buttons are green with shadow effect
- [ ] Chip circles are properly colored:
  - Red: red gradient
  - Green: green gradient
  - Black: dark gradient
  - Blue: blue gradient
  - White: white gradient

### Responsive Design
- [ ] Open on desktop - everything fits nicely
- [ ] Resize browser to tablet width (~768px)
  - Blinds should stack vertically (one per row)
- [ ] Resize to mobile width (~480px)
  - Buttons should be full width
  - Timer font size reduces
  - Everything remains readable

---

## Test 8: Edge Cases

### Timer Edge Cases
- [ ] Set duration to 1 minute (minimum)
- [ ] Try to set duration to 0 or negative - should default to 1
- [ ] Set duration to 120 minutes (maximum)
- [ ] Try to set duration to 200 - should cap at 120

### Blind Progression Edge Cases
- [ ] Let game run to Level 10+ (Small=512, Big=1024)
- [ ] Verify chip breakdown still calculates correctly
- [ ] Example at Level 10: Small blind needs White × 32

### Reset Edge Cases
- [ ] Reset mid-timer - everything goes back to start
- [ ] Reset at Level 5 - goes back to Level 1
- [ ] Start timer, reset immediately - should work fine

---

## Test 9: Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

Verify in each:
- [ ] Timer counts down accurately
- [ ] Audio alert plays
- [ ] localStorage persists
- [ ] Styling looks correct

---

## Test 10: Performance & Accuracy

### Timer Accuracy
- [ ] Start timer at 10:00
- [ ] Use stopwatch on phone
- [ ] Let it count down for 2 minutes
- [ ] Verify timer is still synchronized with real time
- [ ] Small drift (1-2 seconds) is acceptable

### Performance
- [ ] Open browser DevTools (F12)
- [ ] Go to Performance tab
- [ ] Record while timer is running
- [ ] Verify no excessive re-renders or memory leaks
- [ ] Timer should use minimal CPU

---

## Known Limitations

1. **Timer Drift**: setInterval can drift slightly over long periods (acceptable for poker)
2. **Audio Autoplay**: First beep might not play due to browser policies
3. **localStorage Limit**: No validation for corrupted data (refresh if issues)
4. **No Multi-Table**: Supports one game at a time

---

## Bug Report Template

If you find issues, note:
- **Browser:** (Chrome, Firefox, Safari)
- **OS:** (Mac, Windows, Linux)
- **Steps to reproduce:**
- **Expected behavior:**
- **Actual behavior:**
- **Console errors:** (F12 → Console tab)

---

## Success Criteria

✅ All tests pass
✅ No console errors
✅ Timer accuracy within 2 seconds over 10 minutes
✅ Audio plays (after user interaction)
✅ localStorage survives refresh
✅ Responsive on mobile/tablet/desktop
✅ Chip calculations always correct

