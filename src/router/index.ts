import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import ResumeEditor from '@/views/ResumeEditor.vue'

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
