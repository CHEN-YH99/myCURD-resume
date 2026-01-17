<script setup lang="ts">
import type { ResumeData, ResumeModuleGridRow } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()

const getItemHighlights = (item: any): string[] => {
  const rows = item?.rows as undefined | ResumeModuleGridRow[]
  if (Array.isArray(rows) && rows.length > 0) {
    const out: string[] = []
    for (const r of rows as any[]) {
      const vs = (r as any)?.values
      if (Array.isArray(vs)) out.push(...vs)
    }
    return out
  }
  const hs = item?.highlights
  if (Array.isArray(hs)) return hs
  return []
}
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <div class="r-block__title-left">
        <span v-if="resume.modules.workExp.icon" class="icon">{{ resume.modules.workExp.icon }}</span>
        <span>{{ resume.modules.workExp.title }}</span>
      </div>
    </div>
    <div class="r-block__line" />

    <div class="r-block__content-wrapper">

      <div v-if="resume.modules.workExp.rows && resume.modules.workExp.rows.length > 0 && (!resume.modules.workExp.items || resume.modules.workExp.items.length === 0)" class="r-grid-container">
        <div
          v-for="(row, rowIndex) in resume.modules.workExp.rows"
          :key="rowIndex"
          class="r-split-row"
        >
          <div v-for="(value, colIndex) in row.values" :key="colIndex" class="r-split-cell">
            {{ value }}
          </div>
        </div>
      </div>

      <div v-else-if="resume.modules.workExp.items.length > 0" class="r-block__list">
        <div v-for="item in resume.modules.workExp.items" :key="item.id" class="r-block__item">
          <div class="r-block__item-header">
            <div class="r-block__item-title">
              <span class="r-block__item-company">{{ item.company }}</span>
              <span class="r-block__item-role">{{ item.title }}</span>
            </div>
            <div class="r-block__item-duration">{{ item.start }} - {{ item.end }}</div>
          </div>

        <div v-if="getItemHighlights(item).length" class="r-block__highlights">
          <div v-for="(h, idx) in getItemHighlights(item)" :key="idx" class="r-block__highlight">- {{ h }}</div>
        </div>
      </div>
    </div>

    <div v-else class="r-block__empty">暂无工作经历</div>
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

.r-block__content-wrapper {
  position: relative;
  padding-top: 22px;
}

.r-block__content-time {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.r-block__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.r-block__item {
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.r-block__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.r-block__item-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #111827;
}

.r-block__item-role {
  color: #6b7280;
  font-weight: 500;
}

.r-block__item-duration {
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}

.r-block__highlights {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
}

.r-block__highlight {
  margin-top: 4px;
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
