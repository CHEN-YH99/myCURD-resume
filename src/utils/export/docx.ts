import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { saveAs } from 'file-saver'
import type { ResumeData } from '@/types/resume'

const safeText = (v: any) => {
  if (v === null || v === undefined) return ''
  return String(v)
}

export async function exportToDocx(resume: ResumeData, filename: string) {
  try {
    const children: Paragraph[] = []

    // 标题
    const title = safeText(resume.title?.title)
    if (title) {
      children.push(
        new Paragraph({
          text: title,
          heading: HeadingLevel.TITLE,
        })
      )
    }

    const subtitle = safeText(resume.title?.subtitle)
    if (subtitle) {
      children.push(new Paragraph({ children: [new TextRun({ text: subtitle })] }))
    }

    // 基本信息
    if (resume.personInfo?.enabled) {
      children.push(new Paragraph({ text: '个人信息', heading: HeadingLevel.HEADING_1 }))

      const pi: any = resume.personInfo
      const baseLines: Array<[string, any]> = [
        ['姓名', pi.name],
        ['性别', pi.gender],
        ['年龄', pi.age],
        ['电话', pi.phone],
        ['邮箱', pi.email],
        ['微信', pi.wechat],
        ['Github', pi.github],
      ]

      baseLines.forEach(([k, v]) => {
        const txt = safeText(v)
        if (!txt) return
        children.push(new Paragraph({ children: [new TextRun({ text: `${k}：${txt}` })] }))
      })

      // 自定义字段
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
        // ignore
      }
    }

    // 求职意向
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

      if (ji.custom?.title || ji.custom?.value) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `${safeText(ji.custom?.title) || '自定义'}：${safeText(ji.custom?.value)}` })],
          })
        )
      }
    }

    // 模块
    const modulesOrder: string[] = Array.isArray(resume.modulesOrder) ? (resume.modulesOrder as any) : []

    const addGridRows = (rows: any) => {
      if (!Array.isArray(rows)) return
      rows.forEach((r: any) => {
        const values: string[] = Array.isArray(r?.values) ? r.values : []
        const txt = values.filter(Boolean).map(safeText).join(' / ')
        if (txt) children.push(new Paragraph({ text: `- ${txt}` }))
      })
    }

    modulesOrder.forEach((k) => {
      const mod: any = (resume.modules as any)?.[k] || (resume.modules?.custom as any)?.[k]
      if (!mod?.enabled) return

      const titleText = safeText(mod.title) || safeText(k)
      children.push(new Paragraph({ text: titleText, heading: HeadingLevel.HEADING_1 }))

      // education/work/project: items
      if (Array.isArray(mod.items)) {
        mod.items.forEach((it: any) => {
          const line = [it.school, it.major, it.degree, it.company, it.title, it.name, it.role, it.link]
            .map(safeText)
            .filter(Boolean)
            .join(' | ')
          if (line) children.push(new Paragraph({ text: line }))

          // 高亮/描述
          if (Array.isArray(it.highlights) && it.highlights.length) {
            it.highlights.forEach((h: any) => {
              const t = safeText(h)
              if (t) children.push(new Paragraph({ text: `- ${t}` }))
            })
          }
          const desc = safeText(it.description)
          if (desc) children.push(new Paragraph({ text: desc }))

          addGridRows(it.rows)
        })
      }

      // selfIntro
      if (k === 'selfIntro') {
        const text = safeText(mod.value?.text)
        if (text) children.push(new Paragraph({ text }))
      }

      // 通用 rows
      addGridRows(mod.rows)
    })

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${filename}.docx`)
    return true
  } catch (error) {
    console.error('导出 Word 失败:', error)
    throw new Error('导出 Word 失败，请重试')
  }
}
