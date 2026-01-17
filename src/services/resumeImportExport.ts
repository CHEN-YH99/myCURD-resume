import type { ResumeData } from '@/types/resume'
import { resumeNormalize } from '@/services/resumeNormalize'

export type ImportResult = {
  resume: ResumeData
  meta: {
    source: 'json'
    fileName?: string
  }
}

export const resumeImportExport = {
  exportToJson(resume: ResumeData): string {
    return JSON.stringify(resume, null, 2)
  },

  async importFromJsonFile(file: File, defaultFactory: () => ResumeData): Promise<ImportResult> {
    const text = await file.text()
    const parsed = JSON.parse(text) as ResumeData
    const normalized = resumeNormalize.ensureDefaults(parsed, defaultFactory)
    return {
      resume: normalized,
      meta: { source: 'json', fileName: file.name },
    }
  },
}
