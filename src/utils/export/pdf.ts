import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { saveAs } from 'file-saver'

export async function exportToPdf(element: HTMLElement, filename: string) {
  try {
    // 设置缩放比例提高清晰度
    const scale = 2
    const options = {
      scale,
      useCORS: true, // 允许跨域图片
      allowTaint: true,
      logging: false,
      backgroundColor: '#fff'
    }

    // 将 DOM 转换为 canvas
    const canvas = await html2canvas(element, options)
    
    // 计算 PDF 尺寸（A4 尺寸：210mm x 297mm）
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 宽度（mm）
    const pageHeight = 297 // A4 高度（mm）
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    // 创建 PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // 第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight
    
    // 如果内容超出一页，添加新页
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }
    
    // 保存文件
    pdf.save(`${filename}.pdf`)
    return true
  } catch (error) {
    console.error('导出 PDF 失败:', error)
    throw new Error('导出 PDF 失败，请重试')
  }
}