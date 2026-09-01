<template>
  <div v-if="isSupported" class="cube-net-viewer">
    <twisty-player
      :alg="scramble"
      :puzzle="puzzleName"
      visualization="2D"
      background="none"
      control-panel="none"
      hint-facelets="none"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Register the TwistyPlayer web component (side-effect import)
import 'cubing/twisty'

const props = defineProps({
  /** Current scramble string */
  scramble: { type: String, default: '' },
  /** WCA event code, e.g. '333', 'minx', 'pyram' */
  eventCode: { type: String, default: '333' },
})

/**
 * Map WCA event codes → cubing.js puzzle identifiers.
 * Events omitted from this map are unsupported and will hide the net.
 */
const EVENT_TO_PUZZLE = {
  '333':   '3x3x3',
  '222':   '2x2x2',
  '444':   '4x4x4',
  '555':   '5x5x5',
  '666':   '6x6x6',
  '777':   '7x7x7',
  '333bf': '3x3x3',
  '333fm': '3x3x3',
  '333oh': '3x3x3',
  'minx':  'megaminx',
  'pyram': 'pyraminx',
  'skewb': 'skewb',
  'sq1':   'square1',
  '444bf': '4x4x4',
  '555bf': '5x5x5',
  // 'clock' and '333mbf' intentionally absent — 2D net unsupported
}

const puzzleName = computed(() => EVENT_TO_PUZZLE[props.eventCode] ?? null)
const isSupported = computed(() => puzzleName.value !== null)
</script>

<style scoped>
.cube-net-viewer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.cube-net-viewer twisty-player {
  width: 100%;
  max-width: 600px;
  height: 160px;
}
</style>
