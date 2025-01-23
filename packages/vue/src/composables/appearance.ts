import { nextTick, onMounted, ref, watchEffect } from "vue";

function enableTransitions() {
  return 'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches
}

const darkMatches = window.matchMedia('(prefers-color-scheme: dark)').matches

export const useAppearance = () => {
  const isDark = ref(darkMatches)

  onMounted(() => {
    watchEffect(() => {
      document.documentElement.classList.toggle('dark', isDark.value)
    })
  })

  async function toggleAppearance({ clientX: x, clientY: y }: MouseEvent) {
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )}px at ${x}px ${y}px)`,
    ]
  
    await document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    }).ready
  
    document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`,
      },
    )
  }

  return {
    toggleAppearance
  }
}