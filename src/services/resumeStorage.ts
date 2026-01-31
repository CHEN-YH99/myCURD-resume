/**
 * 简历本地存储服务模块
 * @description 提供简历数据和草稿的 localStorage 持久化功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import type { ResumeData } from '@/types/resume'

/**
 * 简历摘要信息类型
 * @description 简历列表页/选择器用的轻量信息：不包含正文 data，便于快速渲染与排序
 */
export type ResumeSummary = {
  /** 简历唯一标识 */
  id: string
  /** 简历标题 */
  title: string
  /** 更新时间戳 */
  updatedAt: number
}

/**
 * 简历完整记录类型
 * @description 本地持久化的完整简历记录：包含摘要信息 + 完整简历数据
 */
export type ResumeRecord = ResumeSummary & {
  /** 完整简历数据 */
  data: ResumeData
}

/**
 * 草稿数据类型
 * @description 用于"编辑未保存/自动保存"的恢复
 */
export type DraftPayload = {
  /** 草稿更新时间戳 */
  updatedAt: number
  /** 当前编辑的简历 ID */
  currentId: string
  /** 草稿简历数据 */
  data: ResumeData
}

/**
 * localStorage 的 key 统一管理
 * @description 避免 key 散落在业务代码中
 */
const STORAGE_KEY = 'mycurd-resume:records'
const DRAFT_KEY = 'mycurd-resume:draft'

/**
 * 安全的 JSON 解析函数
 * @param raw - 待解析的 JSON 字符串
 * @returns 解析成功返回对象，失败返回 null
 * @description 避免 localStorage 被手动篡改/旧版本数据导致的 JSON.parse 抛错
 */
const safeParseJson = <T>(raw: string | null): T | null => {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    // 解析失败返回 null，由上层处理
    return null
  }
}

/**
 * 简历本地存储服务对象
 * @description 只负责读写与最小校验，不做业务层的合并/迁移
 */
export const resumeStorage = {
  /**
   * 读取全部简历记录
   * @returns 简历记录数组，当 key 不存在/数据非法时返回空数组
   */
  readRecords(): ResumeRecord[] {
    const parsed = safeParseJson<unknown>(localStorage.getItem(STORAGE_KEY))
    // 确保返回值为数组
    if (!Array.isArray(parsed)) return []
    return parsed as ResumeRecord[]
  },

  /**
   * 覆盖写入全部简历记录
   * @param records - 简历记录数组
   */
  writeRecords(records: ResumeRecord[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  },

  /**
   * 读取草稿数据
   * @returns 草稿数据对象，不存在或结构非法时返回 null
   * @description 只做最基础的结构检查：必须是对象且包含 data 字段
   */
  readDraft(): DraftPayload | null {
    const parsed = safeParseJson<any>(localStorage.getItem(DRAFT_KEY))
    // 验证数据结构
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.data) return null
    return parsed as DraftPayload
  },

  /**
   * 写入草稿数据
   * @param payload - 草稿数据对象
   * @description 用于自动保存/手动保存草稿
   */
  writeDraft(payload: DraftPayload) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
  },

  /**
   * 清理草稿数据
   * @description 例如：用户显式保存简历后，或用户选择"放弃草稿"
   */
  clearDraft() {
    localStorage.removeItem(DRAFT_KEY)
  },
}
