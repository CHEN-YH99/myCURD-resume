<script setup lang="ts">
import type { ResumeData } from '@/types/resume'
import HeaderSection from './section/Header.vue'
import BaseInfoSection from './section/BaseInfo.vue'
import EducationSection from './section/Education.vue'
import SkillsSection from './section/Skills.vue'
import WorkExpSection from './section/WorkExp.vue'
import ProjectExpSection from './section/ProjectExp.vue'
import SelfIntroSection from './section/SelfIntro.vue'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <div class="simple-resume">
    <HeaderSection :resume="resume" />

    <div class="simple-resume__body">
      <EducationSection v-if="resume.modules.education.enabled" :resume="resume" />
      <SkillsSection v-if="resume.modules.skills.enabled" :resume="resume" />
      <WorkExpSection v-if="resume.modules.workExp.enabled" :resume="resume" />
      <ProjectExpSection v-if="resume.modules.projectExp.enabled" :resume="resume" />
      <SelfIntroSection v-if="resume.modules.selfIntro.enabled" :resume="resume" />

      <BaseInfoSection v-if="resume.personInfo.enabled" :resume="resume" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.simple-resume {
  padding: 18px 22px;
  box-sizing: border-box;
  background: #fff;
  color: #111827;
}

.simple-resume__body {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
</style>
