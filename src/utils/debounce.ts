/**
 * 防抖工具函数模块
 * @description 提供函数防抖功能，用于优化高频触发的事件处理
 * @author Resume Editor Team
 * @date 2024-01-31
 */

/**
 * 防抖函数
 * @param fn - 需要防抖的函数
 * @param delay - 延迟时间（毫秒），默认 300ms
 * @returns 防抖后的函数
 * @description 在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时
 * @example
 * const debouncedFn = debounce(() => console.log('执行'), 500)
 * debouncedFn() // 500ms 后执行
 * debouncedFn() // 重新计时，再等 500ms
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  // 定时器引用
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer)
    }

    // 设置新的定时器
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}
