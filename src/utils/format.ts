export const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const sanitizeFileName = (name: string) => {
  const safe = String(name || '').replace(/[\\/:*?"<>|]/g, '_').trim()
  return safe || '简历'
}

export const formatTime = (t: number) => {
  try {
    return new Date(t).toLocaleString()
  } catch {
    return ''
  }
}
