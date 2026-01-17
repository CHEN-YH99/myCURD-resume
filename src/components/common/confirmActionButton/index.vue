<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const props = withDefaults(
  defineProps<{
    buttonText: string
    icon?: any
    type?: '' | 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger'
    plain?: boolean
    size?: 'default' | 'large' | 'small'
    disabled?: boolean

    confirmTitle?: string
    confirmMessage: string
    confirmButtonText?: string
    cancelButtonText?: string
    confirmType?: 'warning' | 'info' | 'success' | 'error'

    onConfirm: () => void | Promise<void>
  }>(),
  {
    type: 'default',
    plain: false,
    size: 'default',
    disabled: false,
    confirmTitle: '提示',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    confirmType: 'warning',
  }
)

const loading = ref(false)

const isDisabled = computed(() => props.disabled || loading.value)

const onClick = async () => {
  if (loading.value) return

  try {
    await ElMessageBox.confirm(props.confirmMessage, props.confirmTitle, {
      type: props.confirmType,
      confirmButtonText: props.confirmButtonText,
      cancelButtonText: props.cancelButtonText,
    })
  } catch {
    return
  }

  loading.value = true
  try {
    await props.onConfirm()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-button
    :icon="icon"
    :type="type"
    :plain="plain"
    :size="size"
    :disabled="isDisabled"
    :loading="loading"
    @click="onClick"
  >
    {{ buttonText }}
  </el-button>
</template>
