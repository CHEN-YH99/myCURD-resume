<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeData, ResumeModuleType } from '@/types/resume'
import HeaderSection from './section/Header.vue'
import BaseInfoSection from './section/BaseInfo.vue'
import EducationSection from './section/Education.vue'
import SkillsSection from './section/Skills.vue'
import WorkExpSection from './section/WorkExp.vue'
import ProjectExpSection from './section/ProjectExp.vue'
import SelfIntroSection from './section/SelfIntro.vue'

const props = defineProps<{
  resume: ResumeData
}>()

const orderedModules = computed<ResumeModuleType[]>(() => {
  const base = props.resume.modulesOrder || []
  const enabled = base.filter((k) => props.resume.modules[k]?.enabled)
  const missing = (['education', 'skills', 'workExp', 'projectExp', 'selfIntro'] as ResumeModuleType[]).filter(
    (k) => enabled.indexOf(k) === -1 && props.resume.modules[k]?.enabled,
  )
  return [...enabled, ...missing]
})
</script>

<template>
  <div class="simple-resume">
    <HeaderSection :resume="resume" />

    <div class="simple-resume__body">
      <template v-for="k in orderedModules" :key="k">
        <EducationSection v-if="k === 'education'" :resume="resume" />
        <SkillsSection v-else-if="k === 'skills'" :resume="resume" />
        <WorkExpSection v-else-if="k === 'workExp'" :resume="resume" />
        <ProjectExpSection v-else-if="k === 'projectExp'" :resume="resume" />
        <SelfIntroSection v-else-if="k === 'selfIntro'" :resume="resume" />
      </template>

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
