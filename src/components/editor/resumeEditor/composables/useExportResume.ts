/**
 * 简历导出组合式函数
 * @description 提供简历导出为 PDF 和 Word 格式的功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { sanitizeFileName } from '@/utils/format'

/**
 * 简历导出功能组合式函数
 * @param resume - 简历数据响应式对象
 * @returns 返回导出相关的状态和方法
 */
export const useExportResume = (resume: Ref<any>) => {
  // 导出中状态标识
  const exporting = ref(false)

  /**
   * 构建导出文件名
   * @returns 返回格式化后的文件名（不含扩展名）
   * @description 文件名格式：简历标题-年月日
   */
  const buildExportFileName = () => {
    // 获取简历标题
    const t = String(resume.value?.title?.title || '简历')
    // 清理文件名中的非法字符
    const safe = sanitizeFileName(t)
    // 获取当前日期
    const d = new Date()
    const yyyy = String(d.getFullYear())
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    // 返回格式化的文件名
    return `${safe}-${yyyy}${mm}${dd}`
  }

  /**
   * 执行导出操作
   * @param format - 导出格式：'pdf' 或 'word'
   * @description 根据指定格式导出简历，支持 PDF 和 Word 两种格式
   */
  const doExport = async (format: 'pdf' | 'word') => {
    // 防止重复导出
    if (exporting.value) return

    // 查找预览区域元素
    const previewEl = document.querySelector('.preview-paper') as HTMLElement | null
    if (!previewEl) {
      ElMessage.error('未找到预览区域，无法导出')
      return
    }

    const filename = buildExportFileName()

    exporting.value = true
    try {
      // 导出为 PDF
      if (format === 'pdf') {
        const { exportToPdf } = await import('@/utils/export/pdf')
        await exportToPdf(previewEl, filename)
        ElMessage.success('已导出 PDF')
        return
      }

      // 导出为 Word
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
