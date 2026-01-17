import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

export async function exportToPdf(element: HTMLElement, filename: string) {
  try {
    const scale = 2
    const options = {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#fff'
    }

    const canvas = await html2canvas(element, options)

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = A4_WIDTH_MM
    const pageHeight = A4_HEIGHT_MM

    const imgHeight = (canvas.height * imgWidth) / canvas.width

    const pdf = new jsPDF('p', 'mm', 'a4')

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      pdf.addPage()
      position = heightLeft - imgHeight
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight
    }

    pdf.save(`${filename}.pdf`)
    return true
  } catch (error) {
    console.error('导出 PDF 失败:', error)
    throw new Error('导出 PDF 失败，请重试')
  }
}