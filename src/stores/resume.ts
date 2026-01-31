/**
 * 简历状态管理模块
 * @description 管理简历编辑、保存、加载、草稿等全局状态和操作
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { computed, reactive } from 'vue'
import type { ResumeData } from '@/types/resume'
import defaultAvatar from '@/assets/defaultavatar.svg'
import { resumeStorage, type DraftPayload, type ResumeRecord, type ResumeSummary } from '@/services/resumeStorage'
import { resumeImportExport } from '@/services/resumeImportExport'
import { saveAs } from 'file-saver'
import { uid, sanitizeFileName } from '@/utils/format'

/**
 * 创建默认简历数据
 * @returns 包含默认值的简历数据对象
 * @description 创建一份"新建简历"的默认数据，其中部分模块 item 的 id 会通过 uid() 动态生成
 */
const createDefaultResume = (): ResumeData => ({
  title: {
    title: '简历标题',
    subtitle: '简历模板'
  },
  jobIntention: {
    enabled: true,
    position: 'Java高级开发工程师',
    workYears: 5,
    city: '北京',
    fields: {
      workYears: true,
      position: true,
      city: true,
      salary: false,
      custom: false
    },
    order: ['workYears', 'position', 'city', 'salary', 'custom'],
    salary: '',
    custom: {
      title: '自定义',
      value: ''
    }
  },
  personInfo: {
    enabled: true,

    preview: {
      avatarShape: 'circle',
      columns: 1,
      showLabels: true
    },

    avatarUrl: defaultAvatar,

    fields: {
      name: { enabled: true, label: '姓名', value: '' },
      gender: { enabled: true, label: '性别', value: '男' },
      age: { enabled: true, label: '年龄', value: '27' },
      phone: { enabled: true, label: '电话', value: '131xxxx8888' },
      email: { enabled: true, label: '邮箱', value: 'admin@google.com' },
      wechat: { enabled: true, label: '微信', value: '0123456789' },
      github: { enabled: true, label: 'Github', value: 'https://github.com/wzd' }
    },
    order: ['name', 'gender', 'age', 'phone', 'email', 'wechat', 'github'],

    name: '张三',
    gender: '男',
    age: 27,
    phone: '131xxxx8888',
    email: 'admin@google.com',
    wechat: '0123456789',
    github: 'https://github.com/wzd'
  },
  modulesOrder: ['education', 'skills', 'workExp', 'projectExp', 'selfIntro'],
  modules: {
    custom: {},
    education: {
      enabled: true,
      title: '教育背景',
      icon: '🎓',
      time: ['', ''],
      rows: [],
      items: [
        {
          id: uid(),
          school: '示例大学',
          major: '计算机科学与技术',
          degree: '本科',
          start: '2017-09',
          end: '2021-06'
        }
      ]
    },
    skills: {
      enabled: true,
      title: '专业技能',
      icon: '🛠️',
      time: ['', ''],
      rows: [],
      items: [
        {
          id: uid(),
          name: 'Vue / TypeScript',
          level: '熟练',
          description: '熟悉 Vue3 生态，能独立完成中后台页面开发'
        }
      ]
    },
    workExp: {
      enabled: true,
      title: '工作经历',
      icon: '💼',
      time: ['', ''],
      rows: [],
      items: [
        {
          id: uid(),
          company: '示例科技',
          title: '前端开发',
          start: '2021-07',
          end: '至今',
          city: '北京',
          highlights: ['负责核心业务模块开发', '推动组件化与工程化落地']
        }
      ]
    },
    projectExp: {
      enabled: true,
      title: '项目经历',
      icon: '📌',
      time: ['', ''],
      rows: [],
      items: [
        {
          id: uid(),
          name: '示例项目',
          role: '核心开发',
          start: '2022-01',
          end: '2022-06',
          description: '项目简介...',
          highlights: ['负责需求拆解与实现', '性能优化与体验提升'],
          link: ''
        }
      ]
    },
    selfIntro: {
      enabled: true,
      title: '自我评价',
      icon: '📝',
      time: ['', ''],
      rows: [],
      value: {
        enabled: true,
        text: '热爱技术，学习能力强，沟通协作良好。'
      }
    }
  }
})

