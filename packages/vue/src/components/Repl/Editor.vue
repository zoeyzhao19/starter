<script lang="ts" setup>
import { inject } from 'vue'
import type { CompilerError } from 'vue/compiler-sfc'
import { CodeMirror } from '..'
import { debounce } from './utils'
import type { ReplState } from './state'

const state = inject<ReplState>('state')!

const onChange = debounce((code: string) => {
  state.activeFile!.code = code
}, 200)

function formatMessage(err: string | Error): string {
  if (typeof err === 'string') {
    return err
  }
  else {
    let msg = err.message
    const loc = (err as CompilerError).loc
    if (loc && loc.start)
      msg = `(${loc.start.line}:${loc.start.column}) ${msg}`

    return msg
  }
}
</script>

<template>
  <div class="pl-5 h-30px flex items-center absolute left-0 top-0"></div>
  <CodeMirror
    mode="vue"
    :value="state.activeFile.code"
    w="full"
    h="full"
    m="t-30px"
    dark:bg-dark-500
    @change="onChange"
  />
  <div
    v-if="state.errors.length"
    position="absolute"
    w="full"
    left="0"
    bottom="0"
    bg="red-100"
    text="red-500 12px space-nowrap"
    p="2"
    max-h="12"
    overflow="y-hidden x-scroll"
    border="2 solid red"
    box="content"
  >
    <span class="text-red-500 p-2">
      {{ formatMessage(state.errors[0]) }}
    </span>
  </div>
</template>
