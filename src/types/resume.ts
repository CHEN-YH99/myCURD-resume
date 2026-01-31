/**
 * 简历数据类型定义模块
 * @description 定义简历相关的所有数据结构和类型
 * @author Resume Editor Team
 * @date 2024-01-31
 */

/** 唯一标识符类型 */
export type ID = string

/**
 * 简历模块类型
 * @description 包含内置模块和自定义模块
 */
export type ResumeModuleType =
  | 'education'      // 教育背景
  | 'skills'         // 专业技能
  | 'workExp'        // 工作经历
  | 'projectExp'     // 项目经历
  | 'selfIntro'      // 自我评价
  | `custom-${string}` // 自定义模块

/**
 * 简历标题信息
 */
export interface ResumeTitle {
  /** 主标题 */
  title: string
  /** 副标题（可选） */
  subtitle?: string
  /** 对齐方式（可选） */
  align?: 'left' | 'center' | 'right'
}

/**
 * 求职意向信息
 */
export interface JobIntention {
  /** 是否启用 */
  enabled: boolean
  /** 期望职位 */
  position: string
  /** 工作年限 */
  workYears: number
  /** 期望城市 */
  city: string

  /** 控制求职意向内部字段显示/添加 */
  fields: {
    workYears: boolean
    position: boolean
    city: boolean
    salary: boolean
    custom: boolean
  }

  /** 控制求职意向字段显示顺序 */
  order: Array<keyof JobIntention['fields']>

  /** 期望薪资（可选） */
  salary?: string
  /** 自定义字段（可选） */
  custom?: {
    title: string
    value: string
  }
}

/**
 * 个人信息
 */
export interface PersonInfo {
  /** 是否启用 */
  enabled: boolean

  /** 预览配置 */
  preview: {
    /** 头像形状 */
    avatarShape: 'circle' | 'square'
    /** 列数 */
    columns: 1 | 2 | 3
    /** 是否显示标签 */
    showLabels: boolean
  }

  /** 头像 URL */
  avatarUrl: string

  /** 字段配置 */
  fields: Record<string, { enabled: boolean; label: string; value: string }>
  /** 字段显示顺序 */
  order: string[]

  /** 姓名 */
  name: string
  /** 性别 */
  gender: '男' | '女' | '未知'
  /** 年龄 */
  age: number
  /** 电话 */
  phone: string
  /** 邮箱 */
  email: string
  /** 微信 */
  wechat: string
  /** Github */
  github: string
}

/**
 * 教育经历项
 */
export interface EducationItem {
  /** 唯一标识 */
  id: ID
  /** 学校名称 */
  school: string
  /** 专业 */
  major: string
  /** 学历 */
  degree: string
  /** 开始时间 */
  start: string
  /** 结束时间 */
  end: string
  /** 每条教育经历自己的等分网格内容（可选） */
  rows?: ResumeModuleGridRow[]
}

/**
 * 技能项
 */
export interface SkillsItem {
  /** 唯一标识 */
  id: ID
  /** 技能名称 */
  name: string
  /** 掌握程度（可选） */
  level?: string
  /** 技能描述（可选） */
  description?: string
}

/**
 * 工作经历项
 */
export interface WorkExpItem {
  /** 唯一标识 */
  id: ID
  /** 公司名称 */
  company: string
  /** 职位 */
  title: string
  /** 开始时间 */
  start: string
  /** 结束时间 */
  end: string
  /** 工作城市（可选） */
  city?: string
  /** 工作亮点 */
  highlights: string[]
}

/**
 * 项目经历项
 */
export interface ProjectExpItem {
  /** 唯一标识 */
  id: ID
  /** 项目名称 */
  name: string
  /** 项目角色（可选） */
  role?: string
  /** 开始时间 */
  start: string
  /** 结束时间 */
  end: string
  /** 项目描述 */
  description: string
  /** 项目亮点 */
  highlights: string[]
  /** 项目链接（可选） */
  link?: string
}

/**
 * 自我评价
 */
export interface SelfIntro {
  /** 是否启用 */
  enabled: boolean
  /** 评价内容 */
  text: string
}

/**
 * 简历模块网格行
 * @description 用于自定义网格布局
 */
export type ResumeModuleGridRow = {
  /** 列数 */
  cols: 1 | 2 | 3 | 4 | 5 | 6
  /** 每列的值 */
  values: string[]
}

/**
 * 简历模块通用属性
 */
export type ResumeModuleCommon = {
  /** 是否启用 */
  enabled: boolean
  /** 模块标题 */
  title: string
  /** 模块标题左侧展示的图标（可选，使用 emoji/字符） */
  icon?: string
  /** 模块时间（预览右上角展示），格式：['YYYY-MM','YYYY-MM'] 或字符串（可选） */
  time?: [string, string] | string
  /** 自定义网格行：点击 +1/+2... 生成（可选） */
  rows?: ResumeModuleGridRow[]
}

/**
 * 简历模块集合
 */
export interface ResumeModules {
  /** 教育背景模块 */
  education: ResumeModuleCommon & {
    items: EducationItem[]
  }
  /** 专业技能模块 */
  skills: ResumeModuleCommon & {
    items: SkillsItem[]
  }
  /** 工作经历模块 */
  workExp: ResumeModuleCommon & {
    items: WorkExpItem[]
  }
  /** 项目经历模块 */
  projectExp: ResumeModuleCommon & {
    items: ProjectExpItem[]
  }
  /** 自我评价模块 */
  selfIntro: ResumeModuleCommon & {
    value: SelfIntro
  }
  /** 自定义模块集合 */
  custom: Record<string, ResumeModuleCommon>
}

/**
 * 简历完整数据结构
 */
export interface ResumeData {
  /** 简历标题 */
  title: ResumeTitle
  /** 求职意向 */
  jobIntention: JobIntention
  /** 个人信息 */
  personInfo: PersonInfo

  /** 控制简历模块在预览中的显示顺序 */
  modulesOrder: ResumeModuleType[]

  /** 简历模块数据 */
  modules: ResumeModules
}
