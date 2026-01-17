import type { ResumeData } from '@/types/resume'

export type ResumeSummary = {
  id: string
  title: string
  updatedAt: number
}

export type ResumeRecord = ResumeSummary & {
  data: ResumeData
}

export type DraftPayload = {
  updatedAt: number
  currentId: string
  data: ResumeData
}

const STORAGE_KEY = 'mycurd-resume:records'
const DRAFT_KEY = 'mycurd-resume:draft'

const safeParseJson = <T>(raw: string | null): T | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export const resumeStorage = {
  readRecords(): ResumeRecord[] {
    const parsed = safeParseJson<unknown>(localStorage.getItem(STORAGE_KEY))
    if (!Array.isArray(parsed)) return []
    return parsed as ResumeRecord[]
  },

  writeRecords(records: ResumeRecord[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  },

  readDraft(): DraftPayload | null {
    const parsed = safeParseJson<any>(localStorage.getItem(DRAFT_KEY))
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.data) return null
    return parsed as DraftPayload
  },

  writeDraft(payload: DraftPayload) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
  },

  clearDraft() {
    localStorage.removeItem(DRAFT_KEY)
  },
}
