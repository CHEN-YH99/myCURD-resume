<script setup lang="ts">
import SimpleTemplate from '@/components/preview/templates/simple/index.vue'
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <div class="resume-renderer">
    <SimpleTemplate :resume="resume" />
  </div>
</template>

<style lang="scss" scoped>
.resume-renderer {
  width: 100%;
}
</style>
