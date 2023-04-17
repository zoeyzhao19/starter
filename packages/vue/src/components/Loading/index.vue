<template>
  <span class="block w-50px h-50px text-gray-500 dark:text-gray-300">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full loading_circle">
      <circle cx="25" cy="25" r="15" stroke-width="2" stroke="currentColor" fill="none" />
    </svg>
  </span>
</template>

<style scoped>
.loading_circle circle {
  animation: loading_circle 1s linear infinite;
}

@keyframes loading_circle {
  0% {
    stroke-dasharray: 1, 105;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 105, 105;
    stroke-dashoffset: -63px;
  }
  100% {
    stroke-dasharray: 105, 105;
    stroke-dashoffset: -105px;
  }
}
</style>
