<template>
  <Transition name="message-in-out" @after-leave="emits('destory')">
    <div v-show="show" :id="props.id" :class="`message-content message-content--${props.type}`" :style="customStyle">
      {{ props.message }}
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import type { CSSProperties } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { CURRENT_MESSAGE_COUNT } from './index'

const props = defineProps<{
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration: number
  id: `message_${string}`
}>()

const emits = defineEmits<{
  (e: 'destory'): void
}>()

const offset = computed(() => {
  const numberic_id = Number(props.id.slice(8))
  if (numberic_id <= CURRENT_MESSAGE_COUNT.value)
    return (numberic_id - 1) * 44 + 20
  return (numberic_id - CURRENT_MESSAGE_COUNT.value - 1) * 44 + 20
})

const customStyle = computed<CSSProperties>(() => ({
  top: `${offset.value}px`,
  zIndex: 10 + Number(props.id.slice(8)),
}))

let stopTimer: (() => void) | undefined
const show = shallowRef(false)
function close() {
  show.value = false
}

function startTimer() {
  if (props.duration === 0)
    return
  ({ stop: stopTimer } = useTimeoutFn(() => {
    close()
  }, props.duration))
}

onMounted(() => {
  startTimer()
  show.value = true
})

onBeforeUnmount(() => {
  stopTimer?.()
})

defineExpose({
  show,
})
</script>

<style scoped>
.message-content {
  position: fixed;
  padding: 5px 10px;
  border-radius: 4px;
  left: 50%;
  transform: translateX(-50%);
  transition: top .25s linear;
  font-size: 14px;
}

.message-content--info {
  background-color: var(--message-bg-info);
  color: var(--message-text-info)
}
.message-content--error {
  background-color: var(--message-bg-error);;
  color: var(--message-text-error)
}
.message-content--success {
  background-color: var(--message-bg-success);
  color: var(--message-text-success)
}

.message-in-out-enter-active {
  transition: all .25s linear;
}

.message-in-out-leave-active {
  transition: all .25s linear;
}

.message-in-out-enter-from,
.message-in-out-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}
</style>
