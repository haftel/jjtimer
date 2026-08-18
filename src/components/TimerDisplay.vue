<template>
  <div
    class="timer-area"
    @mousedown.self="handleMouseDown"
    @mouseup.self="handleMouseUp"
    @touchstart.prevent="$emit('interaction-start')"
    @touchend.prevent="$emit('interaction-end')"
  >
    <!-- Scramble -->
    <div :class="['scramble-display', { loading: scrambleLoading }]">
      {{ scrambleLoading ? 'Generating scramble...' : scramble }}
    </div>

    <!-- Timer -->
    <div :class="timerClasses">
      <template v-if="isInspecting">
        {{ inspectionTime > 0 ? inspectionTime : (penalty === '+2' ? '+2' : 'DNF') }}
      </template>
      <template v-else>
        {{ displayTime }}
      </template>
    </div>

    <!-- Penalty indicator -->
    <div v-if="timerState === 'stopped' && penalty !== 'none'" class="timer-penalty">
      {{ penalty === '+2' ? '+2 penalty' : 'DNF' }}
    </div>

    <!-- Contextual Hint -->
    <div class="timer-hint">
      <template v-if="timerState === 'inspecting' || (isHolding && isInspecting)">
        {{ isHoldReady ? 'Release to start' : 'Hold space to get ready' }}
      </template>
      <template v-else-if="timerState === 'idle' || timerState === 'stopped'">
        <template v-if="isInspectionEnabled">
          Press Space to inspect (15s)
        </template>
        <template v-else>
          {{ isHolding ? (isHoldReady ? 'Release to start' : 'Hold to get ready') : 'Hold space to start' }}
        </template>
      </template>
      <template v-else-if="timerState === 'holding'">
        {{ isHoldReady ? 'Release to start' : 'Hold to get ready' }}
      </template>
      <template v-else-if="timerState === 'ready'">
        Release to start
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  timerState: { type: String, default: 'idle' },
  displayTime: { type: String, default: '0.00' },
  inspectionTime: { type: Number, default: 15 },
  inspectionAlert: { type: Boolean, default: false },
  inspectionWarning: { type: Boolean, default: false },
  penalty: { type: String, default: 'none' },
  scramble: { type: String, default: '' },
  scrambleLoading: { type: Boolean, default: false },
  isInspectionEnabled: { type: Boolean, default: false },
  isHolding: { type: Boolean, default: false },
  isHoldReady: { type: Boolean, default: false }
})

const emit = defineEmits(['interaction-start', 'interaction-end'])

const isInspecting = computed(() => {
  return props.timerState === 'inspecting' ||
    ((props.timerState === 'holding' || props.timerState === 'ready') && props.inspectionTime < 15 && props.timerState !== 'running' && props.timerState !== 'stopped' && props.timerState !== 'idle')
})

const timerClasses = computed(() => {
  const base = 'timer-display'
  const state = props.timerState

  // If hold ready, always show green
  if (props.isHoldReady) {
    return [base, 'timer-display--ready']
  }

  // If holding (before ready threshold), show red/holding color
  if (props.isHolding) {
    return [base, 'timer-display--holding']
  }

  if (state === 'inspecting') {
    return [
      base,
      'timer-display--inspecting',
      {
        'timer-display--inspection-warn': props.inspectionWarning || props.inspectionTime <= 3
      }
    ]
  }

  return [base, `timer-display--${state}`]
})

function handleMouseDown(e) {
  if (e.button === 0) { // Left click only
    emit('interaction-start')
  }
}

function handleMouseUp(e) {
  if (e.button === 0) {
    emit('interaction-end')
  }
}
</script>
