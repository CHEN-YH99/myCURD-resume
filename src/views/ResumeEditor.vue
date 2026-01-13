<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EditorHeaderBar from '@/components/editor/editorHeaderBar/index.vue'
import SectionCard from '@/components/editor/sectionCard/index.vue'
import ResumeRenderer from '@/components/preview/resumeRenderer/index.vue'
import { Document, Postcard, User, Menu } from '@element-plus/icons-vue'
import { useResumeStore } from '@/stores/resume'

const router = useRouter()
const store = useResumeStore()

const mode = store.mode
const resume = computed(() => store.resume.value)

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
            <SectionCard :icon="Document" title="简历标题" subtitle="简历模板" :collapsible="false">
              <el-input v-model="resume.title.title" placeholder="请输入简历标题" />
            </SectionCard>

            <SectionCard
              :icon="Postcard"
              v-model="resume.jobIntention.enabled"
              title="求职意向"
              show-toggle
              toggle-text="启用"
            >
              <el-form label-width="80px">
                <el-form-item label="工作经验">
                  <el-input-number v-model="resume.jobIntention.workYears" :min="0" :max="50" />
                </el-form-item>
                <el-form-item label="求职意向">
                  <el-input v-model="resume.jobIntention.position" placeholder="例如：Java高级开发工程师" />
                </el-form-item>
                <el-form-item label="期望城市">
                  <el-input v-model="resume.jobIntention.city" placeholder="例如：北京" />
                </el-form-item>
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
              @add="void 0"
            >
              <el-form label-width="80px">
                <el-form-item label="头像">
                  <el-input v-model="resume.personInfo.avatarUrl" placeholder="头像地址占位" />
                </el-form-item>
                <el-form-item label="姓名">
                  <el-input v-model="resume.personInfo.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="resume.personInfo.gender" placeholder="请选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                    <el-option label="未知" value="未知" />
                  </el-select>
                </el-form-item>
                <el-form-item label="年龄">
                  <el-input-number v-model="resume.personInfo.age" :min="0" :max="99" />
                </el-form-item>
                <el-form-item label="电话">
                  <el-input v-model="resume.personInfo.phone" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="resume.personInfo.email" />
                </el-form-item>
                <el-form-item label="微信">
                  <el-input v-model="resume.personInfo.wechat" />
                </el-form-item>
                <el-form-item label="Github">
                  <el-input v-model="resume.personInfo.github" />
                </el-form-item>
              </el-form>
            </SectionCard>

            <SectionCard :icon="Menu" title="简历模块" addable add-text="添加模块" @add="void 0">
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
</style>
