<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { EditPen } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import { useEditorNavStore } from '@/stores/editorNav'
import { formatTime } from '@/utils/format'
import ExportJsonButton from '@/components/common/exportJsonButton/index.vue'
import ConfirmDeleteButton from '@/components/common/confirmDeleteButton/index.vue'

const router = useRouter()
const store = useResumeStore()
const navStore = useEditorNavStore()

const items = computed(() => store.resumeSummaries.value)


const onEdit = (id: string) => {
  // 从已保存简历列表进入编辑：不弹“恢复草稿”提示，直接加载该简历
  navStore.suppressDraftRecoverPromptOnce.value = true
  store.loadById(id)
  router.push('/editor')
}

const onExport = async (id: string) => {
  return store.exportResumeRecordToJsonFile(id)
}

const onDelete = async (id: string) => {
  const ok = store.removeById(id)
  if (ok) ElMessage.success('已删除')
}
</script>

<template>
  <div class="card-list">
    <el-row :gutter="16" justify="start">
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
              <ExportJsonButton size="small" :export-json="() => onExport(it.id)" />
              <ConfirmDeleteButton size="small" confirm-message="确认删除该简历？此操作不可恢复。" :on-confirm="() => onDelete(it.id)" />
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.card-list {
  width: 80%;
  margin: 24px auto 0;
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
