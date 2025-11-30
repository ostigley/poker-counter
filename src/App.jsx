import { useState, useEffect } from 'react'
import styles from './App.module.css'

function App() {
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(1500) // 25 minutes in seconds
  const [timerDuration, setTimerDuration] = useState(25) // minutes
  const [isRunning, setIsRunning] = useState(false)

  // Blind state
  const [currentLevel, setCurrentLevel] = useState(1)
  const [smallBlind, setSmallBlind] = useState(1) // 1 red chip
  const [bigBlind, setBigBlind] = useState(2) // 2 red chips

  // Generate beep sound using Web Audio API
  function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800 // Hz
    oscillator.type = 'square'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }

  // Chip values (relative to red chip = 1)
  const chipValues = {
    red: 1,
    green: 2,
    black: 4,
    blue: 8,
    white: 16
  }

  // Timer tick effect
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimerComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // localStorage persistence effect
  useEffect(() => {
    const state = {
      timeRemaining,
      timerDuration,
      currentLevel,
      smallBlind,
      bigBlind
    }
    localStorage.setItem('pokerTimerState', JSON.stringify(state))
  }, [timeRemaining, timerDuration, currentLevel, smallBlind, bigBlind])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pokerTimerState')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        setTimeRemaining(state.timeRemaining)
        setTimerDuration(state.timerDuration)
        setCurrentLevel(state.currentLevel)
        setSmallBlind(state.smallBlind)
        setBigBlind(state.bigBlind)
      } catch (error) {
        console.warn('Error loading saved state:', error)
      }
    }
  }, [])

  // Timer completion handler
  function handleTimerComplete() {
    // Play audio alert
    playBeep()

    // Double blinds
    setSmallBlind(prev => prev * 2)
    setBigBlind(prev => prev * 2)
    setCurrentLevel(prev => prev + 1)

    // Reset timer but don't auto-start
    setTimeRemaining(timerDuration * 60)
    setIsRunning(false)
  }

  // Control functions
  function handleStartPause() {
    setIsRunning(!isRunning)
  }

  function handleReset() {
    setTimeRemaining(timerDuration * 60)
    setIsRunning(false)
    setCurrentLevel(1)
    setSmallBlind(1)
    setBigBlind(2)
    localStorage.removeItem('pokerTimerState')
  }

  function handleDurationChange(minutes) {
    const newMinutes = Math.max(1, Math.min(120, minutes)) // 1-120 minutes
    setTimerDuration(newMinutes)
    if (!isRunning) {
      setTimeRemaining(newMinutes * 60)
    }
  }

  // Calculate all possible single-chip-type payment options
  function calculateAllPaymentOptions(blindAmount) {
    const options = []

    // For each chip color, calculate how many of that single type are needed
    const chipOrder = [
      { color: 'red', value: chipValues.red },
      { color: 'green', value: chipValues.green },
      { color: 'black', value: chipValues.black },
      { color: 'blue', value: chipValues.blue },
      { color: 'white', value: chipValues.white }
    ]

    for (const { color, value } of chipOrder) {
      // Only show this option if the blind amount is divisible by this chip value
      if (blindAmount % value === 0) {
        const count = blindAmount / value
        options.push({ color, count })
      }
    }

    return options
  }

  // Time formatter
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>♠ POKER BLIND TIMER ♣</h1>
      </header>

      {/* Timer Display Section */}
      <section className={styles.timerSection}>
        <div className={styles.levelDisplay}>LEVEL {currentLevel}</div>
        <div className={styles.timerDisplay}>{formatTime(timeRemaining)}</div>

        <div className={styles.controls}>
          <button onClick={handleStartPause} className={styles.btn}>
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button onClick={handleReset} className={styles.btn}>
            RESET
          </button>
        </div>

        <div className={styles.durationConfig}>
          <label>Timer Duration (minutes):</label>
          <input
            type="number"
            value={timerDuration}
            onChange={(e) => handleDurationChange(Number(e.target.value))}
            min="1"
            max="120"
            disabled={isRunning}
            className={styles.input}
          />
        </div>
      </section>

      {/* Blinds Display Section */}
      <section className={styles.blindsSection}>
        <div className={styles.blindInfo}>
          <h2>SMALL BLIND: {smallBlind}</h2>
          <ChipBreakdownDisplay options={calculateAllPaymentOptions(smallBlind)} />
        </div>

        <div className={styles.blindInfo}>
          <h2>BIG BLIND: {bigBlind}</h2>
          <ChipBreakdownDisplay options={calculateAllPaymentOptions(bigBlind)} />
        </div>
      </section>

      {/* Chip Legend Section */}
      <section className={styles.legendSection}>
        <h3>CHIP VALUES</h3>
        <div className={styles.chipLegend}>
          <ChipDisplay color="red" value={chipValues.red} />
          <ChipDisplay color="green" value={chipValues.green} />
          <ChipDisplay color="black" value={chipValues.black} />
          <ChipDisplay color="blue" value={chipValues.blue} />
          <ChipDisplay color="white" value={chipValues.white} />
        </div>
      </section>
    </div>
  )
}

// Helper component: Chip display in legend
function ChipDisplay({ color, value }) {
  return (
    <div className={styles.chip}>
      <div className={`${styles.chipCircle} ${styles[color]}`} />
      <span>= {value}</span>
    </div>
  )
}

// Helper component: Chip breakdown display with all payment options
function ChipBreakdownDisplay({ options }) {
  if (options.length === 0) {
    return (
      <div className={styles.breakdown}>
        <span className={styles.noChips}>No chips needed</span>
      </div>
    )
  }

  return (
    <div className={styles.breakdown}>
      {options.map((option, index) => (
        <div key={option.color} className={styles.paymentOption}>
          {index > 0 && <div className={styles.orDivider}>OR</div>}
          <div className={styles.chipCount}>
            <div className={`${styles.chipCircle} ${styles[option.color]}`} />
            <span>× {option.count}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
