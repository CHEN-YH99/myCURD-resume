<script setup lang="ts">
import type { ResumeData } from '@/types/resume'

defineProps<{
  resume: ResumeData
}>()
</script>

<template>
  <div class="r-section" />
</template>

<style lang="scss" scoped>
.r-section {
  display: none;
}
</style>
