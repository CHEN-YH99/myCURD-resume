import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { sanitizeFileName } from '@/utils/format'

export const useExportResume = (resume: Ref<any>) => {
  const exporting = ref(false)

  const buildExportFileName = () => {
    const t = String(resume.value?.title?.title || '简历')
    const safe = sanitizeFileName(t)
    const d = new Date()
    const yyyy = String(d.getFullYear())
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${safe}-${yyyy}${mm}${dd}`
  }

  const doExport = async (format: 'pdf' | 'word') => {
    if (exporting.value) return

    const previewEl = document.querySelector('.preview-paper') as HTMLElement | null
    if (!previewEl) {
      ElMessage.error('未找到预览区域，无法导出')
      return
    }

    const filename = buildExportFileName()

    exporting.value = true
    try {
      if (format === 'pdf') {
        const { exportToPdf } = await import('@/utils/export/pdf')
        await exportToPdf(previewEl, filename)
        ElMessage.success('已导出 PDF')
        return
      }

      const { exportToDocx } = await import('@/utils/export/docx')
      await exportToDocx(resume.value as any, filename)
      ElMessage.success('已导出 Word')
    } catch (e: any) {
      ElMessage.error(e?.message || (format === 'pdf' ? '导出 PDF 失败' : '导出 Word 失败'))
    } finally {
      exporting.value = false
    }
  }

  return {
    exporting,
    buildExportFileName,
    doExport,
  }
}
