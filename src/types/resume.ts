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
  avatarUrl: string
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

export interface ResumeModules {
  education: {
    enabled: boolean
    title: string
    items: EducationItem[]
  }
  skills: {
    enabled: boolean
    title: string
    items: SkillsItem[]
  }
  workExp: {
    enabled: boolean
    title: string
    items: WorkExpItem[]
  }
  projectExp: {
    enabled: boolean
    title: string
    items: ProjectExpItem[]
  }
  selfIntro: {
    enabled: boolean
    title: string
    value: SelfIntro
  }
}

export interface ResumeData {
  title: ResumeTitle
  jobIntention: JobIntention
  personInfo: PersonInfo
  modules: ResumeModules
}
