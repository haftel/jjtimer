<template>
  <div class="app-session-bar">
    <div
      v-for="session in sessions"
      :key="session.id"
      :class="['session-chip', { 'session-chip--active': session.id === activeSessionId }]"
      @click="handleSessionClick(session)"
      role="button"
      tabindex="0"
      @keydown.enter="handleSessionClick(session)"
      :title="session.id === activeSessionId ? 'Click to rename or delete active session' : 'Switch to ' + session.name"
    >
      <span>{{ session.name }}</span>
      <span style="color: var(--text-tertiary); font-size: 0.65rem; margin-left: 2px;">
        ({{ session.solves.length }})
      </span>

      <!-- Active session edit indicator -->
      <button
        v-if="session.id === activeSessionId"
        class="session-chip-edit-btn"
        @click.stop="openSessionModal(session)"
        title="Session options"
        aria-label="Session options"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
      </button>
    </div>

    <button class="btn btn--icon btn--small" @click="$emit('create-session')" title="New session" aria-label="New session">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 3V11M3 7H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Session Options / Rename Modal -->
    <Teleport to="body">
      <div v-if="activeModal.visible" class="modal-overlay" @click.self="closeModal">
        <div class="modal" style="max-width: 380px;">
          <div class="modal-title">Session Settings</div>

          <div style="margin-bottom: var(--space-4);">
            <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: var(--space-2);">
              Session Name
            </label>
            <input
              ref="renameInputRef"
              v-model="editName"
              @keydown.enter="confirmRename"
              @keydown.escape="closeModal"
              style="width: 100%; padding: 8px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-default); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-sans); font-size: var(--text-base); outline: none;"
            />
          </div>

          <div class="modal-actions" style="justify-content: space-between;">
            <button
              class="btn btn--danger"
              @click="deleteCurrentSession"
              :disabled="sessions.length <= 1"
              :title="sessions.length <= 1 ? 'Cannot delete the only session' : 'Delete session'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </button>

            <div style="display: flex; gap: var(--space-2);">
              <button class="btn" @click="closeModal">Cancel</button>
              <button class="btn btn--accent" @click="confirmRename">Save</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  sessions: { type: Array, default: () => [] },
  activeSessionId: { type: String, default: '' }
})

const emit = defineEmits(['select-session', 'create-session', 'delete-session', 'rename-session'])

const activeModal = ref({ visible: false, session: null })
const editName = ref('')
const renameInputRef = ref(null)

function handleSessionClick(session) {
  if (session.id === props.activeSessionId) {
    // Single click on active session opens settings/rename modal
    openSessionModal(session)
  } else {
    // Click on inactive session switches active session
    emit('select-session', session.id)
  }
}

function openSessionModal(session) {
  activeModal.value = { visible: true, session }
  editName.value = session.name
  nextTick(() => {
    renameInputRef.value?.focus()
    renameInputRef.value?.select()
  })
}

function closeModal() {
  activeModal.value = { visible: false, session: null }
  editName.value = ''
}

function confirmRename() {
  if (activeModal.value.session && editName.value.trim()) {
    emit('rename-session', activeModal.value.session.id, editName.value.trim())
  }
  closeModal()
}

function deleteCurrentSession() {
  if (activeModal.value.session && props.sessions.length > 1) {
    emit('delete-session', activeModal.value.session.id)
  }
  closeModal()
}
</script>

<style scoped>
.session-chip-edit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity var(--transition-fast);
}

.session-chip-edit-btn:hover {
  opacity: 1;
}
</style>
