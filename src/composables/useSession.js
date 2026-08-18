import { ref, watch, computed } from 'vue'

const STORAGE_KEY = 'jjtimer_data'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Failed to load data:', e)
    return null
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save data:', e)
  }
}

export function useSession() {
  const stored = loadData()
  
  const sessions = ref(stored?.sessions || [{
    id: generateId(),
    name: 'Session 1',
    event: '333',
    solves: [],
    createdAt: Date.now()
  }])
  
  const activeSessionId = ref(stored?.activeSessionId || sessions.value[0]?.id)
  
  const activeSession = computed(() => {
    return sessions.value.find(s => s.id === activeSessionId.value) || sessions.value[0]
  })
  
  const solves = computed(() => {
    return activeSession.value?.solves || []
  })
  
  // Auto-save on any change
  watch([sessions, activeSessionId], () => {
    saveData({
      sessions: sessions.value,
      activeSessionId: activeSessionId.value
    })
  }, { deep: true })
  
  function addSolve(solve) {
    const session = sessions.value.find(s => s.id === activeSessionId.value)
    if (session) {
      session.solves.push({
        id: generateId(),
        time: solve.time,
        scramble: solve.scramble,
        event: solve.event,
        date: Date.now(),
        penalty: solve.penalty || 'none',
        comment: ''
      })
    }
  }
  
  function deleteSolve(solveId) {
    const session = sessions.value.find(s => s.id === activeSessionId.value)
    if (session) {
      session.solves = session.solves.filter(s => s.id !== solveId)
    }
  }
  
  function updateSolvePenalty(solveId, penalty) {
    const session = sessions.value.find(s => s.id === activeSessionId.value)
    if (session) {
      const solve = session.solves.find(s => s.id === solveId)
      if (solve) {
        solve.penalty = penalty
      }
    }
  }
  
  function createSession(name, event) {
    const newSession = {
      id: generateId(),
      name: name || `Session ${sessions.value.length + 1}`,
      event: event || '333',
      solves: [],
      createdAt: Date.now()
    }
    sessions.value.push(newSession)
    activeSessionId.value = newSession.id
    return newSession
  }
  
  function deleteSession(sessionId) {
    if (sessions.value.length <= 1) return // Don't delete the last session
    sessions.value = sessions.value.filter(s => s.id !== sessionId)
    if (activeSessionId.value === sessionId) {
      activeSessionId.value = sessions.value[0]?.id
    }
  }
  
  function renameSession(sessionId, newName) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.name = newName
    }
  }
  
  function setActiveSession(sessionId) {
    activeSessionId.value = sessionId
  }
  
  function exportData() {
    const data = JSON.stringify({
      sessions: sessions.value,
      exportedAt: new Date().toISOString(),
      version: 1
    }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jjtimer-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  function importData(jsonString) {
    try {
      const data = JSON.parse(jsonString)
      if (data.sessions && Array.isArray(data.sessions)) {
        sessions.value = data.sessions
        activeSessionId.value = sessions.value[0]?.id
        return true
      }
      return false
    } catch (e) {
      console.error('Failed to import data:', e)
      return false
    }
  }
  
  function clearAllData() {
    sessions.value = [{
      id: generateId(),
      name: 'Session 1',
      event: '333',
      solves: [],
      createdAt: Date.now()
    }]
    activeSessionId.value = sessions.value[0].id
  }
  
  return {
    sessions,
    activeSessionId,
    activeSession,
    solves,
    addSolve,
    deleteSolve,
    updateSolvePenalty,
    createSession,
    deleteSession,
    renameSession,
    setActiveSession,
    exportData,
    importData,
    clearAllData
  }
}
