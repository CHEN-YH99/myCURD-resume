<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <div class="r-header">
    <div class="r-header__avatar">
      <img class="r-header__img" :src="resume.personInfo.avatarUrl" alt="avatar" />
    </div>

    <div class="r-header__title">{{ resume.title.title || '简历模板' }}</div>

    <div v-if="resume.jobIntention.enabled" class="r-header__meta">
      <span>工作经验：{{ resume.jobIntention.workYears }}年</span>
      <span class="sep">|</span>
      <span>求职意向：{{ resume.jobIntention.position }}</span>
      <span class="sep">|</span>
      <span>期望城市：{{ resume.jobIntention.city }}</span>
    </div>

    <div v-if="resume.personInfo.enabled" class="r-header__contact">
      <span class="item">{{ resume.personInfo.gender }} | {{ resume.personInfo.age }}岁</span>
      <span class="item">{{ resume.personInfo.phone }}</span>
      <span class="item">{{ resume.personInfo.email }}</span>
      <span class="item">{{ resume.personInfo.wechat }}</span>
      <a class="item link" :href="resume.personInfo.github" target="_blank" rel="noreferrer">{{ resume.personInfo.github }}</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.r-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.r-header__avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--el-color-primary-light-9);
  background: #fff;
}

.r-header__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.r-header__title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  letter-spacing: 1px;
}

.r-header__meta {
  font-size: 14px;
  color: #111827;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.sep {
  color: #9ca3af;
}

.r-header__contact {
  width: 100%;
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  color: #111827;
}

.item {
  white-space: nowrap;
}

.link {
  color: var(--el-color-primary);
}
</style>
