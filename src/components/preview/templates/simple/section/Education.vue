<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <div class="r-block__title-left">
        <span v-if="resume.modules.education.icon" class="icon">{{ resume.modules.education.icon }}</span>
        <span>{{ resume.modules.education.title }}</span>
      </div>
    </div>
    <div class="r-block__line" />

    <div v-if="resume.modules.education.items.length > 0" class="r-block__list">
      <div v-for="item in resume.modules.education.items" :key="item.id" class="r-block__item">
        <div class="r-block__item-header">
          <div class="r-block__item-title">
            <span class="r-block__item-school">{{ item.school }}</span>
          </div>
          <div class="r-block__item-duration">{{ item.start }} - {{ item.end }}</div>
        </div>
        <div class="r-block__item-meta">
          <span>{{ item.degree }}</span>
          <span class="sep">|</span>
          <span>{{ item.major }}</span>
        </div>

        <div v-if="item.rows && item.rows.length > 0" class="r-split-container r-split-container--in-item">
          <div v-for="(row, rowIndex) in item.rows" :key="rowIndex" class="r-split-row">
            <div v-for="(value, colIndex) in row.values" :key="colIndex" class="r-split-cell">
              {{ value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="resume.modules.education.rows && resume.modules.education.rows.length > 0" class="r-split-container r-split-container--module">
      <div
        v-for="(row, rowIndex) in resume.modules.education.rows"
        :key="rowIndex"
        class="r-split-row"
      >
        <div v-for="(value, colIndex) in row.values" :key="colIndex" class="r-split-cell">
          {{ value }}
        </div>
      </div>
    </div>

    <div v-if="(!resume.modules.education.items || resume.modules.education.items.length === 0) && (!resume.modules.education.rows || resume.modules.education.rows.length === 0)" class="r-block__empty">
      暂无教育背景
    </div>
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

.r-block__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.r-block__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.r-block__item-title {
  font-weight: 600;
  color: #111827;
}

.r-block__item-duration {
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}

.r-block__item-meta {
  margin-top: 6px;
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sep {
  color: #9ca3af;
}

.r-block__empty {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}

.r-split-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.r-split-container--in-item {
  margin-top: 10px;
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