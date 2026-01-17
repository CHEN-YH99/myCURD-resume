<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import ConfirmActionButton from '@/components/common/confirmActionButton/index.vue'

const props = withDefaults(
  defineProps<{
    confirmMessage?: string
    size?: 'default' | 'large' | 'small'
    disabled?: boolean
    onConfirm: () => void | Promise<void>
  }>(),
  {
    confirmMessage: '确认删除？此操作不可恢复。',
    size: 'default',
    disabled: false,
  }
)
</script>

<template>
  <ConfirmActionButton
    button-text="删除"
    :icon="Delete"
    type="danger"
    plain
    :size="props.size"
    :disabled="props.disabled"
    confirm-title="提示"
    :confirm-message="props.confirmMessage"
    confirm-button-text="删除"
    cancel-button-text="取消"
    confirm-type="warning"
    :on-confirm="props.onConfirm"
  />
</template>
