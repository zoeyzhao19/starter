<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import CodeMirror from '../CodeMirror/CodeMirror.vue'
import type { ReplState } from './state'

const state = inject<ReplState>('state')!
const currentMode = ref(state.activeFile.outputMode || 'js')
const modes = computed(() => {
  return Object.keys(state.activeFile.compiled)
})
</script>

<template>
  <div class="pl-5 h-30px flex items-center absolute left-0 top-0">
    <button
      v-for="(mode, index) in modes"
      :key="index"
      px="2"
      min="w-10"
      text="center"
      border="b-2 transparent solid"
      :class="{ active: currentMode === mode }"
      @click="currentMode = mode"
    >
      {{ mode }}
    </button>
  </div>
  <CodeMirror flex="1" h="full" m="t-30px" :mode="currentMode" readonly :value="state.activeFile.compiled[currentMode] || ''" />
</template>

<style scoped>
.active {
  border-color: #89ddff;
}
</style>
