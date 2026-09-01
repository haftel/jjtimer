<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-header">
      <div style="display: flex; align-items: center; gap: var(--space-4);">
        <button
          class="btn btn--icon"
          :class="{ 'btn--accent': leftPanelOpen }"
          @click="leftPanelOpen = !leftPanelOpen"
          title="Toggle Solves List"
          aria-label="Toggle Solves List"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>

        <div class="app-logo">
          jj<span>Timer</span>
        </div>

        <ScrambleBar
          :current-event="currentEvent"
          :events="WCA_EVENTS"
          @select-event="handleEventChange"
        />
      </div>

      <div style="display: flex; align-items: center; gap: var(--space-2);">
        <button
          class="btn btn--icon"
          @click="fetchNewScramble"
          title="New Scramble"
          aria-label="New Scramble"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
        </button>

        <button
          class="btn btn--icon"
          :class="{ 'btn--accent': netOpen }"
          @click="netOpen = !netOpen"
          title="Toggle Scramble Visualization"
          aria-label="Toggle Scramble Visualization"
          aria-expanded="netOpen"
        >
          <!-- Cube net icon: simplified unfolded cross shape -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="1" width="6" height="6" rx="1"/>
            <rect x="9" y="9" width="6" height="6" rx="1"/>
            <rect x="9" y="17" width="6" height="6" rx="1"/>
            <rect x="1" y="9" width="6" height="6" rx="1"/>
            <rect x="17" y="9" width="6" height="6" rx="1"/>
          </svg>
        </button>

        <button
          class="btn btn--icon"
          :class="{ 'btn--accent': rightPanelOpen && activeRightTab === 'stats' }"
          @click="toggleRightPanel('stats')"
          title="Statistics"
          aria-label="Statistics"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </button>

        <button
          class="btn btn--icon"
          :class="{ 'btn--accent': rightPanelOpen && activeRightTab === 'settings' }"
          @click="toggleRightPanel('settings')"
          title="Settings"
          aria-label="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- Collapsible Scramble Visualization Strip -->
    <div v-if="netOpen" class="scramble-net-bar" role="region" aria-label="Scramble Visualization">
      <CubeNetViewer
        :scramble="currentScramble"
        :event-code="currentEvent"
      />
    </div>

    <!-- Main Content Area -->
    <main class="app-body">
      <!-- Left Panel: Solves List -->
      <aside :class="['panel', 'panel--left', { 'panel--collapsed': !leftPanelOpen }]">
        <div class="panel-header">
          <div class="panel-title">Solves ({{ solves.length }})</div>
          <button class="btn btn--icon btn--small" @click="leftPanelOpen = false" title="Close Panel">
            ✕
          </button>
        </div>
        <TimeList
          :solves="solves"
          @update-penalty="updateSolvePenalty"
          @delete-solve="deleteSolve"
        />
      </aside>

      <!-- Center: Timer Display -->
      <TimerDisplay
        :timer-state="timerState"
        :display-time="formattedTimerDisplay"
        :inspection-time="inspectionTime"
        :inspection-alert="inspectionAlert"
        :inspection-warning="inspectionWarning"
        :penalty="penalty"
        :scramble="currentScramble"
        :scramble-loading="isLoading"
        :is-inspection-enabled="isInspectionEnabled"
        :is-holding="isHolding"
        :is-hold-ready="isHoldReady"
        @interaction-start="handleInteractionStart"
        @interaction-end="handleInteractionEnd"
      />

      <!-- Right Panel: Stats / Settings -->
      <aside :class="['panel', 'panel--right', { 'panel--collapsed': !rightPanelOpen }]">
        <div class="panel-header">
          <div style="display: flex; gap: var(--space-2);">
            <button
              :class="['btn btn--small', { 'btn--accent': activeRightTab === 'stats' }]"
              @click="activeRightTab = 'stats'"
            >
              Stats
            </button>
            <button
              :class="['btn btn--small', { 'btn--accent': activeRightTab === 'settings' }]"
              @click="activeRightTab = 'settings'"
            >
              Settings
            </button>
          </div>
          <button class="btn btn--icon btn--small" @click="rightPanelOpen = false" title="Close Panel">
            ✕
          </button>
        </div>

        <StatsPanel
          v-if="activeRightTab === 'stats'"
          :stats="stats"
        />

        <SettingsPanel
          v-else-if="activeRightTab === 'settings'"
          :settings="settings"
          @update-setting="updateSetting"
          @export-data="exportData"
          @import-data="importData"
          @clear-data="clearAllData"
        />
      </aside>
    </main>

    <!-- Bottom: Session Manager -->
    <footer class="app-session-bar-wrapper">
      <SessionManager
        :sessions="sessions"
        :active-session-id="activeSessionId"
        @select-session="setActiveSession"
        @create-session="handleCreateSession"
        @delete-session="deleteSession"
        @rename-session="renameSession"
      />
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTimer, formatTime } from './composables/useTimer.js'
import { useScramble, WCA_EVENTS } from './composables/useScramble.js'
import { useSession } from './composables/useSession.js'
import { useStatistics } from './composables/useStatistics.js'

