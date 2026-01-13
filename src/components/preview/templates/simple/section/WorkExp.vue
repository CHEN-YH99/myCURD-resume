<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <span class="icon">💼</span>
      <span>{{ resume.modules.workExp.title }}</span>
    </div>
    <div class="r-block__line" />

    <div v-if="resume.modules.workExp.items.length > 0" class="r-block__list">
      <div v-for="item in resume.modules.workExp.items" :key="item.id" class="r-block__item">
        <div class="r-block__item-header">
          <div class="r-block__item-title">
            <span class="r-block__item-company">{{ item.company }}</span>
            <span class="r-block__item-role">{{ item.title }}</span>
          </div>
          <div class="r-block__item-duration">{{ item.start }} - {{ item.end }}</div>
        </div>

        <div v-if="item.highlights?.length" class="r-block__highlights">
          <div v-for="(h, idx) in item.highlights" :key="idx" class="r-block__highlight">- {{ h }}</div>
        </div>
      </div>
    </div>
    <div v-else class="r-block__empty">暂无工作经历</div>
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

.icon {
  font-size: 18px;
}
</style>