/**
 * 安全读取简历记录列表
 * @returns 简历记录数组
 * @description 对底层 localStorage 访问做一层薄封装，便于未来替换存储实现
 */
const safeParseRecords = (): ResumeRecord[] => resumeStorage.readRecords()

/**
 * 安全写入简历记录列表
 * @param records - 简历记录数组
 * @description 覆盖式写入整个简历记录表
 */
const safeWriteRecords = (records: ResumeRecord[]) => {
  resumeStorage.writeRecords(records)
}

/**
 * 安全读取草稿数据
 * @returns 草稿数据对象，不存在或结构非法时返回 null
 */
const safeReadDraft = (): DraftPayload | null => resumeStorage.readDraft()

/**
 * 安全写入草稿数据
 * @param payload - 草稿数据对象
 * @description 用于自动保存/恢复
 */
const safeWriteDraft = (payload: DraftPayload) => {
  resumeStorage.writeDraft(payload)
}

/**
 * 清除草稿存储
 */
const clearDraftStorage = () => {
  resumeStorage.clearDraft()
}

/**
 * 全局响应式状态（模块级单例）
 * @description 管理当前编辑中的简历数据、UI 模式、当前简历 ID 和本地已保存的简历列表
 */
const state = reactive({
  /** 当前编辑中的简历数据 */
  resume: createDefaultResume(),
  /** 编辑/预览/左右分栏模式 */
  mode: 'both' as 'edit' | 'preview' | 'both',
  /** 当前简历 ID（未保存时为空字符串） */
  currentId: '' as string,
  /** 本地已保存的简历列表（从 localStorage 初始化） */
  records: safeParseRecords() as ResumeRecord[],
})

/**
 * 简历状态管理组合式函数
 * @returns 简历相关的状态和操作方法
 * @description 对外暴露的 Store 组合式函数，通过 computed 暴露只读视图，并提供一组 actions 供组件调用
 */
