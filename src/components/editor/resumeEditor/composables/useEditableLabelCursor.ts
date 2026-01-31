/**
 * 可编辑标签光标控制组合式函数
 * @description 提供自定义标签输入框的引用管理和光标位置控制功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { nextTick, ref } from 'vue'

/**
 * 可编辑标签光标控制功能组合式函数
 * @returns 返回标签引用管理和光标控制方法
 */
export const useEditableLabelCursor = () => {
  // 存储自定义标签的引用对象
  const customLabelRefs = ref<Record<string, any>>({})

  /**
   * 设置自定义标签的引用
   * @param key - 标签的唯一标识
   * @returns 返回一个函数，用于设置或删除标签引用
   */
  const setCustomLabelRef = (key: string) => (el: any) => {
    // 如果元素不存在，则删除对应的引用
    if (!el) {
      delete customLabelRefs.value[key]
      return
    }
    // 保存元素引用
    customLabelRefs.value[key] = el
  }

  /**
   * 将指定标签的光标移动到末尾
   * @param key - 标签的唯一标识
   * @description 使用 nextTick 和 requestAnimationFrame 确保光标位置设置成功
   */
  const keepCursorAtEndByKey = (key: string) => {
    void nextTick(() => {
      // 获取标签实例
      const inst = customLabelRefs.value[key]
      // 查找输入框元素
      const inputEl = inst?.input || inst?.$el?.querySelector?.('input')
      if (!inputEl) return
      try {
        // 获取输入框内容长度
        const len = (inputEl.value || '').length
        // 设置光标位置到末尾
        inputEl.setSelectionRange(len, len)
        // 使用 requestAnimationFrame 再次确保光标位置
        requestAnimationFrame(() => {
          try {
            inputEl.setSelectionRange(len, len)
          } catch {
            // 忽略设置失败的错误
          }
        })
      } catch {
        // 忽略设置失败的错误
      }
    })
  }

  return {
    setCustomLabelRef,
    keepCursorAtEndByKey,
  }
}
