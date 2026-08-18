<template>
  <div class="panel-content">
    <div class="stats-grid">
      <!-- Solve count -->
      <div class="stat-item" style="grid-column: 1 / -1;">
        <div class="stat-label">Solves</div>
        <div class="stat-value">{{ stats.count || 0 }}</div>
      </div>

      <div class="stat-divider"></div>

      <!-- Singles -->
      <div class="stat-item">
        <div class="stat-label">Best</div>
        <div :class="['stat-value', stats.best !== null ? 'stat-value--best' : 'stat-value--na']">
          {{ stats.best !== null ? formatTime(stats.best) : '-' }}
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Current</div>
        <div :class="['stat-value', stats.current !== null ? '' : 'stat-value--na']">
          {{ stats.current !== null ? formatTime(stats.current) : '-' }}
        </div>
      </div>

      <div class="stat-divider"></div>

      <!-- Current Averages -->
      <div class="stat-item">
        <div class="stat-label">ao5</div>
        <div :class="['stat-value', stats.ao5 !== null ? '' : 'stat-value--na']">
          {{ formatStat(stats.ao5) }}
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Best ao5</div>
        <div :class="['stat-value', stats.bestAo5 !== null ? 'stat-value--best' : 'stat-value--na']">
          {{ formatStat(stats.bestAo5) }}
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-label">ao12</div>
        <div :class="['stat-value', stats.ao12 !== null ? '' : 'stat-value--na']">
          {{ formatStat(stats.ao12) }}
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Best ao12</div>
        <div :class="['stat-value', stats.bestAo12 !== null ? 'stat-value--best' : 'stat-value--na']">
          {{ formatStat(stats.bestAo12) }}
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-label">ao50</div>
        <div :class="['stat-value', stats.ao50 !== null ? '' : 'stat-value--na']">
          {{ formatStat(stats.ao50) }}
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Best ao50</div>
        <div :class="['stat-value', stats.bestAo50 !== null ? 'stat-value--best' : 'stat-value--na']">
          {{ formatStat(stats.bestAo50) }}
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-label">ao100</div>
        <div :class="['stat-value', stats.ao100 !== null ? '' : 'stat-value--na']">
          {{ formatStat(stats.ao100) }}
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Best ao100</div>
        <div :class="['stat-value', stats.bestAo100 !== null ? 'stat-value--best' : 'stat-value--na']">
          {{ formatStat(stats.bestAo100) }}
        </div>
      </div>

      <div class="stat-divider"></div>

      <!-- Mean -->
      <div class="stat-item">
        <div class="stat-label">mo3</div>
        <div :class="['stat-value', stats.mo3 !== null ? '' : 'stat-value--na']">
          {{ formatStat(stats.mo3) }}
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Best mo3</div>
        <div :class="['stat-value', stats.bestMo3 !== null ? 'stat-value--best' : 'stat-value--na']">
          {{ formatStat(stats.bestMo3) }}
        </div>
      </div>

      <div class="stat-divider"></div>

      <!-- Session mean -->
      <div class="stat-item" style="grid-column: 1 / -1;">
        <div class="stat-label">Session Mean</div>
        <div :class="['stat-value', stats.sessionMean !== null ? '' : 'stat-value--na']">
          {{ stats.sessionMean !== null ? formatTime(stats.sessionMean) : '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '../composables/useTimer.js'

defineProps({
  stats: {
    type: Object,
    default: () => ({
      count: 0, best: null, worst: null, current: null, sessionMean: null,
      ao5: null, ao12: null, ao50: null, ao100: null,
      bestAo5: null, bestAo12: null, bestAo50: null, bestAo100: null,
      mo3: null, bestMo3: null
    })
  }
})

function formatStat(value) {
  if (value === null || value === undefined) return '-'
  if (value === Infinity) return 'DNF'
  return formatTime(value)
}
</script>
