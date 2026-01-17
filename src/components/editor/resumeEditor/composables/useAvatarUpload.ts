import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'

export const useAvatarUpload = (opts: { personInfo: Ref<any>; defaultAvatar: string }) => {
  const { personInfo, defaultAvatar } = opts

  const avatarUploading = ref(false)

  const beforeAvatarUpload = (file: File) => {
    const type = String((file as any)?.type || '')
    const name = String((file as any)?.name || '').toLowerCase()
    const isImage = type.indexOf('image/') === 0 || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)
    if (!isImage) {
      ElMessage.error('只能上传图片文件')
      return false
    }

    const maxSizeMB = 2
    const isLtMax = file.size / 1024 / 1024 < maxSizeMB
    if (!isLtMax) {
      ElMessage.error(`图片大小不能超过 ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  const onAvatarChange = (_uploadFile: any, uploadFiles?: any[]) => {
    const file = Array.isArray(uploadFiles) ? uploadFiles[uploadFiles.length - 1] : _uploadFile
    const raw: File | undefined = file?.raw
    if (!raw) return

    avatarUploading.value = true

    const reader = new FileReader()
    reader.onload = () => {
      personInfo.value.avatarUrl = String(reader.result || '')
      avatarUploading.value = false
      ElMessage.success('头像已更新')
    }
    reader.onerror = () => {
      avatarUploading.value = false
      ElMessage.error('头像读取失败')
    }
    reader.readAsDataURL(raw)
  }

  const clearAvatar = () => {
    personInfo.value.avatarUrl = defaultAvatar
  }

  return {
    avatarUploading,
    beforeAvatarUpload,
    onAvatarChange,
    clearAvatar,
  }
}
