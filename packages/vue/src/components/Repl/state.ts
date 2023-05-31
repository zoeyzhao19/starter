import { reactive, watchEffect } from 'vue'
import { compileFile } from './transform'

export interface File {
  filename: string
  code: string
  compiled: {
    js?: string
    css?: string
    [key: string]: any
  }
  outputMode?: string
}

export interface ReplState {
  files: File[]
  activeFile: File
  errors: (string | Error)[]
}

const code = `<script setup lang="ts">
import { ref } from 'vue'

const msg = ref<string>('VUE SFC!')
console.log(123)
function hightHight(){

}
<\/script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>`

export function useReplState() {
  const state = reactive<ReplState>({
    files: [],
    activeFile: {
      code,
      filename: 'App.vue',
      compiled: {},
    } as File,
    errors: [],
  })

  watchEffect(() => {
    compileFile(state)
  })

  return state
}
