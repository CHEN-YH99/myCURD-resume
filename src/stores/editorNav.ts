import { computed, reactive } from 'vue'

const state = reactive({
  suppressDraftRecoverPromptOnce: false,
})

export const useEditorNavStore = () => {
  const suppressDraftRecoverPromptOnce = computed({
    get: () => state.suppressDraftRecoverPromptOnce,
    set: (v: boolean) => {
      state.suppressDraftRecoverPromptOnce = v
    },
  })

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
