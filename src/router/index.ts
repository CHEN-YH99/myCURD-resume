/**
 * 路由配置模块
 * @description 定义应用的路由规则和导航配置
 * @author Resume Editor Team
 * @date 2024-01-31
 */

import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import ResumeEditor from '@/views/ResumeEditor.vue'

/**
 * 创建路由实例
 * @description 使用 HTML5 History 模式，配置应用的路由规则
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/editor',
      name: 'ResumeEditor',
      component: ResumeEditor
    }
  ]
})

export default router
