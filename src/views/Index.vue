<script setup lang="ts">
import { computed } from 'vue'
import { Plus, View } from '@element-plus/icons-vue'
import Head from '@/components/layout/head/index.vue'
import Content from '@/components/layout/content/index.vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import ImportJsonButton from '@/components/common/importJsonButton/index.vue'

const router = useRouter()
const store = useResumeStore()

const hasSaved = computed(() => store.hasSaved.value)

const createResume = () => {
  store.createNew()
  router.push('/editor')
}

const beforeImport = async (file: File) => {
  await store.importResumeFromJsonFile(file)
  router.push('/editor')
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <Head />

      <div v-if="hasSaved" class="page-actions">
        <el-button type="primary" :icon="Plus" @click="createResume">创建简历</el-button>

        <ImportJsonButton :before-import="beforeImport" />

        <el-button :icon="View" plain>示例</el-button>
      </div>
    </div>

    <Content />
  </div>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
}

.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
}

.page-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
</style>
