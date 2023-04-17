<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade" mode="out-in" appear>
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
#app {
  overflow-x: hidden;
}
/* slide-fade */
.slide-fade-leave-active,
.slide-fade-enter-active {
  transition: all 0.5s;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
