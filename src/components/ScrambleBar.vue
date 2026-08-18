<template>
  <div class="event-dropdown" ref="dropdownRef">
    <button class="event-dropdown-trigger" @click="isOpen = !isOpen" :id="'event-selector'">
      <span>{{ currentEventName }}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div v-if="isOpen" class="event-dropdown-menu">
      <button
        v-for="event in events"
        :key="event.code"
        :class="['event-dropdown-item', { 'event-dropdown-item--active': event.code === currentEvent }]"
        @click="selectEvent(event.code)"
      >
        <span>{{ event.name }}</span>
        <span class="event-dropdown-item-code">{{ event.code }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  currentEvent: { type: String, default: '333' },
  events: { type: Array, default: () => [] }
})

const emit = defineEmits(['select-event'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const currentEventName = computed(() => {
  const event = props.events.find(e => e.code === props.currentEvent)
  return event ? event.name : '3x3x3'
})

function selectEvent(code) {
  emit('select-event', code)
  isOpen.value = false
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