export const useResumeStore = () => {
  /** 当前简历数据（只读） */
  const resume = computed(() => state.resume)
  
  /** 编辑模式（可读写） */
  const mode = computed({
    get: () => state.mode,
    set: (v: 'edit' | 'preview' | 'both') => {
      state.mode = v
    },
  })

  /**
   * 简历摘要列表（只读）
   * @description 按更新时间倒序排列
   */
  const resumeSummaries = computed<ResumeSummary[]>(() =>
    state.records
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((r) => ({ id: r.id, title: r.title, updatedAt: r.updatedAt }))
  )

  /** 是否有已保存的简历 */
  const hasSaved = computed(() => resumeSummaries.value.length > 0)

  /**
   * 创建新简历
   * @description 清空当前 ID 并重置为默认简历数据
   */
  const createNew = () => {
    state.currentId = ''
    state.resume = createDefaultResume()
  }

  /**
   * 保存当前简历
   * @returns 返回保存后的简历 ID 和标题
   * @description 如果当前 ID 为空则创建新记录，否则更新现有记录
   */
  const saveCurrent = () => {
    const now = Date.now()
    const id = state.currentId || uid()
    const title = String(state.resume.title?.title || '').trim() || '未命名简历'

    const record: ResumeRecord = {
      id,
      title,
      updatedAt: now,
      data: JSON.parse(JSON.stringify(state.resume)) as ResumeData,
    }

    const idx = state.records.findIndex((r) => r.id === id)
    if (idx >= 0) state.records[idx] = record
    else state.records.unshift(record)

    state.currentId = id
    safeWriteRecords(state.records)

    return { id, title }
  }

  /**
   * 根据 ID 加载简历
   * @param id - 简历 ID
   * @returns 加载成功返回 true，失败返回 false
   */
  const loadById = (id: string) => {
    const found = state.records.find((r) => r.id === id)
    if (!found) return false
    state.currentId = id
    state.resume = JSON.parse(JSON.stringify(found.data)) as ResumeData
    return true
  }

  /**
   * 根据 ID 删除简历
   * @param id - 简历 ID
   * @returns 删除成功返回 true，失败返回 false
   * @description 如果删除的是当前编辑的简历，则重置为新建状态
   */
  const removeById = (id: string) => {
    const idx = state.records.findIndex((r) => r.id === id)
    if (idx < 0) return false
    state.records.splice(idx, 1)
    safeWriteRecords(state.records)

    if (state.currentId === id) {
      state.currentId = ''
      state.resume = createDefaultResume()
    }

    return true
  }

  /**
   * 重置简历数据
   * @description 等同于创建新简历
   */
  const reset = () => {
    createNew()
  }

  /**
   * 保存草稿
   * @returns 返回草稿数据对象
   */
  const saveDraft = () => {
    const payload: DraftPayload = {
      updatedAt: Date.now(),
      currentId: state.currentId,
      data: JSON.parse(JSON.stringify(state.resume)) as ResumeData,
    }
    safeWriteDraft(payload)
    return payload
  }

  /**
   * 加载草稿
   * @returns 加载成功返回 true，失败返回 false
   */
  const loadDraft = () => {
    const d = safeReadDraft()
    if (!d) return false
    state.currentId = d.currentId || ''
    state.resume = JSON.parse(JSON.stringify(d.data)) as ResumeData
    return true
  }

  /** 是否存在草稿 */
  const hasDraft = computed(() => !!safeReadDraft())

  /**
   * 清除草稿
   */
  const clearDraft = () => {
    clearDraftStorage()
  }

  /** 草稿元信息 */
  const getDraftMeta = computed(() => {
    const d = safeReadDraft()
    if (!d) return null
    return { updatedAt: d.updatedAt, currentId: d.currentId }
  })

  /**
   * 从 JSON 文件导入简历
   * @param file - JSON 文件对象
   * @returns 返回导入后的简历 ID 和标题
   * @throws 当文件解析失败时抛出异常
   */
  const importResumeFromJsonFile = async (file: File) => {
    const { resume: imported } = await resumeImportExport.importFromJsonFile(file, createDefaultResume)

    const now = Date.now()
    const id = uid()
    const title = String(imported.title?.title || '').trim() || '未命名简历'

    const record: ResumeRecord = {
      id,
      title,
      updatedAt: now,
      data: JSON.parse(JSON.stringify(imported)) as ResumeData,
    }

    state.records.unshift(record)
    safeWriteRecords(state.records)

    state.currentId = id
    state.resume = JSON.parse(JSON.stringify(imported)) as ResumeData

    return { id, title }
  }

  /**
   * 导出简历记录为 JSON 文件
   * @param id - 简历 ID（可选，默认使用当前简历）
   * @returns 导出成功返回 true，失败返回 false
   */
  const exportResumeRecordToJsonFile = (id?: string) => {
    const targetId = id || state.currentId
    if (!targetId) return false

    const found = state.records.find((r) => r.id === targetId)
    const data = found?.data || state.resume

    const title = String((data as any)?.title?.title || found?.title || '简历').trim() || '简历'
    const safeName = sanitizeFileName(title)

    const json = resumeImportExport.exportToJson(data as ResumeData)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    saveAs(blob, `${safeName}.json`)
    return true
  }

  return {
    resume,
    mode,
    resumeSummaries,
    hasSaved,
    createNew,
    saveCurrent,
    loadById,
    removeById,
    reset,

    hasDraft,
    getDraftMeta,
    saveDraft,
    loadDraft,
    clearDraft,

    importResumeFromJsonFile,
    exportResumeRecordToJsonFile,
  }
}
