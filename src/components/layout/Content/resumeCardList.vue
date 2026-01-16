<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, EditPen } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'

const router = useRouter()
const store = useResumeStore()

const items = computed(() => store.resumeSummaries.value)

const formatTime = (t: number) => {
  try {
    return new Date(t).toLocaleString()
  } catch {
    return ''
  }
}

const onEdit = (id: string) => {
  store.loadById(id)
  router.push('/editor')
}

const onDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确认删除该简历？此操作不可恢复。', '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消',
    })
  } catch {
    return
  }

  const ok = store.removeById(id)
  if (ok) ElMessage.success('已删除')
}
</script>

<template>
  <div class="card-list">
    <el-row :gutter="16">
      <el-col v-for="it in items" :key="it.id" :xs="24" :sm="12" :md="12" :lg="6">
        <el-card class="resume-card" shadow="hover" body-style="padding: 16px">
          <div class="card-body">
            <div class="card-top">
              <div class="card-title" :title="it.title">{{ it.title }}</div>
              <el-tag class="card-tag" effect="light" round>简历</el-tag>
            </div>
            <div class="card-sub">更新于：{{ formatTime(it.updatedAt) }}</div>
          </div>
          <template #footer>
            <div class="card-actions">
              <el-button size="small" :icon="EditPen" type="primary" @click="onEdit(it.id)">编辑</el-button>
              <el-button size="small" :icon="Delete" type="danger" plain @click="onDelete(it.id)">删除</el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.card-list {
  width: 100%;
}

.resume-card {
  margin-bottom: 16px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-sub {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
