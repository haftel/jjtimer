<template>
  <div class="panel-content">
    <div v-if="solves.length === 0" style="text-align: center; padding: 2rem 0; color: var(--text-tertiary); font-size: var(--text-sm);">
      No solves yet
    </div>
    <ul v-else class="time-list">
      <li
        v-for="(solve, index) in reversedSolves"
        :key="solve.id"
        class="time-list-item"
        @click.stop="openSolveMenu($event, solve, solves.length - index)"
        role="button"
        tabindex="0"
        @keydown.enter="openSolveMenu($event, solve, solves.length - index)"
        @keydown.space.prevent="openSolveMenu($event, solve, solves.length - index)"
        title="Click to edit penalty or delete solve"
      >
        <span class="time-list-index">{{ solves.length - index }}</span>
        <span :class="timeClass(solve)">{{ formatSolveTime(solve) }}</span>
        <span class="time-list-avg">{{ getAo5(solves.length - index - 1) }}</span>
      </li>
    </ul>

    <!-- Solve Actions Dialog -->
    <Teleport to="body">
      <div v-if="activeSolveModal.visible" class="modal-overlay" @click.self="closeSolveModal">
        <div class="modal" style="max-width: 380px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-3);">
            <div class="modal-title" style="margin-bottom: 0;">
              Solve #{{ activeSolveModal.solveNumber }}
            </div>
            <span style="font-family: var(--font-mono); font-size: var(--text-xl); font-weight: 700; color: var(--accent);">
              {{ formatSolveTime(activeSolveModal.solve) }}
            </span>
          </div>

          <div v-if="activeSolveModal.solve?.scramble" style="background: var(--bg-tertiary); padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.5; margin-bottom: var(--space-4); word-break: break-word;">
            {{ activeSolveModal.solve.scramble }}
          </div>

          <div style="font-size: var(--text-xs); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: var(--space-2);">
            Penalty
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-2); margin-bottom: var(--space-6);">
            <button
              :class="['btn', { 'btn--accent': (activeSolveModal.solve?.penalty || 'none') === 'none' }]"
              style="border: 1px solid var(--border-default);"
              @click="setPenalty('none')"
            >
              OK
            </button>
            <button
              :class="['btn', { 'btn--accent': activeSolveModal.solve?.penalty === '+2' }]"
              style="border: 1px solid var(--border-default);"
              @click="setPenalty('+2')"
            >
              +2
            </button>
            <button
              :class="['btn', { 'btn--accent': activeSolveModal.solve?.penalty === 'DNF' }]"
              style="border: 1px solid var(--border-default);"
              @click="setPenalty('DNF')"
            >
              DNF
            </button>
          </div>

          <div class="modal-actions" style="justify-content: space-between; margin-top: var(--space-4);">
            <button class="btn btn--danger" @click="deleteSolve">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete Solve
            </button>
            <button class="btn" @click="closeSolveModal">Done</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatTime } from '../composables/useTimer.js'

const props = defineProps({
  solves: { type: Array, default: () => [] }
})

const emit = defineEmits(['update-penalty', 'delete-solve'])

const activeSolveModal = ref({ visible: false, solve: null, solveNumber: null })

const reversedSolves = computed(() => [...props.solves].reverse())

function formatSolveTime(solve) {
  if (!solve) return '0.00'
  return formatTime(solve.time, solve.penalty)
}

function timeClass(solve) {
  return [
    'time-list-time',
    { 'time-list-time--dnf': solve.penalty === 'DNF' },
    { 'time-list-time--plus2': solve.penalty === '+2' }
  ]
}

function getAo5(index) {
  if (index < 4) return ''
  const window = props.solves.slice(index - 4, index + 1)
  const times = window.map(s => {
    if (s.penalty === 'DNF') return Infinity
    return s.penalty === '+2' ? s.time + 2000 : s.time
  })
  const sorted = [...times].sort((a, b) => a - b)
  const trimmed = sorted.slice(1, -1)
  if (trimmed.some(t => t === Infinity)) return 'DNF'
  const avg = trimmed.reduce((s, t) => s + t, 0) / trimmed.length
  return formatTime(avg)
}

function openSolveMenu(e, solve, solveNumber) {
  activeSolveModal.value = { visible: true, solve, solveNumber }
}

function closeSolveModal() {
  activeSolveModal.value = { visible: false, solve: null, solveNumber: null }
}

function setPenalty(penalty) {
  if (activeSolveModal.value.solve) {
    emit('update-penalty', activeSolveModal.value.solve.id, penalty)
    activeSolveModal.value.solve.penalty = penalty
  }
}

function deleteSolve() {
  if (activeSolveModal.value.solve) {
    emit('delete-solve', activeSolveModal.value.solve.id)
  }
  closeSolveModal()
}
</script>
