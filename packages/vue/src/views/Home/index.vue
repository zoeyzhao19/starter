<script setup lang="ts">
import { useAppearance } from '@src/composables';

defineOptions({
  name: 'Home',
});

const { toggleAppearance } = useAppearance();
</script>

<template>
  <div flex="~ col" h="full" :style="{ height: '100vh' }">
    <nav flex="~" justify="between" items="center" h="12">
      <p font="serif" text="3xl black dark:white" px="2"></p>
      <div flex="~" px="2">
        <a target="_blank" href="https://github.com/zoeyzhao19" class="cursor-pointer text-xl i-carbon-logo-github"></a>
        <button class="ml-2 text-xl i-carbon-sun dark:i-carbon-moon" @click="toggleAppearance" />
      </div>
    </nav>
  </div>
</template>
