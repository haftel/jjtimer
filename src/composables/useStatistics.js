import { computed } from 'vue'

// Get the effective time for a solve (applies +2 penalty)
function getEffectiveTime(solve) {
  if (solve.penalty === 'DNF') return Infinity
  return solve.penalty === '+2' ? solve.time + 2000 : solve.time
}

// Calculate trimmed average (remove best and worst, take mean of rest)
// Returns Infinity if any remaining solve is DNF
function trimmedAverage(solves) {
  if (solves.length < 3) return null
  
  const times = solves.map(s => getEffectiveTime(s))
  const sorted = [...times].sort((a, b) => a - b)
  
  // Remove best and worst
  const trimmed = sorted.slice(1, -1)
  
  // If any remaining solve is DNF (Infinity), the average is DNF
  if (trimmed.some(t => t === Infinity)) return Infinity
  
  return trimmed.reduce((sum, t) => sum + t, 0) / trimmed.length
}

// Calculate mean (for mo3 — used in 6x6, 7x7, BLD, FMC)
function mean(solves) {
  if (solves.length === 0) return null
  
  const times = solves.map(s => getEffectiveTime(s))
  
  // If any solve is DNF, mean is DNF
  if (times.some(t => t === Infinity)) return Infinity
  
  return times.reduce((sum, t) => sum + t, 0) / times.length
}

export function useStatistics(solves) {
  const stats = computed(() => {
    const s = solves.value || []
    if (s.length === 0) {
      return {
        count: 0,
        best: null,
        worst: null,
        current: null,
        sessionMean: null,
        ao5: null,
        ao12: null,
        ao50: null,
        ao100: null,
        bestAo5: null,
        bestAo12: null,
        bestAo50: null,
        bestAo100: null,
        mo3: null,
        bestMo3: null
      }
    }
    
    // Effective times (for best/worst calculation)
    const effectiveTimes = s.map(solve => ({
      time: getEffectiveTime(solve),
      solve
    }))
    
    // Filter out DNFs for best calculation
    const validTimes = effectiveTimes.filter(t => t.time !== Infinity)
    
    const best = validTimes.length > 0 
      ? Math.min(...validTimes.map(t => t.time)) 
      : null
    
    const worst = effectiveTimes.length > 0 
      ? Math.max(...effectiveTimes.map(t => t.time)) 
      : null
    
    const current = s.length > 0 
      ? getEffectiveTime(s[s.length - 1]) 
      : null
    
    // Session mean (excluding DNFs)
    const sessionMean = validTimes.length > 0 
      ? validTimes.reduce((sum, t) => sum + t.time, 0) / validTimes.length 
      : null
    
    // Current averages (last N solves)
    function currentAvg(n) {
      if (s.length < n) return null
      return trimmedAverage(s.slice(-n))
    }
    
    // Best average (scan all windows of size n)
    function bestAvg(n) {
      if (s.length < n) return null
      let best = Infinity
      for (let i = 0; i <= s.length - n; i++) {
        const avg = trimmedAverage(s.slice(i, i + n))
        if (avg !== null && avg < best) {
          best = avg
        }
      }
      return best === Infinity ? Infinity : best
    }
    
    // Current mo3
    function currentMo3() {
      if (s.length < 3) return null
      return mean(s.slice(-3))
    }
    
    // Best mo3
    function bestMo3() {
      if (s.length < 3) return null
      let best = Infinity
      for (let i = 0; i <= s.length - 3; i++) {
        const m = mean(s.slice(i, i + 3))
        if (m !== null && m < best) {
          best = m
        }
      }
      return best === Infinity ? Infinity : best
    }
    
    return {
      count: s.length,
      best: best === Infinity ? null : best,
      worst: worst === Infinity ? null : worst,
      current: current === Infinity ? null : current,
      sessionMean,
      ao5: currentAvg(5),
      ao12: currentAvg(12),
      ao50: currentAvg(50),
      ao100: currentAvg(100),
      bestAo5: bestAvg(5),
      bestAo12: bestAvg(12),
      bestAo50: bestAvg(50),
      bestAo100: bestAvg(100),
      mo3: currentMo3(),
      bestMo3: bestMo3()
    }
  })
  
  return { stats }
}
