<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <section class="r-block">
    <div class="r-block__title">
      <span class="icon">🛠️</span>
      <span>{{ resume.modules.skills.title }}</span>
    </div>
    <div class="r-block__line" />

    <div v-if="resume.modules.skills.items.length > 0" class="r-block__list">
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

.icon {
  font-size: 18px;
}
</style>
