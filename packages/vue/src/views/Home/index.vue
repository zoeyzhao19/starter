<script setup lang="ts">
import { useGlobalStore } from '@src/store'
import { storeToRefs } from 'pinia'
import { switchDarkLightMode } from '@src/composables'
import { onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

const globalStore = useGlobalStore()
const { count } = storeToRefs(globalStore)
const { increment } = globalStore
const loading = shallowRef(true)
const router = useRouter()

function handleBtnClick() {
  router.push('/about')
  // increment()
  // loading.value = !loading.value
}

onMounted(() => {
  // message.info({ message: '一个消息' })
  // message.success({ message: '一个成功消息' })
  // message.error({ message: '一个错误消息' })
})
</script>

<template>
  <div flex="~ col" h="full" :style="{ height: '100vh' }">
    <nav flex="~" justify="between" items="center" h="12">
      <p font="serif" text="3xl black dark:white" px="2">
      </p>
      <div flex="~" px="2">
        <a target="_blank" href="https://github.com/zoeyzhao19" class="cursor-pointer text-xl i-carbon-logo-github dark:i-carbon-logo-github"></a>
        <button class="ml-2 text-xl i-carbon-sun dark:i-carbon-moon" @click="switchDarkLightMode" />
      </div>
    </nav>
    <section flex="~ grow" items="center" justify="center">
      <button class="block px-4 py-2 bg-blue-500 hover:bg-blue-300" border="rounded" @click="handleBtnClick">
        + {{ count }}
      </button>
      <p v-loading="loading">
        directive
      </p>
    </section>
  </div>
</template>
