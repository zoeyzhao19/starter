import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { EditorView } from '@codemirror/view'

const cursor = 'var(--cursor)'
const fontSize = 'var(--fontSize)'
const base = 'var(--base)'
const bgGutter = 'var(--gutter)'
const selection = 'var(--selection)'
const nonFocusSelection = 'var(--selection-non-focus)'

const sfcTheme = EditorView.theme({
  '&.cm-focused': {
    outline: 'none',
  },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: 'transparent',
  },
  '.cm-selectionMatch': { backgroundColor: 'transparent' },

  '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: `${selection} !important` },
  '.cm-selectionBackground, .cm-content ::selection': { backgroundColor: `${nonFocusSelection} !important` },

  '.cm-activeLine': { backgroundColor: 'transparent', outline: 'none' },
  '.cm-line': { fontSize, color: base },
  '.cm-gutters, .cm-activeLineGutter': { backgroundColor: bgGutter },
  '.cm-lineNumbers .cm-gutterElement': { fontSize, minWidth: '30px' },
}, {
  dark: true,
})

const sfcHightlightStyle = HighlightStyle.define([
  {
    tag: [tags.typeName],
    color: 'var(--tags)',
  },
  {
    tag: [tags.moduleKeyword, tags.definitionKeyword],
    color: 'var(--keyword)',
  },
  {
    tag: [tags.brace, tags.angleBracket, tags.definitionOperator, tags.derefOperator, tags.separator, tags.paren],
    color: 'var(--symbol)',
  },
  {
    tag: [tags.variableName],
    color: 'var(--base)',
  },
  {
    tag: [tags.string, tags.attributeValue],
    color: 'var(--string)',
  },
  {
    tag: [tags.propertyName],
    color: 'var(--property)',
  },
  {
    tag: [tags.number],
    color: 'var(--number)',
  },
  {
    tag: [tags.attributeName],
    color: 'var(--attribute)',
  },
  {
    tag: [tags.comment, tags.docComment],
    color: 'var(--comment)',
  },
])

export const extensions = [sfcTheme, syntaxHighlighting(sfcHightlightStyle)]
