<script lang="ts" setup>
import { computed, ref } from 'vue'

const container = ref()
const dragging = ref(false)
const split = ref(50)

let startPosition = 0
let startSplit = 0

const boundSplit = computed(() => {
  return split.value < 20 ? 20 : split.value > 80 ? 80 : split.value
})

function dragStart(e: MouseEvent) {
  dragging.value = true
  startPosition = e.pageX
  startSplit = split.value
}
function dragMove(e: MouseEvent) {
  if (!dragging.value)
    return
  const newPosition = e.pageX - startPosition
  const totalSize = container.value.offsetWidth
  split.value = startSplit + ~~((newPosition / totalSize) * 100)
}
function dragEnd() {
  dragging.value = false
}
</script>

<template>
  <div
    ref="container"
    class="split-pane"
    position="relative"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div h="full" position="relative" overflow="hidden" :style="{ width: `${boundSplit}%` }">
      <slot name="left" />
    </div>
    <div w="10px" h="full" class="absolute z-3 top-0 bottom-0 cursor-ew-resize" :style="{ left: `${boundSplit}%` }" @mousedown.prevent="dragStart" />
    <div
      h="full" position="relative" overflow="hidden" :style="{ width: `${100 - boundSplit}%` }"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.split-pane {
  max-height: calc(100vh - 3rem);
}
</style>
