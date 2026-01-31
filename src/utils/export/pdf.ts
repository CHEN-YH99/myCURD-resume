/**
 * PDF 导出工具模块
 * @description 提供将 HTML 元素导出为 PDF 文件的功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/** A4 纸张宽度（毫米） */
const A4_WIDTH_MM = 210
/** A4 纸张高度（毫米） */
const A4_HEIGHT_MM = 297

/**
 * 将 HTML 元素导出为 PDF 文件
 * @param element - 要导出的 HTML 元素
 * @param filename - 导出的文件名（不含扩展名）
 * @returns 导出成功返回 true
 * @throws 导出失败时抛出错误
 * @description 使用 html2canvas 将元素转换为图片，再通过 jsPDF 生成 PDF
 */
export async function exportToPdf(element: HTMLElement, filename: string) {
  try {
    // 设置 canvas 缩放比例，提高清晰度
    const scale = 2
    const options = {
      scale,
      useCORS: true,        // 允许跨域图片
      allowTaint: true,     // 允许跨域图片污染画布
      logging: false,       // 关闭日志
      backgroundColor: '#fff' // 设置背景色为白色
    }

    // 将 HTML 元素转换为 canvas
    const canvas = await html2canvas(element, options)

    // 获取图片数据
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = A4_WIDTH_MM
    const pageHeight = A4_HEIGHT_MM

    // 计算图片在 PDF 中的高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // 创建 PDF 文档（纵向，毫米单位，A4 尺寸）
    const pdf = new jsPDF('p', 'mm', 'a4')

    let heightLeft = imgHeight
    let position = 0

    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight

    // 如果内容超过一页，继续添加新页
    while (heightLeft > 0) {
      pdf.addPage()
      position = heightLeft - imgHeight
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }

    // 保存 PDF 文件
    pdf.save(`${filename}.pdf`)
    return true
  } catch (error) {
    console.error('导出 PDF 失败:', error)
    throw new Error('导出 PDF 失败，请重试')
  }
}
