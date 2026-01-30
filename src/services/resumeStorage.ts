import type { ResumeData } from '@/types/resume'

// 简历列表页/选择器用的轻量信息：不包含正文 data，便于快速渲染与排序。
export type ResumeSummary = {
  id: string
  title: string
  updatedAt: number
}

// 本地持久化的完整简历记录：包含摘要信息 + 完整简历数据。
export type ResumeRecord = ResumeSummary & {
  data: ResumeData
}

// 草稿结构：用于“编辑未保存/自动保存”的恢复。
export type DraftPayload = {
  updatedAt: number
  currentId: string
  data: ResumeData
}

// localStorage 的 key 统一收口在这里，避免散落在业务代码中。
const STORAGE_KEY = 'mycurd-resume:records'
const DRAFT_KEY = 'mycurd-resume:draft'

// 安全 JSON 解析：避免 localStorage 被手动篡改/旧版本数据导致的 JSON.parse 抛错。
// 解析失败时返回 null，由上层走“空数据/忽略异常数据”的兜底逻辑。
const safeParseJson = <T>(raw: string | null): T | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

// localStorage 持久化层：只负责读写与最小校验，不做业务层的合并/迁移。
export const resumeStorage = {
  // 读取全部简历记录。
  // 返回值保证为数组；当 key 不存在/数据非法时返回空数组。
  readRecords(): ResumeRecord[] {
    const parsed = safeParseJson<unknown>(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(parsed)) return []
    return parsed as ResumeRecord[]
  },

  // 覆盖写入全部简历记录。
  writeRecords(records: ResumeRecord[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  },

  // 读取草稿。
  // 只做最基础的结构检查：必须是对象且包含 data 字段；否则视为无草稿。
  readDraft(): DraftPayload | null {
    const parsed = safeParseJson<any>(localStorage.getItem(DRAFT_KEY))
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.data) return null
    return parsed as DraftPayload
  },

  // 写入草稿（用于自动保存/手动保存草稿）。
  writeDraft(payload: DraftPayload) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
  },

  // 清理草稿（例如：用户显式保存简历后，或用户选择“放弃草稿”）。
  clearDraft() {
    localStorage.removeItem(DRAFT_KEY)
  },
}
