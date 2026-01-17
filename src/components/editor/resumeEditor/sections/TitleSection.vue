<script setup lang="ts">
import { Document, Rank, Delete } from '@element-plus/icons-vue'
import SectionCard from '@/components/editor/sectionCard/index.vue'

defineProps<{ resume: any }>()
</script>

<template>
  <SectionCard :icon="Document" title="简历标题" subtitle="简历模板" :collapsible="false" :hide-delete="true">
    <template #tools>
      <el-radio-group v-model="resume.title.align" size="small">
        <el-radio-button label="left">左</el-radio-button>
        <el-radio-button label="center">中</el-radio-button>
        <el-radio-button label="right">右</el-radio-button>
      </el-radio-group>
    </template>
    <el-input v-model="resume.title.title" placeholder="请输入简历标题">
      <template #suffix>
        <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
        <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
      </template>
    </el-input>
  </SectionCard>
</template>
