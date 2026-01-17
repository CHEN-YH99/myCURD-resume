<script setup lang="ts">
import { computed, type Component } from 'vue'
import Draggable from 'vuedraggable'
import SectionCard from '@/components/editor/sectionCard/index.vue'
import { Postcard, Plus, Briefcase, Aim, Location, Money, EditPen, Delete, Rank } from '@element-plus/icons-vue'

type AddableModuleKey = 'workYears' | 'position' | 'city' | 'salary' | 'custom'

type AddableModule = { key: AddableModuleKey; label: string; icon: Component }

type JobIntentionItem = {
  key: AddableModuleKey
  label: string
}

const props = defineProps<{
  resume: any
  totalModules: number
  setCustomLabelRef: (key: string) => (el: any) => void
  keepCursorAtEndByKey: (key: string) => void
}>()

const addableModules: AddableModule[] = [
  { key: 'workYears', label: '工作经验', icon: Briefcase },
  { key: 'position', label: '求职意向', icon: Aim },
  { key: 'city', label: '目标城市', icon: Location },
  { key: 'salary', label: '期望薪资', icon: Money },
  { key: 'custom', label: '自定义', icon: EditPen },
]

const jobIntentionItems = computed<JobIntentionItem[]>(() => {
  const labelMap: Record<AddableModuleKey, string> = {
    workYears: '工作经验',
    position: '求职意向',
    city: '期望城市',
    salary: '期望薪资',
    custom: (props.resume.jobIntention as any).custom?.title || '',
  }

  return props.resume.jobIntention.order
    .filter((k: AddableModuleKey) => props.resume.jobIntention.fields[k])
    .map((k: AddableModuleKey) => ({ key: k, label: labelMap[k] }))
})

const jobIntentionFields = computed(() => props.resume.jobIntention.fields)

const jobIntentionOrder = computed({
  get: () => props.resume.jobIntention.order,
  set: (v: AddableModuleKey[]) => {
    props.resume.jobIntention.order = v
  },
})

const addedModulesCount = computed(() => {
  const enabledJobIntentionFields = (
    Object.keys(props.resume.jobIntention.fields) as Array<keyof typeof props.resume.jobIntention.fields>
  )
    .map((k) => props.resume.jobIntention.fields[k])
    .filter(Boolean).length

  return enabledJobIntentionFields
})

const isModuleAdded = (key: AddableModuleKey) => {
  return !!jobIntentionFields.value?.[key]
}

const canAddModule = (key: AddableModuleKey) => {
  if (isModuleAdded(key)) return false
  if (addedModulesCount.value >= props.totalModules) return false
  return true
}

const enableModule = (key: AddableModuleKey) => {
  if (!canAddModule(key)) return
  props.resume.jobIntention.fields[key] = true

  if (!props.resume.jobIntention.order.includes(key)) {
    props.resume.jobIntention.order.push(key)
  }

  if (key === 'custom') {
    ;(props.resume.jobIntention as any).custom = {
      title: '',
      value: '',
    }
  }
}

const removeModule = (key: AddableModuleKey) => {
  if (key === 'position') return
  props.resume.jobIntention.fields[key] = false
  props.resume.jobIntention.order = props.resume.jobIntention.order.filter((k: AddableModuleKey) => k !== key)
}
</script>

<template>
  <SectionCard
    :icon="Postcard"
    v-model="resume.jobIntention.enabled"
    title="求职意向"
    show-toggle
    toggle-text="启用"
    :hide-delete="true"
  >
    <template #tools>
      <el-popover placement="bottom-end" :width="220" trigger="click" popper-class="add-module-popper">
        <template #reference>
          <div class="job-intention-tools">
            <el-button type="primary" size="small" :icon="Plus"> 添加 ({{ addedModulesCount }}/{{ totalModules }}) </el-button>
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
        @end="
          (evt: any) => {
            const moved = evt?.item?.__draggable_context?.element?.key
            if (!moved) return
            const enabled = jobIntentionItems.map((x) => x.key)
            const disabled = jobIntentionOrder.filter((k: AddableModuleKey) => enabled.indexOf(k) === -1)
            jobIntentionOrder = [...enabled, ...disabled]
          }
        "
      >
        <template #item="{ element }">
          <el-form-item :label="element.label" class="job-intention-sort-item" :class="{ 'is-custom': element.key === 'custom' }">
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
              <el-input class="job-intention-custom-value-input" v-model="(resume.jobIntention as any).custom.value" placeholder="请输入内容">
                <template #suffix>
                  <el-icon class="suffix-action drag-handle"><Rank /></el-icon>
                  <el-icon class="suffix-action" @click="removeModule('custom')"><Delete /></el-icon>
                </template>
              </el-input>
            </template>

            <template #label v-if="element.key === 'custom'">
              <el-input
                :ref="setCustomLabelRef('jobIntention-custom')"
                class="job-intention-custom-label-input"
                v-model="(resume.jobIntention as any).custom.title"
                placeholder="输入标题"
                @focus="keepCursorAtEndByKey('jobIntention-custom')"
                @click="keepCursorAtEndByKey('jobIntention-custom')"
                @input="keepCursorAtEndByKey('jobIntention-custom')"
              />
            </template>
          </el-form-item>
        </template>
      </Draggable>
    </el-form>
  </SectionCard>
</template>
