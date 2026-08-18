<template>
  <div class="panel-content">
    <!-- Timer Settings -->
    <div class="settings-section">
      <div class="settings-section-title">Timer</div>
      
      <div class="settings-row">
        <span class="settings-label">Inspection (15s)</span>
        <label class="toggle">
          <input type="checkbox" :checked="settings.inspection" @change="toggle('inspection')" />
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="settings-row">
        <span class="settings-label">Hide time while solving</span>
        <label class="toggle">
          <input type="checkbox" :checked="settings.hideRunning" @change="toggle('hideRunning')" />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- Display Settings -->
    <div class="settings-section">
      <div class="settings-section-title">Display</div>
      
      <div class="settings-row">
        <span class="settings-label">3 decimal places</span>
        <label class="toggle">
          <input type="checkbox" :checked="settings.threeDecimals" @change="toggle('threeDecimals')" />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- Data -->
    <div class="settings-section">
      <div class="settings-section-title">Data</div>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-2);">
        <button class="btn" @click="$emit('export-data')">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2V9M7 9L4 6M7 9L10 6M2 12H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Export JSON
        </button>
        
        <button class="btn" @click="triggerImport">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 9V2M7 2L4 5M7 2L10 5M2 12H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Import JSON
        </button>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none;"
          @change="handleImport"
        />

        <div style="margin-top: var(--space-4);">
          <button class="btn btn--danger" @click="confirmClear">
            Clear All Data
          </button>
        </div>
      </div>
    </div>

    <!-- Clear confirmation modal -->
    <Teleport to="body">
      <div v-if="showClearConfirm" class="modal-overlay" @click.self="showClearConfirm = false">
        <div class="modal">
          <div class="modal-title">Clear All Data?</div>
          <p style="color: var(--text-secondary); font-size: var(--text-sm); line-height: 1.6;">
            This will permanently delete all sessions and solve history. This action cannot be undone.
          </p>
          <div class="modal-actions">
            <button class="btn" @click="showClearConfirm = false">Cancel</button>
            <button class="btn btn--danger" @click="clearAll">Delete Everything</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  settings: {
    type: Object,
    default: () => ({
      inspection: false,
      hideRunning: false,
      threeDecimals: false
    })
  }
})

const emit = defineEmits(['update-setting', 'export-data', 'import-data', 'clear-data'])

const fileInput = ref(null)
const showClearConfirm = ref(false)

function toggle(key) {
  emit('update-setting', key, !props.settings[key])
}

function triggerImport() {
  fileInput.value?.click()
}

function handleImport(e) {
  const file = e.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    emit('import-data', event.target.result)
  }
  reader.readAsText(file)
  
  // Reset input
  e.target.value = ''
}

function confirmClear() {
  showClearConfirm.value = true
}

function clearAll() {
  emit('clear-data')
  showClearConfirm.value = false
}
</script>
