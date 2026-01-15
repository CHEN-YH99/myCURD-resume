export type ID = string

export type ResumeModuleType =
  | 'education'
  | 'skills'
  | 'workExp'
  | 'projectExp'
  | 'selfIntro'

export interface ResumeTitle {
  title: string
  subtitle?: string
}

export interface JobIntention {
  enabled: boolean
  position: string
  workYears: number
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

  salary?: string
  custom?: {
    title: string
    value: string
  }
}

export interface PersonInfo {
  enabled: boolean

  preview: {
    avatarShape: 'circle' | 'square'
    columns: 1 | 2 | 3
    showLabels: boolean
  }

  avatarUrl: string

  fields: Record<string, { enabled: boolean; label: string; value: string }>
  order: string[]

  name: string
  gender: '男' | '女' | '未知'
  age: number
  phone: string
  email: string
  wechat: string
  github: string
}

export interface EducationItem {
  id: ID
  school: string
  major: string
  degree: string
  start: string
  end: string
}

export interface SkillsItem {
  id: ID
  name: string
  level?: string
  description?: string
}

export interface WorkExpItem {
  id: ID
  company: string
  title: string
  start: string
  end: string
  city?: string
  highlights: string[]
}

export interface ProjectExpItem {
  id: ID
  name: string
  role?: string
  start: string
  end: string
  description: string
  highlights: string[]
  link?: string
}

export interface SelfIntro {
  enabled: boolean
  text: string
}

export type ResumeModuleGridRow = {
  cols: 1 | 2 | 3 | 4 | 5 | 6
  values: string[]
}

export type ResumeModuleCommon = {
  enabled: boolean
  title: string
  /** 模块标题左侧展示的图标（先用 emoji/字符做最小实现） */
  icon?: string
  /** 自定义网格行：点击 +1/+2... 生成 */
  rows?: ResumeModuleGridRow[]
}

export interface ResumeModules {
  education: ResumeModuleCommon & {
    items: EducationItem[]
  }
  skills: ResumeModuleCommon & {
    items: SkillsItem[]
  }
  workExp: ResumeModuleCommon & {
    items: WorkExpItem[]
  }
  projectExp: ResumeModuleCommon & {
    items: ProjectExpItem[]
  }
  selfIntro: ResumeModuleCommon & {
    value: SelfIntro
  }
}

export interface ResumeData {
  title: ResumeTitle
  jobIntention: JobIntention
  personInfo: PersonInfo

  /** 控制简历模块在预览中的显示顺序 */
  modulesOrder: ResumeModuleType[]

  modules: ResumeModules
}
