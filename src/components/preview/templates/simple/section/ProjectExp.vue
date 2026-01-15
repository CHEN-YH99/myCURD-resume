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
        <span class="icon">{{ resume.modules.projectExp.icon || '🚀' }}</span>
        <span>{{ resume.modules.projectExp.title }}</span>
      </div>
      <span class="r-block__time-placeholder" aria-hidden="true"></span>
    </div>
    <div class="r-block__line" />

    <div v-if="resume.modules.projectExp.rows && resume.modules.projectExp.rows.length > 0" class="r-grid-container">
      <div
        v-for="(row, rowIndex) in resume.modules.projectExp.rows"
        :key="rowIndex"
        class="r-split-row"
      >
        <div v-for="(value, colIndex) in row.values" :key="colIndex" class="r-split-cell">
          {{ value }}
        </div>
      </div>
    </div>

    <div v-else-if="resume.modules.projectExp.items.length > 0" class="r-block__list">
      <div v-for="(item, index) in resume.modules.projectExp.items" :key="index" class="r-block__item">
        <div class="r-block__item-header">
          <div class="r-block__item-title">
            <span class="r-block__item-name">{{ item.name }}</span>
            <span v-if="item.role" class="r-block__item-role">（{{ item.role }}）</span>
          </div>
          <div v-if="item.start || item.end" class="r-block__item-duration">
            {{ item.start }} - {{ item.end }}
          </div>
        </div>
        
        <div v-if="item.description" class="r-block__item-desc">
          {{ item.description }}
        </div>
        
        <div v-if="item.link" class="r-block__item-link">
          <a :href="item.link" target="_blank" rel="noopener noreferrer" class="link">
            {{ item.link }}
          </a>
        </div>
      </div>
    </div>

    <div v-else class="r-block__empty">
      暂无项目经历
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
  gap: 20px;
}

.r-block__item {
  background: #f9fafb;
  border-radius: 8px;
  padding: 14px;
  border: 1px solid #e5e7eb;
}

.r-block__item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.r-block__item-title {
  font-weight: 600;
  font-size: 15px;
  color: #111827;
}

.r-block__item-role {
  color: #6b7280;
  font-size: 14px;
}

.r-block__item-duration {
  font-size: 13px;
  color: #6b7280;
}

.r-block__item-desc {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin: 6px 0 8px;
  white-space: pre-wrap;
}

.r-block__item-link {
  font-size: 13px;
}

.link {
  color: #3b82f6;
  text-decoration: none;
  word-break: break-all;
  
  &:hover {
    text-decoration: underline;
  }
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