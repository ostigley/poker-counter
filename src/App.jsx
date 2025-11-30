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
        if (prev === 1) {
          // Timer completed - execute completion logic directly here
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
  }, [isRunning, timerDuration])

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

  // Manual blind adjustment functions
  function handleBlindsUp() {
    setSmallBlind(prev => prev * 2)
    setBigBlind(prev => prev * 2)
    setCurrentLevel(prev => prev + 1)
  }

  function handleBlindsDown() {
    if (currentLevel > 1) {
      setSmallBlind(prev => prev / 2)
      setBigBlind(prev => prev / 2)
      setCurrentLevel(prev => prev - 1)
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

  // Calculate burn percentage for joint animation
  function getBurnPercentage() {
    const totalSeconds = timerDuration * 60
    const percentage = (timeRemaining / totalSeconds) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  return (
    <div className={styles.container}>
      {/* Left Panel - Poker Timer */}
      <div className={styles.leftPanel}>
        <div className={styles.app}>
          <header className={styles.header}>
            <h1>♠ POKER BLIND TIMER ♣</h1>
          </header>

          {/* Timer Display Section */}
          <section className={styles.timerSection}>
            <div className={styles.levelDisplay}>LEVEL {currentLevel}</div>
            <div className={styles.timerDisplay}>{formatTime(timeRemaining)}</div>

            {/* Burning Joint Animation */}
            <div className={styles.jointContainer}>
              <div className={styles.joint}>
                {/* Unburned portion */}
                <div
                  className={styles.jointUnburned}
                  style={{ width: `${getBurnPercentage()}%` }}
                />
                {/* Burned portion (ash) */}
                <div
                  className={styles.jointBurned}
                  style={{ width: `${100 - getBurnPercentage()}%` }}
                />
                {/* Ember at the burning point */}
                {getBurnPercentage() > 0 && getBurnPercentage() < 100 && (
                  <div
                    className={styles.jointEmber}
                    style={{ left: `${getBurnPercentage()}%` }}
                  />
                )}
              </div>
            </div>

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
            <div className={styles.blindControls}>
              <button
                onClick={handleBlindsUp}
                className={styles.blindBtn}
                title="Double blinds (level up)"
              >
                ▲ DOUBLE
              </button>
              <button
                onClick={handleBlindsDown}
                className={styles.blindBtn}
                disabled={currentLevel <= 1}
                title="Halve blinds (level down)"
              >
                ▼ HALVE
              </button>
            </div>

            <div className={styles.blindInfo}>
              <h2>SMALL BLIND: {smallBlind}</h2>
              <ChipBreakdownDisplay options={calculateAllPaymentOptions(smallBlind)} />
            </div>

            <div className={styles.blindInfo}>
              <h2>BIG BLIND: {bigBlind}</h2>
              <ChipBreakdownDisplay options={calculateAllPaymentOptions(bigBlind)} />
            </div>
          </section>
        </div>
      </div>

      {/* Right Panel - Spotify */}
      <div className={styles.rightPanel}>
        <div className={styles.spotifyContainer}>
          <iframe
            src="https://open.spotify.com/embed/playlist/2GfUZqd0vjXI06vYsWLRXe?utm_source=generator&theme=0"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Playlist"
          />
        </div>
      </div>
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
