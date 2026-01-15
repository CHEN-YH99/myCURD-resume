<script setup lang="ts">
import type { ResumeModuleCommon } from '@/types/resume'

defineProps<{
  module: ResumeModuleCommon
}>()
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <span class="icon">{{ module.icon || '⭐' }}</span>
      <span>{{ module.title }}</span>
    </div>
    <div class="r-block__line" />

    <div v-if="module.rows && module.rows.length > 0" class="r-grid-container">
      <div v-for="(row, rowIndex) in module.rows" :key="rowIndex" class="r-split-row">
        <div v-for="(value, colIndex) in row.values" :key="colIndex" class="r-split-cell">
          {{ value }}
        </div>
      </div>
    </div>
    <div v-else class="r-block__empty">暂无内容</div>
  </section>
</template>

<style lang="scss" scoped>
.r-block__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 10px;
}

.r-block__line {
  height: 1px;
  background: #e5e7eb;
  margin-bottom: 16px;
}

.r-block__empty {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}

.r-grid-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.r-split-row {
  display: flex;
  gap: 10px;
}

.r-split-cell {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  color: #111827;
  word-break: break-word;
  white-space: pre-wrap;
}

.icon {
  font-size: 18px;
}
</style>
