<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'

const props = withDefaults(
  defineProps<{
    buttonText?: string
    plain?: boolean
    size?: 'default' | 'large' | 'small'
    disabled?: boolean
    exportJson: () => boolean | Promise<boolean>
  }>(),
  {
    buttonText: '导出',
    plain: true,
    size: 'default',
    disabled: false,
  }
)

const exporting = ref(false)

const onClick = async () => {
  if (exporting.value) return

  exporting.value = true
  try {
    const ok = await props.exportJson()
    if (!ok) ElMessage.error('导出失败')
  } catch (e: any) {
    ElMessage.error(e?.message || '导出失败')
  } finally {
    exporting.value = false
  }
}

const isDisabled = computed(() => props.disabled || exporting.value)
</script>

<template>
  <el-button :icon="Download" :plain="plain" :size="size" :loading="exporting" :disabled="isDisabled" @click="onClick">
    {{ buttonText }}
  </el-button>
</template>
