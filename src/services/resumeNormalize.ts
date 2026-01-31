/**
 * 简历数据规范化服务模块
 * @description 提供简历数据的校验、合并和默认值填充功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import type { ResumeData, ResumeModuleType } from '@/types/resume'

/**
 * 判断值是否为对象类型
 * @param v - 待判断的值
 * @returns 如果是对象返回 true，否则返回 false
 */
const isObject = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object'

/**
 * 简历数据规范化服务对象
 */
export const resumeNormalize = {
  /**
   * 确保简历数据包含所有必需的默认字段
   * @param resume - 待规范化的简历数据
   * @param defaultFactory - 默认简历数据工厂函数
   * @returns 规范化后的简历数据
   * @description 将导入的简历数据与默认数据合并，确保数据结构完整
   */
  ensureDefaults(resume: ResumeData, defaultFactory: () => ResumeData): ResumeData {
    // 获取默认数据
    const base = defaultFactory()
    // 浅合并顶层字段
    const merged: any = { ...base, ...(resume as any) }

    // 合并标题信息
    merged.title = { ...base.title, ...(resume as any)?.title }
    // 合并求职意向
    merged.jobIntention = { ...base.jobIntention, ...(resume as any)?.jobIntention }
    // 合并个人信息
    merged.personInfo = { ...base.personInfo, ...(resume as any)?.personInfo }

    // 合并个人信息的预览配置
    merged.personInfo.preview = { ...base.personInfo.preview, ...(resume as any)?.personInfo?.preview }
    // 合并个人信息字段配置
    merged.personInfo.fields = {
      ...(base.personInfo.fields || {}),
      ...(((resume as any)?.personInfo?.fields as any) || {}),
    }
    // 合并个人信息字段顺序
    merged.personInfo.order = Array.isArray((resume as any)?.personInfo?.order)
      ? (resume as any).personInfo.order
      : base.personInfo.order

    // 合并模块数据
    merged.modules = { ...base.modules, ...(resume as any)?.modules }
    // 合并自定义模块
    merged.modules.custom = {
      ...(base.modules.custom || {}),
      ...(((resume as any)?.modules?.custom as any) || {}),
    }

    // 处理模块显示顺序
    const order: ResumeModuleType[] = Array.isArray((resume as any)?.modulesOrder)
      ? ((resume as any).modulesOrder as ResumeModuleType[])
      : base.modulesOrder

    // 去重模块顺序
    const dedup: ResumeModuleType[] = []
    order.forEach((k) => {
      if (dedup.includes(k)) return
      dedup.push(k)
    })

    // 内置模块类型列表
    const builtIn: ResumeModuleType[] = ['education', 'skills', 'workExp', 'projectExp', 'selfIntro']

    // 过滤有效的模块
    const finalOrder = dedup.filter((k) => {
      // 保留内置模块
      if (builtIn.includes(k)) return true
      // 保留存在的自定义模块
      if (String(k).startsWith('custom-')) {
        return !!(merged.modules.custom as any)?.[k]
      }
      return false
    })

    // 使用过滤后的顺序，如果为空则使用默认顺序
    merged.modulesOrder = finalOrder.length ? finalOrder : base.modulesOrder

    // 确保内置模块数据结构完整
    builtIn.forEach((k) => {
      const mod = (merged.modules as any)[k]
      if (!isObject(mod)) (merged.modules as any)[k] = (base.modules as any)[k]
    })

    return merged as ResumeData
  },
}
