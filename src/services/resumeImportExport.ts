/**
 * 简历导入导出服务模块
 * @description 提供简历数据的 JSON 格式导入导出功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import type { ResumeData } from '@/types/resume'
import { resumeNormalize } from '@/services/resumeNormalize'

/**
 * 导入结果类型定义
 */
export type ImportResult = {
  /** 导入的简历数据 */
  resume: ResumeData
  /** 导入元信息 */
  meta: {
    /** 数据来源 */
    source: 'json'
    /** 文件名（可选） */
    fileName?: string
  }
}

/**
 * 简历导入导出服务对象
 */
export const resumeImportExport = {
  /**
   * 将简历数据导出为 JSON 字符串
   * @param resume - 简历数据对象
   * @returns 格式化后的 JSON 字符串
   */
  exportToJson(resume: ResumeData): string {
    return JSON.stringify(resume, null, 2)
  },

  /**
   * 从 JSON 文件导入简历数据
   * @param file - JSON 文件对象
   * @param defaultFactory - 默认简历数据工厂函数
   * @returns 导入结果，包含简历数据和元信息
   * @throws 当 JSON 解析失败时抛出异常
   */
  async importFromJsonFile(file: File, defaultFactory: () => ResumeData): Promise<ImportResult> {
    // 读取文件内容
    const text = await file.text()
    // 解析 JSON 数据
    const parsed = JSON.parse(text) as ResumeData
    // 规范化数据，确保包含所有必需字段
    const normalized = resumeNormalize.ensureDefaults(parsed, defaultFactory)
    return {
      resume: normalized,
      meta: { source: 'json', fileName: file.name },
    }
  },
}
