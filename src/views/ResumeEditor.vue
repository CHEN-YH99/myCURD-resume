<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EditorHeaderBar from '@/components/editor/editorHeaderBar/index.vue'

const router = useRouter()
const mode = ref<'edit' | 'preview' | 'both'>('both')

const onBack = () => {
  router.push('/')
}

const onSave = () => {
  void 0
}

const onExport = () => {
  void 0
}
</script>

<template>
  <div class="resume-editor-page">
    <EditorHeaderBar v-model="mode" @back="onBack" @save="onSave" @export="onExport" />

    <main class="page-body">
      <div class="placeholder">
        <el-empty description="编辑器主体区域（待实现）" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.resume-editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-body {
  flex: 1;
  min-height: 0;
  background: #ffffff;
}

.placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
