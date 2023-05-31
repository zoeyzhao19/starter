<script lang="ts" setup>
import { provide } from 'vue'
import { SplitPane } from '..'
import { useReplState } from './state'
import Editor from './Editor.vue'
import Output from './Output.vue'

const state = useReplState()

provide('state', state)
</script>

<template>
  <SplitPane flex="~ grow" items="center">
    <template #left>
      <Editor />
    </template>
    <template #right>
      <Output />
    </template>
  </SplitPane>
</template>
