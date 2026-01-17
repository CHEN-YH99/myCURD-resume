<script setup lang="ts">
import Draggable from 'vuedraggable'
import SectionCard from '@/components/editor/sectionCard/index.vue'
import defaultAvatar from '@/assets/defaultavatar.svg'
import { User, ArrowDown, View, Rank, Delete } from '@element-plus/icons-vue'
import { uid } from '@/utils/format'

const props = defineProps<{
  resume: any
  avatarUploading: boolean
  beforeAvatarUpload: (file: File) => boolean
  onAvatarChange: (uploadFile: any, uploadFiles?: any[]) => void
  clearAvatar: () => void
  setCustomLabelRef: (key: string) => (el: any) => void
  keepCursorAtEndByKey: (key: string) => void
}>()

const addPersonInfoField = () => {
  const key = `custom-${uid()}`
  ;(props.resume.personInfo.fields as any)[key] = { enabled: true, label: '自定义', value: '' }
  if (props.resume.personInfo.order.indexOf(key) === -1) {
    props.resume.personInfo.order.push(key)
  }
}

const removePersonInfoField = (key: string) => {
  if (key === 'name' || key === 'gender' || key === 'age') return

  if (key === 'phone' || key === 'email' || key === 'wechat' || key === 'github') {
    props.resume.personInfo.order = props.resume.personInfo.order.filter((k: string) => k !== key)
    return
  }

  delete (props.resume.personInfo.fields as any)[key]
  props.resume.personInfo.order = props.resume.personInfo.order.filter((k: string) => k !== key)
}
</script>

<template>
  <SectionCard
    :icon="User"
    v-model="resume.personInfo.enabled"
    title="个人信息"
    show-toggle
    toggle-text="启用"
    addable
    add-text="添加信息"
    :hide-delete="true"
    @add="addPersonInfoField"
  >
    <template #tools>
      <el-button-group class="person-info-tools">
        <el-tooltip content="头像形状" placement="bottom">
          <el-button
            size="small"
            plain
            @click="
              resume.personInfo.preview.avatarShape =
                resume.personInfo.preview.avatarShape === 'circle' ? 'square' : 'circle'
            "
          >
            {{ resume.personInfo.preview.avatarShape === 'circle' ? '圆形' : '方形' }}
          </el-button>
        </el-tooltip>

        <el-dropdown trigger="click" @command="(c: number) => (resume.personInfo.preview.columns = c as 1 | 2 | 3)">
          <el-button size="small"> {{ resume.personInfo.preview.columns }}列 <el-icon class="el-icon--right"><ArrowDown /></el-icon> </el-button>
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
      <el-form-item class="person-avatar-form-item" label="头像">
        <div class="person-avatar-form-item__content">
          <div class="person-avatar-left" aria-hidden="true">
            <div v-if="!resume.personInfo.avatarUrl" class="person-avatar-placeholder"></div>
            <div v-else class="person-avatar-preview">
              <img class="person-avatar-preview__img" :src="resume.personInfo.avatarUrl" alt="avatar" />
            </div>
          </div>

          <div class="person-avatar-right">
            <el-upload
              class="avatar-uploader"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-change="onAvatarChange"
              accept="image/*"
            >
              <el-button class="custom-add-btn" size="small" type="primary" plain :loading="avatarUploading">上传头像</el-button>
              <el-button size="small" plain :disabled="resume.personInfo.avatarUrl === defaultAvatar" @click.stop="clearAvatar">清除</el-button>
            </el-upload>

            <el-input class="person-avatar-url" v-model="resume.personInfo.avatarUrl" placeholder="头像URL（可粘贴或上传生成）">
              <template #suffix>
                <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                <el-icon class="suffix-action is-disabled"><Delete /></el-icon>
              </template>
            </el-input>
          </div>
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
                  <el-icon class="suffix-action" @click.stop="removePersonInfoField(key)"><Delete /></el-icon>
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
                  <el-icon class="suffix-action" @click.stop="removePersonInfoField(key)"><Delete /></el-icon>
                </template>
              </el-select>
            </el-form-item>
          </template>

          <template v-else-if="key === 'age'">
            <el-form-item label="年龄" class="person-info-grid-item">
              <el-input-number v-model="resume.personInfo.age" :min="0" :max="99">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action" @click.stop="removePersonInfoField(key)"><Delete /></el-icon>
                </template>
              </el-input-number>
            </el-form-item>
          </template>

          <template v-else-if="key === 'phone'">
            <el-form-item label="电话" class="person-info-grid-item">
              <el-input v-model="resume.personInfo.phone">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action" @click.stop="removePersonInfoField(key)"><Delete /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </template>

          <template v-else-if="key === 'email'">
            <el-form-item label="邮箱" class="person-info-grid-item">
              <el-input v-model="resume.personInfo.email">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action" @click.stop="removePersonInfoField(key)"><Delete /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </template>

          <template v-else-if="key === 'wechat'">
            <el-form-item label="微信" class="person-info-grid-item">
              <el-input v-model="resume.personInfo.wechat">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action" @click.stop="removePersonInfoField(key)"><Delete /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </template>

          <template v-else-if="key === 'github'">
            <el-form-item label="Github" class="person-info-grid-item">
              <el-input v-model="resume.personInfo.github">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action" @click.stop="removePersonInfoField(key)"><Delete /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item class="person-info-grid-item job-intention-sort-item is-custom">
              <template #label>
                <el-input
                  :ref="setCustomLabelRef(key)"
                  class="job-intention-custom-label-input"
                  v-model="(resume.personInfo.fields as any)[key].label"
                  placeholder="输入标题"
                  @focus="keepCursorAtEndByKey(key)"
                  @click="keepCursorAtEndByKey(key)"
                  @input="keepCursorAtEndByKey(key)"
                />
              </template>

              <el-input class="job-intention-custom-value-input" v-model="(resume.personInfo.fields as any)[key].value" placeholder="请输入内容">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action" @click="removePersonInfoField(key)"><Delete /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </template>
        </template>
      </Draggable>
    </el-form>
  </SectionCard>
</template>

<style scoped lang="scss">
.person-avatar-form-item__content {
  display: flex;
  align-items: stretch;
  gap: 10px;
  width: 100%;
}

.person-avatar-left {
  flex: 0 0 auto;
  width: 72px;
  display: flex;
  align-items: center;
}

.person-avatar-placeholder,
.person-avatar-preview {
  width: 72px;
  height: 72px;
  border-radius: var(--r-avatar-radius, 10px);
  overflow: hidden;
  border: 1px dashed var(--el-border-color);
  background: var(--el-fill-color-lighter);
}

.person-avatar-preview {
  border-style: solid;
  background: #fff;
}

.person-avatar-preview__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.person-avatar-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.person-avatar-url {
  width: 100%;
}
</style>
