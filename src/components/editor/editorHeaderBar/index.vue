<script setup lang="ts">
import { ArrowLeft, Download, Document } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'

type Mode = 'edit' | 'preview' | 'both'

const props = withDefaults(
  defineProps<{
    title?: string
    tagText?: string
    modelValue?: Mode
  }>(),
  {
    title: '简历编辑器',
    tagText: '简历模板',
    modelValue: 'both'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: Mode): void
  (e: 'back'): void
  (e: 'save'): void
  (e: 'export'): void
}>()

const innerMode = ref<Mode>(props.modelValue)

const segmentValue = computed(() => {
  if (innerMode.value === 'both') return 'both'
  if (innerMode.value === 'edit') return 'edit'
  return 'preview'
})

const onSegmentChange = (val: string | number | boolean) => {
  const next = String(val) as Mode
  innerMode.value = next
  emit('update:modelValue', next)
}

const onBack = () => emit('back')
const onSave = () => emit('save')
const onExport = () => emit('export')
</script>

<template>
  <header class="editor-header-bar">
    <div class="left">
      <div class="brand">
        <el-icon class="brand-icon"><Document /></el-icon>
        <span class="brand-title">{{ title }}</span>
      </div>
      <el-tag class="brand-tag" type="success" effect="dark" round>
        {{ tagText }}
      </el-tag>
    </div>

    <div class="center">
      <el-button class="back-btn" round plain :icon="ArrowLeft" @click="onBack">
        返回
      </el-button>

      <el-segmented
        class="mode-seg"
        :model-value="segmentValue"
        @update:model-value="onSegmentChange"
        :options="[
          { label: '编辑+预览', value: 'both' },
          { label: '仅编辑', value: 'edit' },
          { label: '仅预览', value: 'preview' }
        ]"
      />

    </div>

    <div class="right">
      <el-button type="primary" round :icon="Document" @click="onSave">保存</el-button>
      <el-button type="primary" round :icon="Download" @click="onExport">导出</el-button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.editor-header-bar {
  height: 56px;
  padding: 0 16px;
  box-sizing: border-box;
  background: #f6fbff;
  border-bottom: 1px solid #e6eef6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 240px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #1f2d3d;
}

.brand-icon {
  color: #17b26a;
  font-size: 18px;
}

.brand-title {
  font-size: 16px;
  line-height: 20px;
}

.brand-tag {
  --el-tag-border-radius: 999px;
}

.center {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: center;
  min-width: 320px;
}

.back-btn {
  color: #303133;
}

.mode-seg {
  max-width: 360px;
  flex: 0 1 360px;
}

.mode-icons {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #606266;
  user-select: none;
}

.mode-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;

  .el-icon {
    font-size: 16px;
  }

  &.active {
    color: #111827;
  }
}

.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 220px;
}

@media (max-width: 980px) {
  .mode-icons {
    display: none;
  }
}

@media (max-width: 760px) {
  .left {
    min-width: 0;
  }

  .brand-tag {
    display: none;
  }

  .mode-seg {
    display: none;
  }

  .center {
    justify-content: flex-start;
    min-width: 0;
  }
}
</style>
