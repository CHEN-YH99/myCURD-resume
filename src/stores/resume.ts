import { computed, reactive } from 'vue'
import type { ResumeData } from '@/types/resume'
import defaultAvatar from '@/assets/defaultavatar.svg'
import { resumeStorage, type DraftPayload, type ResumeRecord, type ResumeSummary } from '@/services/resumeStorage'
import { resumeImportExport } from '@/services/resumeImportExport'
import { saveAs } from 'file-saver'
import { uid, sanitizeFileName } from '@/utils/format'

// 简历编辑相关的全局 Store：
// - 管理当前编辑中的简历数据（state.resume）与 UI 模式（state.mode）
// - 管理本地已保存的简历列表（state.records）与当前选中的简历 ID（state.currentId）
// - 提供“保存/加载/删除/草稿/导入导出”等动作，供组件调用

// 创建一份“新建简历”的默认数据。
// 注意：其中部分模块 item 的 id 会通过 uid() 动态生成。
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

// 对底层 localStorage 访问做一层薄封装：
// 便于未来替换存储实现/在此处统一做异常兜底。
const safeParseRecords = (): ResumeRecord[] => resumeStorage.readRecords()

// 写入“已保存的简历记录列表”。该写入是覆盖式的（整表写回）。
const safeWriteRecords = (records: ResumeRecord[]) => {
  resumeStorage.writeRecords(records)
}

// 读取草稿；不存在或结构非法时返回 null。
const safeReadDraft = (): DraftPayload | null => resumeStorage.readDraft()

// 写入草稿；用于自动保存/恢复。
const safeWriteDraft = (payload: DraftPayload) => {
  resumeStorage.writeDraft(payload)
}

// 清除草稿存储。
const clearDraftStorage = () => {
  resumeStorage.clearDraft()
}

// 全局响应式状态（模块级单例）：
// - resume：当前编辑中的简历数据
// - mode：编辑/预览/左右分栏
// - currentId：当前简历 ID（未保存时为空字符串）
// - records：本地已保存的简历列表（从 localStorage 初始化）
const state = reactive({
  resume: createDefaultResume(),
  mode: 'both' as 'edit' | 'preview' | 'both',
  currentId: '' as string,
  records: safeParseRecords() as ResumeRecord[],  // 初始化时从 localStorage 读取简历列表
})

// 对外暴露的 Store 组合式函数。
// 通过 computed 暴露只读视图，并提供一组 actions 供组件调用。
export const useResumeStore = () => {
  const resume = computed(() => state.resume)
  const mode = computed({
    get: () => state.mode,
    set: (v: 'edit' | 'preview' | 'both') => {
      state.mode = v
    },
  })

  const resumeSummaries = computed<ResumeSummary[]>(() =>
    state.records
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((r) => ({ id: r.id, title: r.title, updatedAt: r.updatedAt }))
  )

  const hasSaved = computed(() => resumeSummaries.value.length > 0)

  const createNew = () => {
    state.currentId = ''
    state.resume = createDefaultResume()
  }

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

  const loadById = (id: string) => {
    const found = state.records.find((r) => r.id === id)
    if (!found) return false
    state.currentId = id
    state.resume = JSON.parse(JSON.stringify(found.data)) as ResumeData
    return true
  }

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

  const reset = () => {
    createNew()
  }

  const saveDraft = () => {
    const payload: DraftPayload = {
      updatedAt: Date.now(),
      currentId: state.currentId,
      data: JSON.parse(JSON.stringify(state.resume)) as ResumeData,
    }
    safeWriteDraft(payload)
    return payload
  }

  const loadDraft = () => {
    const d = safeReadDraft()
    if (!d) return false
    state.currentId = d.currentId || ''
    state.resume = JSON.parse(JSON.stringify(d.data)) as ResumeData
    return true
  }

  const hasDraft = computed(() => !!safeReadDraft())

  const clearDraft = () => {
    clearDraftStorage()
  }

  const getDraftMeta = computed(() => {
    const d = safeReadDraft()
    if (!d) return null
    return { updatedAt: d.updatedAt, currentId: d.currentId }
  })

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
