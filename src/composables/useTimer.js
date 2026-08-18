import { ref, computed, onUnmounted } from 'vue'

export function formatTime(ms, penalty = 'none') {
  if (penalty === 'DNF') return 'DNF'
  if (ms === null || ms === undefined || ms < 0) return '0.00'

  let adjustedMs = penalty === '+2' ? ms + 2000 : ms

  const totalSeconds = adjustedMs / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  let formatted
  if (minutes > 0) {
    formatted = `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`
  } else {
    formatted = seconds.toFixed(2)
  }

  return penalty === '+2' ? `${formatted}+` : formatted
}

export function useTimer() {
  const timerState = ref('idle') // idle, inspecting, holding, ready, running, stopped
  const startTime = ref(null)
  const elapsedTime = ref(0)
  const inspectionStartTime = ref(null)
  const inspectionTime = ref(15)
  const inspectionAlert = ref(false) // 8s warning (<= 7s left)
  const inspectionWarning = ref(false) // 12s warning (<= 3s left)
  const penalty = ref('none') // none, +2, DNF
  const isInspectionEnabled = ref(false)
  const isHolding = ref(false)
  const isHoldReady = ref(false)

  let animationFrameId = null
  let inspectionIntervalId = null
  let holdTimeoutId = null

  const displayTime = computed(() => {
    return formatTime(elapsedTime.value, penalty.value)
  })

  const formattedTime = displayTime

  function updateTimer() {
    if (timerState.value === 'running' && startTime.value !== null) {
      elapsedTime.value = performance.now() - startTime.value
      animationFrameId = requestAnimationFrame(updateTimer)
    }
  }

  function startInspection() {
    if (inspectionIntervalId) clearInterval(inspectionIntervalId)
    timerState.value = 'inspecting'
    inspectionStartTime.value = performance.now()
    inspectionTime.value = 15
    inspectionAlert.value = false
    inspectionWarning.value = false
    penalty.value = 'none'
    isHolding.value = false
    isHoldReady.value = false

    inspectionIntervalId = setInterval(() => {
      if (timerState.value !== 'inspecting' && timerState.value !== 'holding' && timerState.value !== 'ready') {
        clearInterval(inspectionIntervalId)
        return
      }

      const elapsed = (performance.now() - inspectionStartTime.value) / 1000
      inspectionTime.value = Math.ceil(15 - elapsed)

      if (inspectionTime.value <= 7 && inspectionTime.value > 3) {
        inspectionAlert.value = true
      }
      if (inspectionTime.value <= 3) {
        inspectionWarning.value = true
      }

      if (elapsed >= 17) {
        penalty.value = 'DNF'
        timerState.value = 'stopped'
        elapsedTime.value = 0
        if (holdTimeoutId) clearTimeout(holdTimeoutId)
        clearInterval(inspectionIntervalId)
      } else if (elapsed >= 15) {
        penalty.value = '+2'
        inspectionTime.value = 0
      }
    }, 100)
  }

  function startInteraction() {
    // 1. If currently running, stop immediately
    if (timerState.value === 'running') {
      elapsedTime.value = performance.now() - startTime.value
      timerState.value = 'stopped'
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      return
    }

    // 2. If at resting state (idle or stopped) and inspection is enabled:
    // Start inspection IMMEDIATELY (0ms delay)
    if ((timerState.value === 'idle' || timerState.value === 'stopped') && isInspectionEnabled.value) {
      startInspection()
      return
    }

    // 3. If in inspection mode:
    // Holding space initiates the 300ms hold to start the solve
    if (timerState.value === 'inspecting') {
      isHolding.value = true
      isHoldReady.value = false
      if (holdTimeoutId) clearTimeout(holdTimeoutId)

      holdTimeoutId = setTimeout(() => {
        if (isHolding.value && (timerState.value === 'inspecting' || timerState.value === 'holding')) {
          isHoldReady.value = true
          timerState.value = 'ready'
        }
      }, 300)
      return
    }

    // 4. If at resting state (idle or stopped) and inspection is disabled:
    // Holding space initiates the 300ms hold to start the solve
    if (timerState.value === 'idle' || timerState.value === 'stopped') {
      timerState.value = 'holding'
      isHolding.value = true
      isHoldReady.value = false
      if (holdTimeoutId) clearTimeout(holdTimeoutId)

      holdTimeoutId = setTimeout(() => {
        if (isHolding.value && timerState.value === 'holding') {
          isHoldReady.value = true
          timerState.value = 'ready'
        }
      }, 300)
    }
  }

  function endInteraction() {
    // If ready (300ms hold reached), start timer!
    if (timerState.value === 'ready' && isHoldReady.value) {
      if (inspectionIntervalId) clearInterval(inspectionIntervalId)
      if (holdTimeoutId) clearTimeout(holdTimeoutId)
      timerState.value = 'running'
      startTime.value = performance.now()
      elapsedTime.value = 0
      isHolding.value = false
      isHoldReady.value = false
      animationFrameId = requestAnimationFrame(updateTimer)
      return
    }

    // If released before 300ms hold was ready:
    isHolding.value = false
    isHoldReady.value = false
    if (holdTimeoutId) clearTimeout(holdTimeoutId)

    if (timerState.value === 'holding') {
      timerState.value = 'idle'
    } else if (timerState.value === 'ready') {
      timerState.value = 'idle'
    }
    // If released during inspection before ready, stay in inspecting!
  }

  function stopTimer() {
    if (timerState.value === 'running') {
      elapsedTime.value = performance.now() - startTime.value
      timerState.value = 'stopped'
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }

  function reset() {
    timerState.value = 'idle'
    startTime.value = null
    elapsedTime.value = 0
    inspectionStartTime.value = null
    inspectionTime.value = 15
    inspectionAlert.value = false
    inspectionWarning.value = false
    penalty.value = 'none'
    isHolding.value = false
    isHoldReady.value = false
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (inspectionIntervalId) clearInterval(inspectionIntervalId)
    if (holdTimeoutId) clearTimeout(holdTimeoutId)
  }

  function setPenalty(p) {
    penalty.value = p
  }

  onUnmounted(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
    if (inspectionIntervalId) clearInterval(inspectionIntervalId)
    if (holdTimeoutId) clearTimeout(holdTimeoutId)
  })

  return {
    timerState,
    displayTime,
    formattedTime,
    elapsedTime,
    inspectionTime,
    inspectionAlert,
    inspectionWarning,
    penalty,
    isInspectionEnabled,
    isHolding,
    isHoldReady,
    startInteraction,
    endInteraction,
    stopTimer,
    reset,
    setPenalty
  }
}
