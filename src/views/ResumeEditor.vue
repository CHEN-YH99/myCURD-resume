<script setup lang="ts">
import { computed } from 'vue'
import Draggable from 'vuedraggable'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import EditorHeaderBar from '@/components/editor/editorHeaderBar/index.vue'
import SectionCard from '@/components/editor/sectionCard/index.vue'
import ResumeRenderer from '@/components/preview/resumeRenderer/index.vue'
import {
  Document,
  Postcard,
  User,
  Menu,
  Plus,
  Briefcase,
  Aim,
  Location,
  Money,
  EditPen,
  Delete,
  Rank,
} from '@element-plus/icons-vue'
import { useResumeStore } from '@/stores/resume'

const router = useRouter()
const store = useResumeStore()

const mode = store.mode
const resume = computed(() => store.resume.value)

const totalModules = 6

type AddableModuleKey = 'workYears' | 'position' | 'city' | 'salary' | 'custom'

type AddableModule = { key: AddableModuleKey; label: string; icon: Component }

type JobIntentionItem = {
  key: AddableModuleKey
  label: string
}

const jobIntentionItems = computed<JobIntentionItem[]>(() => {
  const labelMap: Record<AddableModuleKey, string> = {
    workYears: '工作经验',
    position: '求职意向',
    city: '期望城市',
    salary: '期望薪资',
    custom: '自定义',
  }

  return resume.value.jobIntention.order
    .filter((k: AddableModuleKey) => resume.value.jobIntention.fields[k])
    .map((k: AddableModuleKey) => ({ key: k, label: labelMap[k] }))
})

const addableModules: AddableModule[] = [
  { key: 'workYears', label: '工作经验', icon: Briefcase },
  { key: 'position', label: '求职意向', icon: Aim },
  { key: 'city', label: '目标城市', icon: Location },
  { key: 'salary', label: '期望薪资', icon: Money },
  { key: 'custom', label: '自定义', icon: EditPen },
]

const jobIntentionFields = computed(() => resume.value.jobIntention.fields)

const jobIntentionOrder = computed({
  get: () => resume.value.jobIntention.order,
  set: (v: AddableModuleKey[]) => {
    resume.value.jobIntention.order = v
  },
})

const isModuleAdded = (key: AddableModuleKey) => {
  return !!jobIntentionFields.value?.[key]
}

const canAddModule = (key: AddableModuleKey) => {
  if (isModuleAdded(key)) return false
  if (addedModulesCount.value >= totalModules) return false
  return true
}

const enableModule = (key: AddableModuleKey) => {
  if (!canAddModule(key)) return
  resume.value.jobIntention.fields[key] = true

  if (!resume.value.jobIntention.order.includes(key)) {
    resume.value.jobIntention.order.push(key)
  }

  if (key === 'custom') {
    ;(resume.value.jobIntention as any).custom = {
      title: '自定义',
      value: ''
    }
  }
}

const removeModule = (key: AddableModuleKey) => {
  if (key === 'position') return // 不允许删除求职意向
  resume.value.jobIntention.fields[key] = false

  // 可选：移出排序列表，避免拖拽列表中出现不可见项
  resume.value.jobIntention.order = resume.value.jobIntention.order.filter((k: AddableModuleKey) => k !== key)
}

