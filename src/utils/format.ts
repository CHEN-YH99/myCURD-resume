/**
 * 格式化工具函数模块
 * @description 提供 ID 生成、文件名清理、时间格式化等通用工具函数
 * @author Resume Editor Team
 * @date 2024-01-31
 */

/**
 * 生成唯一标识符
 * @returns 唯一的 ID 字符串
 * @description 基于时间戳和随机数生成唯一 ID
 * @example
 * const id = uid() // "1706688000000-a1b2c3d4e5f6"
 */
export const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

/**
 * 清理文件名中的非法字符
 * @param name - 原始文件名
 * @returns 清理后的安全文件名
 * @description 将文件名中的非法字符（\ / : * ? " < > |）替换为下划线
 * @example
 * sanitizeFileName('简历:2024') // "简历_2024"
 * sanitizeFileName('') // "简历"
 */
export const sanitizeFileName = (name: string) => {
  // 替换非法字符并去除首尾空格
  const safe = String(name || '').replace(/[\\/:*?"<>|]/g, '_').trim()
  // 如果清理后为空，返回默认值
  return safe || '简历'
}

/**
 * 格式化时间戳为本地时间字符串
 * @param t - 时间戳（毫秒）
 * @returns 格式化后的时间字符串，失败返回空字符串
 * @description 将时间戳转换为本地化的日期时间字符串
 * @example
 * formatTime(1706688000000) // "2024/1/31 12:00:00"
 */
export const formatTime = (t: number) => {
  try {
    return new Date(t).toLocaleString()
  } catch {
    // 格式化失败返回空字符串
    return ''
  }
}
