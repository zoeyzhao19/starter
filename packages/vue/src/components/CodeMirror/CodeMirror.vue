<template>
  <div ref="el"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { EditorView } from '@codemirror/view'
import type { Extension } from '@codemirror/state'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { html, htmlLanguage } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import './codemirror.css'
import { extensions } from './theme'

const props = defineProps<{
  value: string
  mode: string
  readonly?: boolean
}>()

const emits = defineEmits<{
  change: [code:string]
}>()

const langExtensions: Record<string, () => {}> = {
  html: () => htmlLanguage.extension,
  vue: html,
  css,
  js: javascript,
  ts: () => javascript({ typescript: true }),
}

const el = ref()
let cm: EditorView

onMounted(() => {
  cm = new EditorView({
    doc: props.value,
    parent: el.value,
    extensions: [basicSetup, props.readonly && EditorState.readOnly.of(true), langExtensions[props.mode](), ...extensions].filter(Boolean) as Extension[],
    dispatch(tr) {
      cm.update([tr])
      if (tr.docChanged)
        emits('change', cm.state.doc.toString())
    },
  })
})

watch(() => props.value, (value) => {
  if (value !== cm.state.doc.toString()) {
    // const selections = cm.state.selection.ranges
    cm.dispatch({
      changes: { from: 0, to: cm.state.doc.length, insert: value },
      // selection: EditorSelection.create(selections),
    })
  }
})
</script>