const addedModulesCount = computed(() => {
  const enabledJobIntentionFields = (Object.keys(resume.value.jobIntention.fields) as Array<keyof typeof resume.value.jobIntention.fields>)
    .map((k) => resume.value.jobIntention.fields[k])
    .filter(Boolean).length

  return enabledJobIntentionFields
})

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
      <div class="editor-layout" :class="{ 'single-mode': mode !== 'both' }">
        <section class="editor-left" :class="{ hidden: mode === 'preview' }">
          <div class="section-list">
            <SectionCard :icon="Document" title="简历标题" subtitle="简历模板" :collapsible="false" :hide-delete="true">
              <template #tools>
                <el-radio-group v-model="resume.title.align" size="small">
                  <el-radio-button label="left">左</el-radio-button>
                  <el-radio-button label="center">中</el-radio-button>
                  <el-radio-button label="right">右</el-radio-button>
                </el-radio-group>
              </template>
              <el-input v-model="resume.title.title" placeholder="请输入简历标题">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                </template>
              </el-input>
            </SectionCard>

            <SectionCard
              :icon="Postcard"
              v-model="resume.jobIntention.enabled"
              title="求职意向"
              show-toggle
              toggle-text="启用"
              :hide-delete="true"
            >
              <template #tools>
                <el-popover
                  placement="bottom-end"
                  :width="220"
                  trigger="click"
                  popper-class="add-module-popper"
                >
                  <template #reference>
                    <div class="job-intention-tools">
                      <el-button type="primary" size="small" :icon="Plus">
                        添加 ({{ addedModulesCount }}/{{ totalModules }})
                      </el-button>
                    </div>
                  </template>

                  <div class="add-module-panel">
                    <div
                      v-for="m in addableModules"
                      :key="m.key"
                      class="add-module-item"
                      :class="{
                        'is-added': isModuleAdded(m.key),
                        'is-disabled': !canAddModule(m.key) && !isModuleAdded(m.key),
                      }"
                      @click="enableModule(m.key)"
                    >
                      <div class="add-module-item__left">
                        <el-icon class="add-module-item__icon"><component :is="m.icon" /></el-icon>
                        <span class="add-module-item__label">{{ m.label }}</span>
                      </div>
                      <span v-if="isModuleAdded(m.key)" class="add-module-item__status">已添加</span>
                    </div>
                  </div>
                </el-popover>
              </template>
              <el-form label-width="80px">
                <Draggable
                  :list="jobIntentionItems"
                  item-key="key"
                  handle=".drag-handle"
                  :animation="150"
                  @update:list="(v: JobIntentionItem[]) => (jobIntentionOrder = v.map((i: JobIntentionItem) => i.key))"
                  @end="(evt: any) => {
                    const moved = evt?.item?.__draggable_context?.element?.key
                    if (!moved) return
                    const enabled = jobIntentionItems.map((x) => x.key)
                    const disabled = jobIntentionOrder.filter((k: AddableModuleKey) => enabled.indexOf(k) === -1)
                    jobIntentionOrder = [...enabled, ...disabled]
                  }"
                >
                  <template #item="{ element }">
                    <el-form-item :label="element.label" class="job-intention-sort-item">
                      <template v-if="element.key === 'workYears'">
                        <el-input-number v-model="resume.jobIntention.workYears" :min="0" :max="50">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action" @click="removeModule('workYears')"><Delete /></el-icon>
                          </template>
                        </el-input-number>
                      </template>

                      <template v-else-if="element.key === 'position'">
                        <el-input v-model="resume.jobIntention.position" placeholder="例如：Java高级开发工程师">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </template>

                      <template v-else-if="element.key === 'city'">
                        <el-input v-model="resume.jobIntention.city" placeholder="例如：北京">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action" @click="removeModule('city')"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </template>

                      <template v-else-if="element.key === 'salary'">
                        <el-input v-model="(resume.jobIntention as any).salary" placeholder="例如：20-30K">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action" @click="removeModule('salary')"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </template>

                      <template v-else-if="element.key === 'custom'">
                        <div class="custom-pair">
                          <el-input v-model="(resume.jobIntention as any).custom.title" placeholder="请输入标题">
                            <template #suffix>
                              <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                              <el-icon class="suffix-action" @click="removeModule('custom')"><Delete /></el-icon>
                            </template>
                          </el-input>
                          <el-input v-model="(resume.jobIntention as any).custom.value" placeholder="请输入内容" />
                        </div>
                      </template>
                    </el-form-item>
                  </template>
                </Draggable>
              </el-form>
            </SectionCard>

            <SectionCard
              :icon="User"
              v-model="resume.personInfo.enabled"
              title="个人信息"
              show-toggle
              toggle-text="显示"
              addable
              add-text="添加信息"
              :hide-delete="true"
              @add="void 0"
            >
              <el-form label-width="80px">
                <el-form-item label="头像">
                  <el-input v-model="resume.personInfo.avatarUrl" placeholder="头像地址占位">
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="姓名">
                  <el-input v-model="resume.personInfo.name" placeholder="请输入姓名">
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="resume.personInfo.gender" placeholder="请选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                    <el-option label="未知" value="未知" />
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                  <el-input-number v-model="resume.personInfo.age" :min="0" :max="99">
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="电话">
                  <el-input v-model="resume.personInfo.phone">
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="resume.personInfo.email">
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="微信">
                  <el-input v-model="resume.personInfo.wechat">
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="Github">
                  <el-input v-model="resume.personInfo.github">
                    <template #suffix>
                      <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                      <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </SectionCard>

            <SectionCard :icon="Menu" title="简历模块" addable add-text="添加模块" :hide-delete="true" show-toggle @add="void 0">
              <div class="module-list">
                <div class="module-item">
                  <span>教育背景</span>
                </div>
                <div class="module-item">
                  <span>专业技能</span>
                </div>
                <div class="module-item">
                  <span>工作经历</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </section>

        <aside class="editor-right" :class="{ hidden: mode === 'edit' }">
          <div class="preview-paper">
            <ResumeRenderer :resume="resume" />
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.suffix-action {
  margin-left: 4px;
  color: var(--el-text-color-placeholder);
  cursor: pointer;
  transition: color 0.2s;

  &:hover:not(.is-disabled) {
    color: var(--el-color-primary);
  }

  &.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.drag-handle {
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
}

.job-intention-tools {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.job-intention-sort-item {
  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .custom-pair {
    flex: 1;
    display: flex;
    gap: 8px;

    :deep(.el-input) {
      flex: 1;
    }
  }
}

:deep(.el-input__wrapper) {
  padding-right: 6px;
}

:deep(.el-input-number) {
  .el-input__wrapper {
    padding-right: 0;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    border: none;
  }
}

.resume-editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-body {
  flex: 1;
  min-height: 0;
  background: #f5f7fa;
  overflow: hidden;
}

.editor-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 12px;
  box-sizing: border-box;
  display: flex;
  gap: 12px;
  height: 100%;
}

.editor-left {
  width: 50%;
  min-width: 0;
  overflow-y: auto;
  padding-right: 8px; // 为滚动条留出空间，防止内容跳动
}

.editor-right {
  width: 50%;
  min-width: 0;
  overflow: auto;
}

.editor-layout.single-mode {
  justify-content: center;

  .editor-left,
  .editor-right {
    width: 100%;
    max-width: 1200px;
  }
}

.hidden {
  display: none;
}

.section-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.module-item {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: #fff;
}


.preview-paper {
  position: sticky;
  top: 12px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);
}

.preview-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.preview-sub {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.preview-json {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
}

@media (max-width: 980px) {
  .editor-layout {
    max-width: 760px;
    flex-direction: column;
  }

  .editor-right {
    width: 100%;
    flex: 0 0 auto;
  }

  .preview-paper {
    position: static;
  }
}

.add-module-panel {
  display: flex;
  flex-direction: column;
  padding: 6px 0;
}

.add-module-item {
  height: 34px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f2f6fc;
  }

  &.is-added {
    cursor: default;
  }

  &.is-disabled {
    opacity: 0.45;
    cursor: not-allowed;

    &:hover {
      background: transparent;
    }
  }
}

.add-module-item__left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.add-module-item__icon {
  font-size: 16px;
  color: var(--el-text-color-secondary);
}

.add-module-item__label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.add-module-item__status {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

:deep(.add-module-popper) {
  padding: 6px 6px;
}

</style>
