<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    buttonText?: string
    plain?: boolean
    size?: 'default' | 'large' | 'small'
    disabled?: boolean
    accept?: string
    beforeImport: (file: File) => Promise<void>
  }>(),
  {
    buttonText: '导入',
    plain: true,
    size: 'default',
    disabled: false,
    accept: '.json,application/json',
  }
)

const importing = ref(false)

const beforeUpload = async (file: File) => {
  if (importing.value) return false

  importing.value = true
  try {
    await props.beforeImport(file)
  } catch (e: any) {
    ElMessage.error(e?.message || '导入失败，请检查 JSON 文件')
  } finally {
    importing.value = false
  }

  return false
}

const isDisabled = computed(() => props.disabled || importing.value)
</script>

<template>
  <el-upload
    action="#"
    :auto-upload="false"
    :show-file-list="false"
    :disabled="isDisabled"
    :accept="accept"
    :before-upload="beforeUpload"
  >
    <el-button :icon="Upload" :plain="plain" :size="size" :loading="importing" :disabled="disabled">
      {{ buttonText }}
    </el-button>
  </el-upload>
</template>
