/**
 * 头像上传组合式函数
 * @description 提供头像上传、验证、预览和清除功能
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 头像上传功能组合式函数
 * @param opts - 配置选项
 * @param opts.personInfo - 个人信息响应式对象
 * @param opts.defaultAvatar - 默认头像地址
 * @returns 返回头像上传相关的状态和方法
 */
export const useAvatarUpload = (opts: { personInfo: Ref<any>; defaultAvatar: string }) => {
  const { personInfo, defaultAvatar } = opts

  // 头像上传中状态标识
  const avatarUploading = ref(false)

  /**
   * 头像上传前的验证钩子
   * @param file - 待上传的文件对象
   * @returns 验证通过返回 true，否则返回 false
   */
  const beforeAvatarUpload = (file: File) => {
    // 验证文件类型是否为图片
    const type = String((file as any)?.type || '')
    const name = String((file as any)?.name || '').toLowerCase()
    const isImage = type.indexOf('image/') === 0 || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)
    if (!isImage) {
      ElMessage.error('只能上传图片文件')
      return false
    }

    // 验证文件大小不超过 2MB
    const maxSizeMB = 2
    const isLtMax = file.size / 1024 / 1024 < maxSizeMB
    if (!isLtMax) {
      ElMessage.error(`图片大小不能超过 ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  /**
   * 头像文件变更处理函数
   * @param _uploadFile - 当前上传的文件
   * @param uploadFiles - 上传文件列表（可选）
   */
  const onAvatarChange = (_uploadFile: any, uploadFiles?: any[]) => {
    // 获取最新上传的文件
    const file = Array.isArray(uploadFiles) ? uploadFiles[uploadFiles.length - 1] : _uploadFile
    const raw: File | undefined = file?.raw
    if (!raw) return

    avatarUploading.value = true

    // 使用 FileReader 读取图片文件并转换为 Base64
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

  /**
   * 清除头像，恢复为默认头像
   */
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
