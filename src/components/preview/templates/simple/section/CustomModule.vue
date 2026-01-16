<script setup lang="ts">
import type { ResumeModuleCommon } from '@/types/resume'

defineProps<{
  module: ResumeModuleCommon
}>()
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <div class="r-block__title-left">
        <span class="icon">{{ module.icon || '⭐' }}</span>
        <span>{{ module.title }}</span>
      </div>
      <span v-if="Array.isArray(module.time) && module.time.length === 2 && module.time[0] && module.time[1]" class="r-block__time">{{ module.time[0] }} - {{ module.time[1] }}</span>
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
  justify-content: space-between;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 10px;
}

.r-block__title-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.r-block__time {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
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
}

.icon {
  font-size: 18px;
}
</style>
