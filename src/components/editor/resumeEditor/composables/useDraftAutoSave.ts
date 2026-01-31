/**
 * 草稿自动保存组合式函数
 * @description 提供草稿的自动保存、加载、清除和恢复提示功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { onMounted, ref, watch, type Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

/**
 * 草稿自动保存功能组合式函数
 * @param opts - 配置选项
 * @param opts.resume - 简历数据响应式对象
 * @param opts.hasDraft - 是否存在草稿的响应式标识
 * @param opts.saveDraft - 保存草稿的方法
 * @param opts.loadDraft - 加载草稿的方法
 * @param opts.clearDraft - 清除草稿的方法
 * @param opts.shouldPromptRecover - 是否应该提示恢复草稿的判断函数（可选）
 * @returns 返回草稿相关的状态和操作方法
 */
export const useDraftAutoSave = (opts: {
  resume: Ref<any>
  hasDraft: Ref<boolean>
  saveDraft: () => any
  loadDraft: () => boolean
  clearDraft: () => void
  shouldPromptRecover?: () => boolean
}) => {
  const { resume, hasDraft, saveDraft, loadDraft, clearDraft, shouldPromptRecover } = opts

  // 草稿保存节流时间（毫秒）
  const DRAFT_THROTTLE_MS = 1500
  // 草稿是否有未保存的修改
  const draftDirty = ref(false)
  // 草稿保存定时器
  let draftTimer: number | null = null
  // 跳过一次草稿保存的标识（用于加载草稿时避免触发自动保存）
  let skipDraftOnce = false

  /**
   * 调度草稿保存任务（节流处理）
   * @description 使用定时器实现节流，避免频繁保存
   */
  const scheduleSaveDraft = () => {
    if (skipDraftOnce) return
    draftDirty.value = true
    // 清除之前的定时器
    if (draftTimer) window.clearTimeout(draftTimer)
    // 设置新的定时器
    draftTimer = window.setTimeout(() => {
      try {
        saveDraft()
        draftDirty.value = false
      } catch {
        // 忽略保存失败的错误
      }
    }, DRAFT_THROTTLE_MS)
  }

  /**
   * 草稿操作处理函数
   * @param action - 操作类型：'save'（保存）、'load'（加载）、'clear'（清除）
   */
  const onDraft = async (action: 'save' | 'load' | 'clear') => {
    // 处理保存草稿操作
    if (action === 'save') {
      try {
        saveDraft()
        draftDirty.value = false
        ElMessage.success('已保存到草稿')
      } catch {
        ElMessage.error('草稿保存失败')
      }
      return
    }

    // 处理清除草稿操作
    if (action === 'clear') {
      clearDraft()
      draftDirty.value = false
      ElMessage.success('草稿已清空')
      return
    }

    // 处理加载草稿操作
    if (!hasDraft.value) {
      ElMessage.info('暂无草稿')
      return
    }

    // 确认是否加载草稿
    try {
      await ElMessageBox.confirm('将用草稿内容覆盖当前编辑内容，是否继续？', '加载草稿', {
        type: 'warning',
        confirmButtonText: '加载',
        cancelButtonText: '取消',
      })
    } catch {
      return
    }

    // 加载草稿时跳过自动保存
    skipDraftOnce = true
    try {
      const ok = loadDraft()
      if (ok) {
        ElMessage.success('草稿已加载')
      } else {
        ElMessage.error('草稿加载失败')
      }
    } finally {
      // 异步重置跳过标识
      window.setTimeout(() => {
        skipDraftOnce = false
      }, 0)
    }
  }

  // 组件挂载时检查是否需要恢复草稿
  onMounted(async () => {
    if (!hasDraft.value) return
    // 如果提供了恢复判断函数且返回 false，则不提示恢复
    if (typeof shouldPromptRecover === 'function' && !shouldPromptRecover()) return

    // 提示用户是否恢复草稿
    try {
      await ElMessageBox.confirm('检测到未保存的草稿，是否恢复？', '草稿', {
        type: 'info',
        confirmButtonText: '恢复',
        cancelButtonText: '忽略',
        distinguishCancelAndClose: true,
      })
    } catch {
      return
    }

    // 恢复草稿时跳过自动保存
    skipDraftOnce = true
    try {
      loadDraft()
      draftDirty.value = false
    } finally {
      // 异步重置跳过标识
      window.setTimeout(() => {
        skipDraftOnce = false
      }, 0)
    }
  })

  // 监听简历数据变化，触发自动保存
  watch(
    () => resume.value,
    () => {
      scheduleSaveDraft()
    },
    { deep: true }
  )

  return {
    draftDirty,
    onDraft,
  }
}
