import { computed, reactive } from 'vue'
import type { ResumeData } from '@/types/resume'
import defaultAvatar from '@/assets/defaultavatar.svg'

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

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

const state = reactive({
  resume: createDefaultResume(),
  mode: 'both' as 'edit' | 'preview' | 'both'
})

export const useResumeStore = () => {
  const resume = computed(() => state.resume)
  const mode = computed({
    get: () => state.mode,
    set: (v: 'edit' | 'preview' | 'both') => {
      state.mode = v
    }
  })

  const reset = () => {
    state.resume = createDefaultResume()
  }

  return {
    resume,
    mode,
    reset
  }
}
