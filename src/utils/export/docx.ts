/**
 * Word 文档导出工具模块
 * @description 提供将简历数据导出为 Word 文档的功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import type { ResumeData } from '@/types/resume'

/**
 * 安全文本转换函数
 * @param v - 任意类型的值
 * @returns 转换后的字符串，null/undefined 返回空字符串
 * @description 将任意值安全地转换为字符串
 */
const safeText = (v: any) => {
  if (v === null || v === undefined) return ''
  return String(v)
}

/**
 * 将简历数据导出为 Word 文档
 * @param resume - 简历数据对象
 * @param filename - 导出的文件名（不含扩展名）
 * @returns 导出成功返回 true
 * @throws 导出失败时抛出错误
 * @description 使用 docx 库将简历数据转换为 Word 文档格式
 */
export async function exportToDocx(resume: ResumeData, filename: string) {
  try {
    const children: Paragraph[] = []

    // 添加简历标题
    const title = safeText(resume.title?.title)
    if (title) {
      children.push(
        new Paragraph({
          text: title,
          heading: HeadingLevel.TITLE,
        })
      )
    }

    // 添加副标题
    const subtitle = safeText(resume.title?.subtitle)
    if (subtitle) {
      children.push(new Paragraph({ children: [new TextRun({ text: subtitle })] }))
    }

    // 添加个人信息部分
    if (resume.personInfo?.enabled) {
      children.push(new Paragraph({ text: '个人信息', heading: HeadingLevel.HEADING_1 }))

      const pi: any = resume.personInfo
      // 基本信息字段列表
      const baseLines: Array<[string, any]> = [
        ['姓名', pi.name],
        ['性别', pi.gender],
        ['年龄', pi.age],
        ['电话', pi.phone],
        ['邮箱', pi.email],
        ['微信', pi.wechat],
        ['Github', pi.github],
      ]

      // 添加基本信息
      baseLines.forEach(([k, v]) => {
        const txt = safeText(v)
        if (!txt) return
        children.push(new Paragraph({ children: [new TextRun({ text: `${k}：${txt}` })] }))
      })

      // 添加自定义字段
      try {
        const order: string[] = Array.isArray(pi.order) ? pi.order : []
        order.forEach((key: string) => {
          const field = pi.fields?.[key]
          if (!field?.enabled) return
          const label = safeText(field.label)
          const value = safeText(field.value)
          if (!label && !value) return
          children.push(new Paragraph({ children: [new TextRun({ text: `${label || '自定义'}：${value}` })] }))
        })
      } catch {
        // 忽略自定义字段处理错误
      }
    }

    // 添加求职意向部分
    if (resume.jobIntention?.enabled) {
      children.push(new Paragraph({ text: '求职意向', heading: HeadingLevel.HEADING_1 }))
      const ji: any = resume.jobIntention

      const lines: Array<[string, any]> = [
        ['求职意向', ji.position],
        ['工作经验', ji.workYears !== undefined ? `${ji.workYears}年` : ''],
        ['期望城市', ji.city],
        ['期望薪资', ji.salary],
      ]

      lines.forEach(([k, v]) => {
        const txt = safeText(v)
        if (!txt) return
        children.push(new Paragraph({ children: [new TextRun({ text: `${k}：${txt}` })] }))
      })

      // 添加自定义求职意向字段
      if (ji.custom?.title || ji.custom?.value) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${safeText(ji.custom?.title) || '自定义'}：${safeText(ji.custom?.value)}` })],
          })
        )
      }
    }

    // 处理简历模块
    const modulesOrder: string[] = Array.isArray(resume.modulesOrder) ? (resume.modulesOrder as any) : []

    /**
     * 添加网格行内容
     * @param rows - 网格行数据
     * @description 将网格行数据转换为段落并添加到文档中
     */
    const addGridRows = (rows: any) => {
      if (!Array.isArray(rows)) return
      rows.forEach((r: any) => {
        const values: string[] = Array.isArray(r?.values) ? r.values : []
        const txt = values.filter(Boolean).map(safeText).join(' / ')
        if (txt) children.push(new Paragraph({ text: `- ${txt}` }))
      })
    }

    // 按顺序处理每个模块
    modulesOrder.forEach((k) => {
      const mod: any = (resume.modules as any)?.[k] || (resume.modules?.custom as any)?.[k]
      if (!mod?.enabled) return

      // 添加模块标题
      const titleText = safeText(mod.title) || safeText(k)
      children.push(new Paragraph({ text: titleText, heading: HeadingLevel.HEADING_1 }))

      // 处理包含 items 的模块（教育背景/工作经历/项目经历等）
      if (Array.isArray(mod.items)) {
        mod.items.forEach((it: any) => {
          // 组合项目基本信息
          const line = [it.school, it.major, it.degree, it.company, it.title, it.name, it.role, it.link]
            .map(safeText)
            .filter(Boolean)
            .join(' | ')
          if (line) children.push(new Paragraph({ text: line }))

          // 添加高亮/亮点
          if (Array.isArray(it.highlights) && it.highlights.length) {
            it.highlights.forEach((h: any) => {
              const t = safeText(h)
              if (t) children.push(new Paragraph({ text: `- ${t}` }))
            })
          }
          
          // 添加描述
          const desc = safeText(it.description)
          if (desc) children.push(new Paragraph({ text: desc }))

          // 添加自定义网格行
          addGridRows(it.rows)
        })
      }

      // 处理自我评价模块
      if (k === 'selfIntro') {
        const text = safeText(mod.value?.text)
        if (text) children.push(new Paragraph({ text }))
      }

      // 添加模块的通用网格行
      addGridRows(mod.rows)
    })

    // 创建 Word 文档
    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    })

    // 生成并保存文档
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${filename}.docx`)
    return true
  } catch (error) {
    console.error('导出 Word 失败:', error)
    throw new Error('导出 Word 失败，请重试')
  }
}
