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
        <span v-if="resume.modules.skills.icon" class="icon">{{ resume.modules.skills.icon }}</span>
        <span>{{ resume.modules.skills.title }}</span>
      </div>
      <span class="r-block__time-placeholder" aria-hidden="true"></span>
    </div>
    <div class="r-block__line" />

    <div v-if="resume.modules.skills.rows && resume.modules.skills.rows.length > 0" class="r-split-container">
      <div
        v-for="(row, rowIndex) in resume.modules.skills.rows"
        :key="rowIndex"
        class="r-split-row"
      >
        <div v-for="(value, colIndex) in row.values" :key="colIndex" class="r-split-cell">
          {{ value }}
        </div>
      </div>
    </div>

    <div v-else-if="resume.modules.skills.items.length > 0" class="r-block__list">
      <div v-for="item in resume.modules.skills.items" :key="item.id" class="r-block__item">
        <div class="r-block__item-title">
          <span class="name">{{ item.name }}</span>
          <span v-if="item.level" class="level">{{ item.level }}</span>
        </div>
        <div v-if="item.description" class="desc">{{ item.description }}</div>
      </div>
    </div>

    <div v-else class="r-block__empty">暂无技能</div>
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
  gap: 12px;
}

.r-block__item {
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.r-block__item-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  font-weight: 700;
  color: #111827;
}

.level {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}

.desc {
  margin-top: 6px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
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
