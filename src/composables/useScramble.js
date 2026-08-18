import { ref, watch } from 'vue'
import { randomScrambleForEvent } from 'cubing/scramble'

export const WCA_EVENTS = [
  { code: '333', name: '3x3x3', icon: '3' },
  { code: '222', name: '2x2x2', icon: '2' },
  { code: '444', name: '4x4x4', icon: '4' },
  { code: '555', name: '5x5x5', icon: '5' },
  { code: '666', name: '6x6x6', icon: '6' },
  { code: '777', name: '7x7x7', icon: '7' },
  { code: '333bf', name: '3x3x3 BLD', icon: 'B' },
  { code: '333fm', name: '3x3x3 FMC', icon: 'F' },
  { code: '333oh', name: '3x3x3 OH', icon: 'O' },
  { code: 'clock', name: 'Clock', icon: 'C' },
  { code: 'minx', name: 'Megaminx', icon: 'M' },
  { code: 'pyram', name: 'Pyraminx', icon: 'P' },
  { code: 'skewb', name: 'Skewb', icon: 'S' },
  { code: 'sq1', name: 'Square-1', icon: 'Q' },
  { code: '444bf', name: '4x4x4 BLD', icon: '4B' },
  { code: '555bf', name: '5x5x5 BLD', icon: '5B' },
  { code: '333mbf', name: '3x3x3 MBLD', icon: 'MB' },
]

export function useScramble() {
  const currentEvent = ref('333')
  const currentScramble = ref('')
  const nextScramble = ref('')
  const isLoading = ref(false)
  
  async function generateScramble(eventCode) {
    try {
      const scramble = await randomScrambleForEvent(eventCode)
      return scramble.toString()
    } catch (error) {
      console.error(`Failed to generate scramble for ${eventCode}:`, error)
      return 'Scramble generation failed — please try again'
    }
  }
  
  async function fetchNewScramble() {
    isLoading.value = true
    
    // Use pre-generated scramble if available
    if (nextScramble.value) {
      currentScramble.value = nextScramble.value
      nextScramble.value = ''
    } else {
      currentScramble.value = await generateScramble(currentEvent.value)
    }
    
    isLoading.value = false
    
    // Pre-generate next scramble in background
    preGenerateNext()
  }
  
  async function preGenerateNext() {
    nextScramble.value = await generateScramble(currentEvent.value)
  }
  
  function setEvent(eventCode) {
    currentEvent.value = eventCode
    nextScramble.value = '' // Invalidate pre-generated scramble
    fetchNewScramble()
  }
  
  // Generate initial scramble
  fetchNewScramble()
  
  return {
    currentEvent,
    currentScramble,
    isLoading,
    fetchNewScramble,
    setEvent,
    WCA_EVENTS
  }
}
