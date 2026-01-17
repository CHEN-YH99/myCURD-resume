<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import EditorHeaderBar from '@/components/editor/editorHeaderBar/index.vue'
import ResumeRenderer from '@/components/preview/resumeRenderer/index.vue'
import { useResumeStore } from '@/stores/resume'
import defaultAvatar from '@/assets/defaultavatar.svg'

import { useEditableLabelCursor } from '@/components/editor/resumeEditor/composables/useEditableLabelCursor'
import { useDraftAutoSave } from '@/components/editor/resumeEditor/composables/useDraftAutoSave'
import { useExportResume } from '@/components/editor/resumeEditor/composables/useExportResume'
import { useAvatarUpload } from '@/components/editor/resumeEditor/composables/useAvatarUpload'

import TitleSection from '@/components/editor/resumeEditor/sections/TitleSection.vue'
import JobIntentionSection from '@/components/editor/resumeEditor/sections/JobIntentionSection.vue'
import PersonInfoSection from '@/components/editor/resumeEditor/sections/PersonInfoSection.vue'
import ResumeModulesSection from '@/components/editor/resumeEditor/sections/ResumeModulesSection.vue'

const router = useRouter()
const store = useResumeStore()

const mode = store.mode
const resume = computed(() => store.resume.value)

const totalModules = 5

const { setCustomLabelRef, keepCursorAtEndByKey } = useEditableLabelCursor()

import { useEditorNavStore } from '@/stores/editorNav'

const editorNavStore = useEditorNavStore()

const { draftDirty, onDraft } = useDraftAutoSave({
  resume,
  hasDraft: store.hasDraft,
  saveDraft: store.saveDraft,
  loadDraft: store.loadDraft,
  clearDraft: store.clearDraft,
  shouldPromptRecover: () => !editorNavStore.consumeSuppressDraftRecoverPromptOnce()
})

const { doExport } = useExportResume(resume)

const { avatarUploading, beforeAvatarUpload, onAvatarChange, clearAvatar } = useAvatarUpload({
  personInfo: computed(() => resume.value.personInfo),
  defaultAvatar,
})

const onBack = () => {
  router.push('/')
}

const onSave = () => {
  const saved = store.saveCurrent()
  store.clearDraft()
  ElMessage.success(`保存成功`)
  void draftDirty
}
</script>

<template>
  <div class="resume-editor-page">
    <EditorHeaderBar v-model="mode" @back="onBack" @save="onSave" @draft="onDraft" @export="doExport" />

    <main class="page-body">
      <div class="editor-layout" :class="{ 'single-mode': mode !== 'both' }">
        <section class="editor-left" :class="{ hidden: mode === 'preview' }">
          <div class="section-list">
            <TitleSection :resume="resume" />

            <JobIntentionSection
              :resume="resume"
              :total-modules="totalModules"
              :set-custom-label-ref="setCustomLabelRef"
              :keep-cursor-at-end-by-key="keepCursorAtEndByKey"
            />

            <PersonInfoSection
              :resume="resume"
              :avatar-uploading="avatarUploading"
              :before-avatar-upload="beforeAvatarUpload"
              :on-avatar-change="onAvatarChange"
              :clear-avatar="clearAvatar"
              :set-custom-label-ref="setCustomLabelRef"
              :keep-cursor-at-end-by-key="keepCursorAtEndByKey"
            />

            <ResumeModulesSection :resume="resume" />
          </div>
        </section>

        <aside class="editor-right" :class="{ hidden: mode === 'edit' }">
          <div class="preview-paper">
            <ResumeRenderer
              :resume="resume"
              :style="{
                '--r-avatar-radius': resume.personInfo.preview.avatarShape === 'circle' ? '50%' : '10px',
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
    text-align: right;
    direction: rtl;
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


.preview-paper {
  position: sticky;
  top: 12px;
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);
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

.person-avatar-preview {
  position: absolute;
  left: -64px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 6px;

  width: 52px;
  height: 52px;
  border-radius: var(--r-avatar-radius, 10px);
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  background: #fff;
}

.person-avatar-preview__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
