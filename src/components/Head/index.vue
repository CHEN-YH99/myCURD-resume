<script setup lang="ts">
import { ref } from 'vue'
import avatar from '@/assets/personal.svg'
const count = ref<number>(0)

</script>

<template>
  <div>
    <div class="header-container">
      <img :src="avatar" class="icon" />
      <span class="title"> 我的简历 </span>
      <el-tag type="success" effect="dark" round>{{ count }}</el-tag>
    </div>
    <el-divider class="custom-divider" />
  </div>
</template>

<style scoped lang="scss">
.header-container {
  display: flex;
  align-items: center;
  padding-top: 16px; // 只保留上边距
  margin-left: 20px;

  .icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    color: #00A854;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-right: 8px;
  }

  .el-tag {
    border-radius: 4px;
    height: 22px;
    line-height: 22px;
    padding: 0 8px;
  }
}

// 对 el-divider 进行样式穿透，调整其外边距
:deep(.custom-divider) {
  margin: 16px 0 0 0; // 设置上外边距为16px，与其他外边距归零
}
</style>
