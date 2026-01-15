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
  ArrowDown,
  View,
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
    custom: ((resume.value.jobIntention as any).custom?.title as string) || '' ,
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
      title: '',
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
                    <el-form-item
                      :label="element.label"
                      class="job-intention-sort-item"
                      :class="{ 'is-custom': element.key === 'custom' }"
                    >
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
                        <el-input
                          class="job-intention-custom-value-input"
                          v-model="(resume.jobIntention as any).custom.value"
                          placeholder="请输入内容"
                        >
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action" @click="removeModule('custom')"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </template>

                      <template #label v-if="element.key === 'custom'">
                        <el-input
                          class="job-intention-custom-label-input"
                          v-model="(resume.jobIntention as any).custom.title"
                          placeholder="输入标题"
                        />
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
              <template #tools>
                <el-button-group class="person-info-tools">
                  <el-tooltip content="头像形状" placement="bottom">
                    <el-button size="small" plain @click="resume.personInfo.preview.avatarShape = resume.personInfo.preview.avatarShape === 'circle' ? 'square' : 'circle'">
                      {{ resume.personInfo.preview.avatarShape === 'circle' ? '圆形' : '方形' }}
                    </el-button>
                  </el-tooltip>

                  <el-dropdown trigger="click" @command="(c: number) => (resume.personInfo.preview.columns = c)">
                    <el-button size="small">
                      {{ resume.personInfo.preview.columns }}列 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item :command="1">1列</el-dropdown-item>
                        <el-dropdown-item :command="2">2列</el-dropdown-item>
                        <el-dropdown-item :command="3">3列</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>

                  <el-tooltip content="预览标签显示" placement="bottom">
                    <el-button size="small" @click="resume.personInfo.preview.showLabels = !resume.personInfo.preview.showLabels">
                      <el-icon><View /></el-icon>
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </template>
              <el-form label-width="80px">
                <el-form-item label="头像" class="person-avatar-form-item">
                  <div class="person-avatar-form-item__content">
                    <div class="person-avatar-placeholder" aria-hidden="true"></div>

                    <el-input v-model="resume.personInfo.avatarUrl" placeholder="头像地址占位">
                      <template #suffix>
                        <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                        <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                      </template>
                    </el-input>
                  </div>
                </el-form-item>

                <Draggable
                  :list="resume.personInfo.order"
                  :item-key="(k: string) => k"
                  handle=".drag-handle"
                  :animation="150"
                  class="person-info-draggable"
                  @update:list="(v: string[]) => (resume.personInfo.order = v)"
                >
                  <template #item="{ element: key }">
                    <template v-if="key === 'name'">
                      <el-form-item label="姓名">
                        <el-input v-model="resume.personInfo.name" placeholder="请输入姓名">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>
                    </template>

                    <template v-else-if="key === 'gender'">
                      <el-form-item label="性别" class="person-info-grid-item">
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
                    </template>

                    <template v-else-if="key === 'age'">
                      <el-form-item label="年龄" class="person-info-grid-item">
                        <el-input-number v-model="resume.personInfo.age" :min="0" :max="99">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                          </template>
                        </el-input-number>
                      </el-form-item>
                    </template>

                    <template v-else-if="key === 'phone'">
                      <el-form-item label="电话" class="person-info-grid-item">
                        <el-input v-model="resume.personInfo.phone">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>
                    </template>

                    <template v-else-if="key === 'email'">
                      <el-form-item label="邮箱" class="person-info-grid-item">
                        <el-input v-model="resume.personInfo.email">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>
                    </template>

                    <template v-else-if="key === 'wechat'">
                      <el-form-item label="微信" class="person-info-grid-item">
                        <el-input v-model="resume.personInfo.wechat">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>
                    </template>

                    <template v-else-if="key === 'github'">
                      <el-form-item label="Github" class="person-info-grid-item">
                        <el-input v-model="resume.personInfo.github">
                          <template #suffix>
                            <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                            <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
                          </template>
                        </el-input>
                      </el-form-item>
                    </template>

                    <template v-else>
                      <div style="display:none"></div>
                    </template>
                  </template>
                </Draggable>
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
            <ResumeRenderer
              :resume="resume"
              :style="{
                '--r-avatar-radius': resume.personInfo.preview.avatarShape === 'circle' ? '50%' : '10px'
              }"
            />
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

.person-info-tools {
  display: inline-flex;
}

.person-info-tools :deep(.el-button) {
  padding: 4px 8px;
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

.person-info-tools :deep(.el-button:hover) {
  background-color: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
  color: #fff;
}

.person-info-tools :deep(.el-button:active) {
  background-color: var(--el-color-primary-dark-2);
  border-color: var(--el-color-primary-dark-2);
  color: #fff;
}

.person-info-tools :deep(.el-button:focus) {
  color: #fff;
}


.job-intention-sort-item {
  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.job-intention-custom-label-input {
  width: 56px;
}

.job-intention-custom-label-input {
  :deep(.el-input__wrapper) {
    height: 32px;
    line-height: 32px;
    display: inline-flex;
    align-items: center;

    box-shadow: none !important;
    background-color: transparent;
    padding: 0;

    &:hover {
      box-shadow: 0 0 0 1px var(--el-input-hover-border-color, var(--el-border-color)) inset !important;
    }
  }

  :deep(.el-input__inner) {
    padding: 0;
    height: 32px;
    line-height: 32px;
  }

  :deep(.el-input.is-focus .el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
  }
}

.job-intention-custom-value-input {
  flex: 1;
  min-width: 0;
}

.job-intention-custom-value-input {
  :deep(.el-input) {
    width: 100%;
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

.person-avatar-form-item {
  :deep(.el-form-item__content) {
    position: relative;
  }
}

.person-avatar-form-item__content {
  position: relative;
  width: 100%;
}

.person-avatar-form-item__content {
  :deep(.el-input) {
    width: 100%;
  }
}

.person-avatar-placeholder {
  position: absolute;
  left: -64px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 6px;

  width: 52px;
  height: 52px;
  border-radius: 10px;
  border: 1px dashed var(--el-border-color);
  background: var(--el-fill-color-lighter);
}

</style>
