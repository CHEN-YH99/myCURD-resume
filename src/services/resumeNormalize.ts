import type { ResumeData, ResumeModuleType } from '@/types/resume'

const isObject = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object'

export const resumeNormalize = {
  ensureDefaults(resume: ResumeData, defaultFactory: () => ResumeData): ResumeData {
    const base = defaultFactory()
    const merged: any = { ...base, ...(resume as any) }

    merged.title = { ...base.title, ...(resume as any)?.title }
    merged.jobIntention = { ...base.jobIntention, ...(resume as any)?.jobIntention }
    merged.personInfo = { ...base.personInfo, ...(resume as any)?.personInfo }

    merged.personInfo.preview = { ...base.personInfo.preview, ...(resume as any)?.personInfo?.preview }
    merged.personInfo.fields = {
      ...(base.personInfo.fields || {}),
      ...(((resume as any)?.personInfo?.fields as any) || {}),
    }
    merged.personInfo.order = Array.isArray((resume as any)?.personInfo?.order)
      ? (resume as any).personInfo.order
      : base.personInfo.order

    merged.modules = { ...base.modules, ...(resume as any)?.modules }
    merged.modules.custom = {
      ...(base.modules.custom || {}),
      ...(((resume as any)?.modules?.custom as any) || {}),
    }

    const order: ResumeModuleType[] = Array.isArray((resume as any)?.modulesOrder)
      ? ((resume as any).modulesOrder as ResumeModuleType[])
      : base.modulesOrder

    const dedup: ResumeModuleType[] = []
    order.forEach((k) => {
      if (dedup.includes(k)) return
      dedup.push(k)
    })

    const builtIn: ResumeModuleType[] = ['education', 'skills', 'workExp', 'projectExp', 'selfIntro']

    const finalOrder = dedup.filter((k) => {
      if (builtIn.includes(k)) return true
      if (String(k).startsWith('custom-')) {
        return !!(merged.modules.custom as any)?.[k]
      }
      return false
    })

    merged.modulesOrder = finalOrder.length ? finalOrder : base.modulesOrder

    builtIn.forEach((k) => {
      const mod = (merged.modules as any)[k]
      if (!isObject(mod)) (merged.modules as any)[k] = (base.modules as any)[k]
    })

    return merged as ResumeData
  },
}
