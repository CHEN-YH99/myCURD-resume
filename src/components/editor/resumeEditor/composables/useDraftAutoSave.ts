import { onMounted, ref, watch, type Ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export const useDraftAutoSave = (opts: {
  resume: Ref<any>
  hasDraft: Ref<boolean>
  saveDraft: () => any
  loadDraft: () => boolean
  clearDraft: () => void
  shouldPromptRecover?: () => boolean
}) => {
  const { resume, hasDraft, saveDraft, loadDraft, clearDraft, shouldPromptRecover } = opts

  const DRAFT_THROTTLE_MS = 1500
  const draftDirty = ref(false)
  let draftTimer: number | null = null
  let skipDraftOnce = false

  const scheduleSaveDraft = () => {
    if (skipDraftOnce) return
    draftDirty.value = true
    if (draftTimer) window.clearTimeout(draftTimer)
    draftTimer = window.setTimeout(() => {
      try {
        saveDraft()
        draftDirty.value = false
      } catch {
        // ignore
      }
    }, DRAFT_THROTTLE_MS)
  }

  const onDraft = async (action: 'save' | 'load' | 'clear') => {
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

    if (action === 'clear') {
      clearDraft()
      draftDirty.value = false
      ElMessage.success('草稿已清空')
      return
    }

    if (!hasDraft.value) {
      ElMessage.info('暂无草稿')
      return
    }

    try {
      await ElMessageBox.confirm('将用草稿内容覆盖当前编辑内容，是否继续？', '加载草稿', {
        type: 'warning',
        confirmButtonText: '加载',
        cancelButtonText: '取消',
      })
    } catch {
      return
    }

    skipDraftOnce = true
    try {
      const ok = loadDraft()
      if (ok) {
        ElMessage.success('草稿已加载')
      } else {
        ElMessage.error('草稿加载失败')
      }
    } finally {
      window.setTimeout(() => {
        skipDraftOnce = false
      }, 0)
    }
  }

  onMounted(async () => {
    if (!hasDraft.value) return
    if (typeof shouldPromptRecover === 'function' && !shouldPromptRecover()) return

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

    skipDraftOnce = true
    try {
      loadDraft()
      draftDirty.value = false
    } finally {
      window.setTimeout(() => {
        skipDraftOnce = false
      }, 0)
    }
  })

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
