<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <span class="icon">{{ resume.modules.selfIntro.icon || '🧾' }}</span>
      <span>{{ resume.modules.selfIntro.title }}</span>
    </div>
    <div class="r-block__line" />

    <div v-if="resume.modules.selfIntro.rows && resume.modules.selfIntro.rows.length > 0" class="r-grid-container">
      <div
        v-for="(row, rowIndex) in resume.modules.selfIntro.rows"
        :key="rowIndex"
        class="r-split-row"
      >
        <div v-for="(value, colIndex) in row.values" :key="colIndex" class="r-split-cell">
          {{ value }}
        </div>
      </div>
    </div>

    <div v-else-if="resume.modules.selfIntro.value.enabled" class="r-block__content">
      {{ resume.modules.selfIntro.value.text }}
    </div>
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
}

.r-block__line {
  margin-top: 10px;
  height: 1px;
  background: #e5e7eb;
}

.r-block__content {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.7;
  color: #111827;
  white-space: pre-wrap;
}

.r-grid-container {
  margin-top: 12px;
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
