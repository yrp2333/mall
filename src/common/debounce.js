/**
 * Created by 1 on 2020/1/21.
 */
export function debounce(func, delay) {
  let timer = null

  return function (...args) {
    if (timer)  clearTimeout

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