import TimerDisplay from './components/TimerDisplay.vue'
import ScrambleBar from './components/ScrambleBar.vue'
import TimeList from './components/TimeList.vue'
import StatsPanel from './components/StatsPanel.vue'
import SessionManager from './components/SessionManager.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import CubeNetViewer from './components/CubeNetViewer.vue'

// UI State
const leftPanelOpen = ref(true)
const rightPanelOpen = ref(true)
const activeRightTab = ref('stats')
const netOpen = ref(false)  // Cube net scramble visualization strip

// Responsive adjustments on mount
onMounted(() => {
  if (window.innerWidth < 768) {
    leftPanelOpen.value = false
    rightPanelOpen.value = false
  }
})

// Settings (persisted in localStorage)
const SETTINGS_KEY = 'jjtimer_settings'
const defaultSettings = {
  inspection: false,
  hideRunning: false,
  threeDecimals: false
}

function loadSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings
  } catch (e) {
    return defaultSettings
  }
}

const settings = ref(loadSettings())

function updateSetting(key, value) {
  settings.value[key] = value
}

function toggleRightPanel(tab) {
  if (rightPanelOpen.value && activeRightTab.value === tab) {
    rightPanelOpen.value = false
  } else {
    activeRightTab.value = tab
    rightPanelOpen.value = true
  }
}

// Scramble Composable
const { currentEvent, currentScramble, isLoading, fetchNewScramble, setEvent } = useScramble()

// Session & Data Composable
const {
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
} = useSession()

// Statistics Composable
const { stats } = useStatistics(solves)

// Timer Composable
const {
  timerState,
  displayTime,
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
  reset
} = useTimer()

// Initialize and sync inspection setting
isInspectionEnabled.value = !!settings.value.inspection

watch(settings, (val) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(val))
  isInspectionEnabled.value = !!val.inspection
}, { deep: true })

// Format timer display based on settings
const formattedTimerDisplay = computed(() => {
  if (settings.value.hideRunning && timerState.value === 'running') {
    return 'Solving...'
  }
  if (settings.value.threeDecimals && (timerState.value === 'running' || timerState.value === 'stopped')) {
    if (penalty.value === 'DNF') return 'DNF'
    const totalMs = penalty.value === '+2' ? elapsedTime.value + 2000 : elapsedTime.value
    const totalSecs = totalMs / 1000
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    let res = mins > 0 ? `${mins}:${secs.toFixed(3).padStart(6, '0')}` : secs.toFixed(3)
    return penalty.value === '+2' ? `${res}+` : res
  }
  return displayTime.value
})

// Watch timer stop to save solve and load new scramble
watch(timerState, (newState, oldState) => {
  if (oldState === 'running' && newState === 'stopped') {
    if (elapsedTime.value > 0 || penalty.value === 'DNF') {
      addSolve({
        time: elapsedTime.value,
        scramble: currentScramble.value,
        event: currentEvent.value,
        penalty: penalty.value
      })
      fetchNewScramble()
    }
  } else if ((oldState === 'inspecting' || oldState === 'holding' || oldState === 'ready') && newState === 'stopped' && penalty.value === 'DNF') {
    // Inspection exceeded 17 seconds -> DNF recorded
    addSolve({
      time: 0,
      scramble: currentScramble.value,
      event: currentEvent.value,
      penalty: 'DNF'
    })
    fetchNewScramble()
  }
})

// Handlers
function handleEventChange(code) {
  setEvent(code)
}

function handleCreateSession() {
  createSession(`Session ${sessions.value.length + 1}`, currentEvent.value)
}

function handleInteractionStart() {
  startInteraction()
}

function handleInteractionEnd() {
  endInteraction()
}

// Global Keyboard Handler
let spacePressed = false

function shouldIgnoreKey(e) {
  const tag = e.target.tagName?.toLowerCase()
  return tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable
}

function onKeyDown(e) {
  if (shouldIgnoreKey(e)) return

  if (timerState.value === 'running') {
    e.preventDefault()
    stopTimer()
    return
  }

  if (e.code === 'Space') {
    e.preventDefault()
    if (!spacePressed) {
      spacePressed = true
      startInteraction()
    }
  }
}

function onKeyUp(e) {
  if (shouldIgnoreKey(e)) return

  if (e.code === 'Space') {
    e.preventDefault()
    spacePressed = false
    endInteraction()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>

<style>
.app-session-bar-wrapper {
  flex-shrink: 0;
}
</style>
