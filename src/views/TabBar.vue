<template>
  <div class="tab-bar-container">
    <div class="left-section">
      <h1 class="title">
        <el-icon :size="24"><Edit /></el-icon>
        <span>简历编辑器</span>
      </h1>
      <el-tag type="success" effect="dark" round>简历模板</el-tag>
    </div>
    <div class="right-section">
      <el-button :icon="ArrowLeft">返回</el-button>
      <el-button-group>
        <el-button :icon="Menu">编辑+预览</el-button>
        <el-button :icon="EditPen">仅编辑</el-button>
        <el-button :icon="View">仅预览</el-button>
      </el-button-group>
      <el-button type="primary" :icon="Finished">保存</el-button>
      <el-button type="primary" :icon="Download">导出</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Download, Edit, EditPen, Finished, Menu, View } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.tab-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #f7f8fa;
  height: 60px;
  box-sizing: border-box;

  .left-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .el-tag {
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button-group {
      margin: 0 8px;
    }

    .el-button--primary {
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);

      &:hover {
        background-color: var(--el-color-primary-light-3);
        border-color: var(--el-color-primary-light-3);
      }
    }
  }
}
</style>
