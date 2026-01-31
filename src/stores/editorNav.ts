/**
 * 编辑器导航状态管理模块
 * @description 管理编辑器导航相关的状态，如草稿恢复提示的显示控制
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { computed, reactive } from 'vue'

/**
 * 编辑器导航状态
 * @description 使用响应式对象管理状态
 */
const state = reactive({
  /** 是否抑制一次草稿恢复提示 */
  suppressDraftRecoverPromptOnce: false,
})

/**
 * 编辑器导航状态管理组合式函数
 * @returns 编辑器导航相关的状态和操作方法
 * @description 提供草稿恢复提示的显示状态控制功能
 */
export const useEditorNavStore = () => {
  /**
   * 抑制一次草稿恢复提示的状态
   * @description 计算属性，具有 getter 和 setter 方法，可以获取和设置状态值
   */
  const suppressDraftRecoverPromptOnce = computed({
    /**
     * 获取状态值
     * @returns 当前状态值
     */
    get: () => state.suppressDraftRecoverPromptOnce,
    
    /**
     * 设置状态值
     * @param v - 新的状态值
     */
    set: (v: boolean) => {
      state.suppressDraftRecoverPromptOnce = v
    },
  })

  /**
   * 消费一次草稿恢复提示的显示状态
   * @returns 返回消费前的状态值
   * @description 获取当前状态值，然后将状态重置为 false，并返回之前的状态值
   * 这种模式常用于"一次性标志"的场景，确保某个操作只执行一次
   */
  const consumeSuppressDraftRecoverPromptOnce = () => {
    const v = state.suppressDraftRecoverPromptOnce
    state.suppressDraftRecoverPromptOnce = false
    return v
  }

  return {
    suppressDraftRecoverPromptOnce,
    consumeSuppressDraftRecoverPromptOnce,
  }
}
