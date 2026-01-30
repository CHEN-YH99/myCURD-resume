import { computed, reactive } from 'vue'

const state = reactive({
  suppressDraftRecoverPromptOnce: false,
})

/**
 * 导出一个名为 useEditorNavStore 的函数，用于创建编辑器导航相关的状态管理
 * 该函数返回一个包含两个方法的对象，用于处理草稿恢复提示的显示状态
 */
export const useEditorNavStore = () => {
  /**
   * 创建一个计算属性 suppressDraftRecoverPromptOnce，用于控制草稿恢复提示的显示状态
   * 该计算属性具有 getter 和 setter 方法，可以获取和设置状态值
   * @type {Ref<boolean>} - 返回一个响应式的布尔值引用
   */
  const suppressDraftRecoverPromptOnce = computed({
    get: () => state.suppressDraftRecoverPromptOnce, // 获取状态值
    set: (v: boolean) => {
      state.suppressDraftRecoverPromptOnce = v // 设置状态值
    },
  })

  /**
   * 消费一次草稿恢复提示的显示状态
   * 该函数会获取当前状态值，然后将状态重置为 false，并返回之前的状态值
   * @returns {boolean} - 返回消费前的状态值
   */
  const consumeSuppressDraftRecoverPromptOnce = () => {
    const v = state.suppressDraftRecoverPromptOnce // 获取当前状态值
    state.suppressDraftRecoverPromptOnce = false // 重置状态为 false
    return v // 返回之前的状态值
  }

  /**
   * 返回包含两个方法的对象，供外部使用
   * @returns {Object} - 包含 suppressDraftRecoverPromptOnce 和 consumeSuppressDraftRecoverPromptOnce 两个方法
   */
  return {
    suppressDraftRecoverPromptOnce,
    consumeSuppressDraftRecoverPromptOnce,
  }
}
