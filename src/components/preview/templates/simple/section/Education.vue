<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <span class="icon">🎓</span>
      <span>{{ resume.modules.education.title }}</span>
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
      </div>
    </div>
    <div v-else class="r-block__empty">暂无教育背景</div>
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

.icon {
  font-size: 18px;
}
</style>