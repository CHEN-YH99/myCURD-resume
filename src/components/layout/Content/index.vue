<script setup lang="ts">
import { Plus, Upload, View } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import resumeIcon from '@/assets/resume.svg'

const router = useRouter()

const createResume = () => {
  router.push('/editor')
}

const primaryHoverColor = computed(() => '#0a91d9')
</script>

<template>
  <div class="empty-state-container">
    <div class="content-wrapper">
      <div class="icon-background">
        <img :src="resumeIcon" alt="resume icon" width="48" height="48" />
      </div>

      <h2>暂无简历</h2>
      <p>点击“创建简历”开始，或从 JSON 文件导入</p>

      <div class="button-group">
        <el-button type="primary" :icon="Plus" size="large" @click="createResume"
          >创建简历</el-button
        >
        <el-button :icon="Upload" size="large" plain>导入</el-button>
        <el-button :icon="View" size="large" plain>示例</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$theme-color: #0685ca;
$theme-color-light: rgba(6, 133, 202, 0.08);
$gradient-start: #f8faff;
$gradient-end: #f2f6fc;

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}

.empty-state-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, $gradient-start 0%, $gradient-end 100%);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 64px;
  background-color: #fff;
  border-radius: 16px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 680px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 16px 32px -4px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
  }
}

.icon-background {
  width: 88px;
  height: 88px;
  background-color: $theme-color-light;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
  animation: float 4s ease-in-out infinite;
}

h2 {
  font-size: 26px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}

p {
  font-size: 17px;
  color: #8a99ab;
  margin-bottom: 40px;
  max-width: 320px;
}

.button-group {
  display: flex;
  gap: 16px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-button--large) {
  padding: 20px 24px;
}

:deep(.el-button--primary) {
  background-color: $theme-color;
  border-color: $theme-color;

  &:hover {
    background-color: v-bind(primaryHoverColor);
    border-color: v-bind(primaryHoverColor);
  }
}

:deep(.el-button.is-plain) {
  --el-button-hover-text-color: #{$theme-color};
  --el-button-hover-border-color: #{rgba($theme-color, 0.5)};
  --el-button-hover-bg-color: #{rgba($theme-color, 0.05)};
}
</style>
