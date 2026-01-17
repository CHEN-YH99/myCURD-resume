import { nextTick, ref } from 'vue'

export const useEditableLabelCursor = () => {
  const customLabelRefs = ref<Record<string, any>>({})

  const setCustomLabelRef = (key: string) => (el: any) => {
    if (!el) {
      delete customLabelRefs.value[key]
      return
    }
    customLabelRefs.value[key] = el
  }

  const keepCursorAtEndByKey = (key: string) => {
    void nextTick(() => {
      const inst = customLabelRefs.value[key]
      const inputEl = inst?.input || inst?.$el?.querySelector?.('input')
      if (!inputEl) return
      try {
        const len = (inputEl.value || '').length
        inputEl.setSelectionRange(len, len)
        requestAnimationFrame(() => {
          try {
            inputEl.setSelectionRange(len, len)
          } catch {
            // ignore
          }
        })
      } catch {
        // ignore
      }
    })
  }

  return {
    setCustomLabelRef,
    keepCursorAtEndByKey,
  }
}
