<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import avatar from '@/assets/personal.svg'
import githubIcon from '@/assets/icons8-github-logo.gif'
import { useResumeStore } from '@/stores/resume'

const store = useResumeStore()
const count = computed(() => store.resumeSummaries.value.length)

const githubStars = ref<number | null>(null)
const githubRepo = 'CHEN-YH99/myCURD-resume'
const githubUrl = `https://github.com/${githubRepo}`

let intervalId: number | null = null

// 获取 GitHub 星标数
const fetchGithubStars = async () => {
  try {
    // 使用 GitHub Shields API，它会自动处理认证和缓存
    const response = await fetch(`https://img.shields.io/github/stars/${githubRepo}?style=social`)
    if (response.ok) {
      const svgText = await response.text()
      // 从 SVG 中提取星标数
      const match = svgText.match(/>([\d,]+)<\/text>/)
      if (match && match[1]) {
        githubStars.value = parseInt(match[1].replace(/,/g, ''))
      }
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error)
    // 如果失败，尝试备用方案
    try {
      const response = await fetch(`https://api.github.com/repos/${githubRepo}`)
      if (response.ok) {
        const data = await response.json()
        githubStars.value = data.stargazers_count
      }
    } catch (e) {
      console.error('Backup fetch also failed:', e)
    }
  }
}

onMounted(() => {
  fetchGithubStars()
  // 每30秒自动刷新一次星标数
  intervalId = window.setInterval(fetchGithubStars, 30000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div>
    <div class="header-container">
      <img :src="avatar" class="icon" />
      <span class="title"> 我的简历 </span>
      <el-tag effect="dark" round>{{ count }}</el-tag>
      
      <a :href="githubUrl" target="_blank" class="github-link">
        <div class="github-badge">
          <img :src="githubIcon" class="github-icon" alt="GitHub" />
          <span class="github-stars" v-if="githubStars !== null">
            ⭐ {{ githubStars.toLocaleString() }}
          </span>
          <span class="github-stars" v-else>⭐ --</span>
        </div>
      </a>
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
    color: var(--el-color-primary);
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
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    color: #fff;
  }

  .github-link {
    margin-left: 16px;
    margin-right: 20px;
    text-decoration: none;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .github-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 16px;
    border: 1px solid #e1e4e8;
    transition: all 0.3s ease;

    &:hover {
      border-color: #0969da;
      box-shadow: 0 2px 8px rgba(9, 105, 218, 0.15);
    }

    .github-icon {
      width: 24px;
      height: 24px;
      display: block;
    }

    .github-stars {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      white-space: nowrap;
    }
  }
}

// 对 el-divider 进行样式穿透，调整其外边距
:deep(.custom-divider) {
  margin: 16px 0 0 0; // 设置上外边距为16px，与其他外边距归零
}
</style>
