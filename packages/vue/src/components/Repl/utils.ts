export function debounce(fn: Function, n = 100) {
  let handle: any = null
  return (...args: any[]) => {
    handle && clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}
