<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ResumeModuleGridRow } from '@/types/resume'
import Draggable from 'vuedraggable'
import SectionCard from '@/components/editor/sectionCard/index.vue'
import {
  Menu,
  EditPen,
  Delete,
  Rank,
  ArrowDown,
} from '@element-plus/icons-vue'
import { uid } from '@/utils/format'

type ResumeModuleKey = 'education' | 'skills' | 'workExp' | 'projectExp' | 'selfIntro' | `custom-${string}`

type ResumeModule = {
  key: ResumeModuleKey
  title: string
  expanded: boolean
}

const props = defineProps<{
  resume: any
}>()

const expandedModuleKey = ref<ResumeModuleKey | null>('skills')

const resumeModulesEnabled = computed<boolean>({
  get: () => {
    const keys = props.resume.modulesOrder as ResumeModuleKey[]
    return keys.some((k) => {
      const mod = (props.resume.modules as any)[k] || (props.resume.modules.custom as any)?.[k]
      return !!mod?.enabled
    })
  },
  set: (v: boolean) => {
    const keys = props.resume.modulesOrder as ResumeModuleKey[]
    keys.forEach((k) => {
      const mod = (props.resume.modules as any)[k] || (props.resume.modules.custom as any)?.[k]
      if (mod) mod.enabled = v
    })

    if (!v) {
      expandedModuleKey.value = null
    }
  },
})

const resumeModules = computed<ResumeModule[]>({
  get: () =>
    props.resume.modulesOrder
      .filter((k: ResumeModuleKey) => {
        const mod = (props.resume.modules as any)[k] || (props.resume.modules.custom as any)?.[k]
        return !!mod?.enabled
      })
      .map((k: ResumeModuleKey) => {
        const mod = (props.resume.modules as any)[k] || (props.resume.modules.custom as any)?.[k]
        return {
          key: k,
          title: mod?.title || '',
          expanded: expandedModuleKey.value === k,
        }
      }),
  set: (list: ResumeModule[]) => {
    props.resume.modulesOrder = list.map((m) => m.key)
  },
})

const toggleModuleExpanded = (key: ResumeModuleKey) => {
  expandedModuleKey.value = expandedModuleKey.value === key ? null : key
}

const removeResumeModule = (key: ResumeModuleKey) => {
  props.resume.modulesOrder = props.resume.modulesOrder.filter((k: ResumeModuleKey) => k !== key)

  if (String(key).indexOf('custom-') === 0) {
    delete (props.resume.modules.custom as any)[key]
  } else {
    if ((props.resume.modules as any)[key]) {
      ;(props.resume.modules as any)[key].enabled = false
    }
  }

  if (expandedModuleKey.value === key) expandedModuleKey.value = null
}

const moduleIconOptions: { label: string; value: string }[] = [
  { label: '⭐', value: '⭐' }, { label: '✨', value: '✨' }, { label: '🔥', value: '🔥' }, { label: '✅', value: '✅' }, { label: '📌', value: '📌' }, { label: '📍', value: '📍' }, { label: '🔖', value: '🔖' }, { label: '🏷️', value: '🏷️' }, { label: '📎', value: '📎' },
  { label: '🎓', value: '🎓' }, { label: '🏫', value: '🏫' }, { label: '📚', value: '📚' }, { label: '🧑‍🎓', value: '🧑‍🎓' }, { label: '📝', value: '📝' },
  { label: '🛠️', value: '🛠️' }, { label: '⚙️', value: '⚙️' }, { label: '🔧', value: '🔧' }, { label: '🔨', value: '🔨' }, { label: '💡', value: '💡' }, { label: '🧠', value: '🧠' }, { label: '🧩', value: '🧩' },
  { label: '💼', value: '💼' }, { label: '🏢', value: '🏢' }, { label: '📈', value: '📈' }, { label: '📊', value: '📊' }, { label: '🚀', value: '🚀' }, { label: '🧱', value: '🧱' }, { label: '🗂️', value: '🗂️' },
  { label: '👤', value: '👤' }, { label: '📞', value: '📞' }, { label: '✉️', value: '✉️' }, { label: '🌐', value: '🌐' }, { label: '🐙', value: '🐙' }, { label: '📱', value: '📱' },
  { label: '🏆', value: '🏆' }, { label: '🥇', value: '🥇' }, { label: '🎖️', value: '🎖️' }, { label: '📜', value: '📜' }, { label: '🧾', value: '🧾' },
  { label: '🎯', value: '🎯' }, { label: '🤝', value: '🤝' }, { label: '🌟', value: '🌟' },
]

const toggleModuleIcon = (key: ResumeModuleKey, icon: string) => {
  const mod: any = getResumeModuleRef(key)
  const current = mod?.icon || ''
  mod.icon = current === icon ? '' : icon
}

const ensureModuleRows = (key: ResumeModuleKey) => {
  const mod = getResumeModuleRef(key) as any
  if (!mod.rows) mod.rows = []
  return mod.rows as ResumeModuleGridRow[]
}

const addGridRow = (key: ResumeModuleKey, cols: ResumeModuleGridRow['cols']) => {
  const rows = ensureModuleRows(key)
  const values: string[] = []
  for (let i = 0; i < cols; i++) values.push('')
  rows.push({ cols, values })
}

const removeGridRow = (key: ResumeModuleKey, rowIndex: number) => {
  const rows = ensureModuleRows(key)
  rows.splice(rowIndex, 1)
}

const clearModuleGrid = (key: ResumeModuleKey) => {
  const rows = ensureModuleRows(key)
  rows.splice(0, rows.length)
}

const getResumeModuleRef = (key: ResumeModuleKey) => {
  const builtIn = (props.resume.modules as any)[key]
  if (builtIn) return builtIn
  return (props.resume.modules.custom as any)[key]
}

const addCustomResumeModule = () => {
  const key = `custom-${uid()}` as ResumeModuleKey
  ;(props.resume.modules.custom as any)[key] = {
    enabled: true,
    title: '自定义模块',
    icon: '⭐',
    time: ['', ''],
    rows: [],
  }
  props.resume.modulesOrder = [...props.resume.modulesOrder, key as any]
  expandedModuleKey.value = key
}
</script>

<template>
  <SectionCard :icon="Menu" title="简历模块" v-model="resumeModulesEnabled" addable add-text="添加模块" :hide-delete="true" show-toggle toggle-text="启用" @add="addCustomResumeModule">
    <div class="module-list">
      <Draggable
        v-model="resumeModules"
        item-key="key"
        handle=".module-drag-handle"
        :animation="150"
        class="module-draggable"
      >
        <template #item="{ element }">
          <div class="module-wrapper">
            <div class="module-item" :class="{ 'is-expanded': element.expanded }">
              <div class="module-item__left">
                <span class="module-item__title">{{ element.title }}</span>
              </div>

              <div v-if="element.key === 'education' || element.key === 'workExp' || element.key === 'projectExp'" class="module-item__right module-item__right--with-add">
                <el-popover placement="bottom" :width="240" trigger="click">
                  <template #reference>
                    <el-button class="module-panel__btn" plain size="small" @click.stop>
                      <span
                        v-if="getResumeModuleRef(element.key).icon"
                        class="module-panel__btn-icon"
                        style="margin-right: 3px"
                      >
                        {{ getResumeModuleRef(element.key).icon }}
                      </span>
                      选择图标
                    </el-button>
                  </template>

                  <div class="module-icon-picker">
                    <div
                      v-for="opt in moduleIconOptions"
                      :key="opt.value"
                      class="module-icon-picker__item"
                      :class="{ 'is-selected': (getResumeModuleRef(element.key).icon || '') === opt.value }"
                      :aria-selected="(getResumeModuleRef(element.key).icon || '') === opt.value"
                      role="option"
                      @click="toggleModuleIcon(element.key, opt.value)"
                    >
                      {{ opt.label }}
                    </div>
                  </div>
                </el-popover>

                <el-button
                  v-if="element.key === 'education'"
                  size="small"
                  type="primary"
                  plain
                  class="module-panel__edu-add-btn"
                  @click.stop="() => {
                    const mod: any = getResumeModuleRef('education')
                    if (!Array.isArray(mod.items)) mod.items = []
                    mod.items.push({
                      id: uid(),
                      school: '',
                      major: '',
                      degree: '本科',
                      start: Array.isArray(mod.time) ? (mod.time[0] || '') : '',
                      end: Array.isArray(mod.time) ? (mod.time[1] || '') : '',
                    })
                  }"
                >
                  添加教育经历
                </el-button>

                <el-button
                  v-else-if="element.key === 'workExp'"
                  size="small"
                  type="primary"
                  plain
                  class="module-panel__edu-add-btn"
                  @click.stop="() => {
                    const mod: any = getResumeModuleRef('workExp')
                    if (!Array.isArray(mod.items)) mod.items = []
                    mod.items.push({
                      id: uid(),
                      company: '',
                      title: '',
                      start: Array.isArray(mod.time) ? (mod.time[0] || '') : '',
                      end: Array.isArray(mod.time) ? (mod.time[1] || '') : '',
                      highlights: [],
                    })
                  }"
                >
                  添加经历
                </el-button>

                <el-button
                  v-else-if="element.key === 'projectExp'"
                  size="small"
                  type="primary"
                  plain
                  class="module-panel__edu-add-btn"
                  @click.stop="() => {
                    const mod: any = getResumeModuleRef('projectExp')
                    if (!Array.isArray(mod.items)) mod.items = []
                    mod.items.push({
                      id: uid(),
                      name: '',
                      link: '',
                      role: '',
                      start: Array.isArray(mod.time) ? (mod.time[0] || '') : '',
                      end: Array.isArray(mod.time) ? (mod.time[1] || '') : '',
                      description: '',
                    })
                  }"
                >
                  添加经历
                </el-button>

                <el-icon
                  class="module-icon"
                  :class="{ 'is-rotated': element.expanded }"
                  @click="toggleModuleExpanded(element.key)"
                >
                  <ArrowDown />
                </el-icon>
                <el-icon class="module-icon module-icon--danger" @click="removeResumeModule(element.key)">
                  <Delete />
                </el-icon>
                <el-icon class="module-icon module-drag-handle">
                  <Rank />
                </el-icon>
              </div>

              <div v-else class="module-item__right">
                <el-popover placement="bottom" :width="240" trigger="click">
                  <template #reference>
                    <el-button class="module-panel__btn" plain size="small" @click.stop>
                      <span
                        v-if="getResumeModuleRef(element.key).icon"
                        class="module-panel__btn-icon"
                        style="margin-right: 8px"
                      >
                        {{ getResumeModuleRef(element.key).icon }}
                      </span>
                      选择图标
                    </el-button>
                  </template>

                  <div class="module-icon-picker">
                    <div
                      v-for="opt in moduleIconOptions"
                      :key="opt.value"
                      class="module-icon-picker__item"
                      :class="{ 'is-selected': (getResumeModuleRef(element.key).icon || '') === opt.value }"
                      :aria-selected="(getResumeModuleRef(element.key).icon || '') === opt.value"
                      role="option"
                      @click="toggleModuleIcon(element.key, opt.value)"
                    >
                      {{ opt.label }}
                    </div>
                  </div>
                </el-popover>

                <el-icon
                  class="module-icon"
                  :class="{ 'is-rotated': element.expanded }"
                  @click="toggleModuleExpanded(element.key)"
                >
                  <ArrowDown />
                </el-icon>
                <el-icon class="module-icon module-icon--danger" @click="removeResumeModule(element.key)">
                  <Delete />
                </el-icon>
                <el-icon class="module-icon module-drag-handle">
                  <Rank />
                </el-icon>
              </div>
            </div>

            <transition name="module-collapse">
              <div v-show="element.expanded" class="module-panel">
                <div class="module-panel__row">
                  <div class="module-panel__top">
                    <el-input class="module-panel__input" v-model="getResumeModuleRef(element.key).title" placeholder="模块标题">
                      <template #prefix>
                        <el-icon><EditPen /></el-icon>
                      </template>
                    </el-input>
                  </div>

                  <template v-if="element.key === 'education' || element.key === 'workExp' || element.key === 'projectExp'">
                    <div class="module-panel__edu">
                      <div
                        v-for="(itAny, idx) in ((getResumeModuleRef(element.key) as any).items || [])"
                        :key="(itAny as any).id || idx"
                        class="edu-item"
                      >
                        <div class="edu-item__row edu-item__row--top">
                          <el-select v-if="element.key === 'education'" v-model="(itAny as any).degree" placeholder="学历" style="width: 120px">
                            <el-option label="博士" value="博士" />
                            <el-option label="硕士" value="硕士" />
                            <el-option label="本科" value="本科" />
                            <el-option label="大专" value="大专" />
                            <el-option label="高中" value="高中" />
                            <el-option label="其他" value="其他" />
                          </el-select>

                          <el-date-picker
                            :model-value="[(itAny as any).start, (itAny as any).end]"
                            type="monthrange"
                            unlink-panels
                            start-placeholder="开始"
                            end-placeholder="结束"
                            format="YYYY-MM"
                            value-format="YYYY-MM"
                            class="edu-item__date"
                            @update:model-value="(v: any) => {
                              const arr: any = Array.isArray(v) ? v : ['', '']
                              ;(itAny as any).start = arr?.[0] || ''
                              ;(itAny as any).end = arr?.[1] || ''
                            }"
                          />

                          <el-button
                            size="small"
                            type="danger"
                            plain
                            @click="() => {
                              const mod: any = getResumeModuleRef(element.key)
                              if (!Array.isArray(mod.items)) return
                              mod.items.splice(idx, 1)
                            }"
                          >
                            删除
                          </el-button>
                        </div>

                        <div v-if="element.key === 'workExp'" class="edu-item__row edu-item__row--work">
                          <el-input v-model="(itAny as any).company" placeholder="公司名称" />
                          <el-input v-model="(itAny as any).title" placeholder="职位" />
                        </div>

                        <div v-if="element.key === 'projectExp'" class="edu-item__row edu-item__row--project-name">
                          <el-input v-model="(itAny as any).name" placeholder="项目名称" />
                        </div>

                        <div class="edu-item__row">
                          <div v-if="element.key === 'education'" class="edu-item__edu-extra">
                            <el-input v-model="(itAny as any).school" placeholder="学校" />
                            <el-input v-model="(itAny as any).major" placeholder="专业" />
                          </div>

                          <div v-if="element.key === 'projectExp'" class="project-exp-extra">
                            <el-input v-model="(itAny as any).role" placeholder="项目职位" />
                            <el-input v-model="(itAny as any).link" placeholder="项目链接" />
                          </div>
                        </div>

                        <div class="edu-item__grid">
                          <div class="edu-item__tags">
                            <div
                              v-for="n in 6"
                              :key="n"
                              class="module-tag"
                              @click="() => {
                                if (!Array.isArray((itAny as any).rows)) (itAny as any).rows = []
                                const values: string[] = []
                                for (let i = 0; i < n; i++) values.push('')
                                ;(itAny as any).rows.push({ cols: n, values })
                              }"
                            >
                              + {{ n }}
                            </div>
                            <div
                              class="module-tag"
                              @click="() => {
                                if (Array.isArray((itAny as any).rows)) (itAny as any).rows.splice(0, (itAny as any).rows.length)
                              }"
                            >
                              清空
                            </div>
                          </div>

                          <div v-if="Array.isArray((itAny as any).rows) && (itAny as any).rows.length > 0" class="module-grid-editor">
                            <div
                              v-for="(row, rowIndex) in ((itAny as any).rows as ResumeModuleGridRow[])"
                              :key="rowIndex"
                              class="module-grid-row"
                              :style="{ gridTemplateColumns: 'repeat(' + row.cols + ', 1fr)' }"
                            >
                              <el-input
                                v-for="(_, colIndex) in row.cols"
                                :key="colIndex"
                                v-model="row.values[colIndex]"
                                placeholder="请输入"
                                size="small"
                                type="textarea"
                                :autosize="{ minRows: 1, maxRows: 8 }"
                              />
                              <el-icon class="module-grid-row__delete" @click="(itAny as any).rows.splice(rowIndex, 1)"><Delete /></el-icon>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <div v-if="element.key !== 'education' && element.key !== 'workExp' && element.key !== 'projectExp' && (getResumeModuleRef(element.key).rows || []).length === 0" class="module-panel__empty">
                    暂无内容，悬浮到此处添加行
                  </div>
                  <div v-if="element.key !== 'education' && element.key !== 'workExp' && element.key !== 'projectExp'" class="module-grid-editor">
                    <div
                      v-for="(row, rowIndex) in (getResumeModuleRef(element.key).rows as ResumeModuleGridRow[])"
                      :key="rowIndex"
                      class="module-grid-row"
                      :style="{ gridTemplateColumns: 'repeat(' + row.cols + ', 1fr)' }"
                    >
                      <el-input
                        v-for="(_, colIndex) in row.cols"
                        :key="colIndex"
                        v-model="row.values[colIndex]"
                        placeholder="请输入"
                        size="small"
                      />
                      <el-icon class="module-grid-row__delete" @click="removeGridRow(element.key, rowIndex)"><Delete /></el-icon>
                    </div>
                  </div>

                  <div v-if="element.key !== 'education' && element.key !== 'workExp' && element.key !== 'projectExp'" class="module-panel__footer">
                    <div class="module-panel__tags">
                      <div v-for="n in 6" :key="n" class="module-tag" @click="addGridRow(element.key, n as any)">+ {{ n }}</div>
                      <div class="module-tag" @click="clearModuleGrid(element.key)">清空</div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </Draggable>
    </div>
  </SectionCard>
</template>

<style lang="scss" scoped>
.module-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.module-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: #fff;
}

.module-item__left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.module-item__title {
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.module-item__right {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.module-icon {
  color: var(--el-text-color-secondary);
  cursor: pointer;
  transition: color 0.15s, transform 0.15s;
}

.module-icon:hover {
  color: var(--el-color-primary);
}

.module-icon--danger:hover {
  color: var(--el-color-danger);
}

.module-icon.is-rotated {
  transform: rotate(180deg);
}

.module-drag-handle {
  cursor: grab;
}

.module-drag-handle:active {
  cursor: grabbing;
}

.module-wrapper {
  display: flex;
  flex-direction: column;
}

.module-item.is-expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.module-panel {
  margin-top: 0;
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-top: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #f5f7fa;
}

.module-panel__row {
  display: block;
}

.module-panel__top {
  display: block;
}

.module-panel__empty {
  margin-top: 12px;
  padding: 22px 10px;
  border: 1px dashed var(--el-border-color);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.55);
  color: var(--el-text-color-secondary);
  text-align: center;
  font-weight: 600;
}

.module-panel__footer {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.module-panel__tags {
  display: flex;
  align-items: center;
  gap: 6px;
}

.module-tag {
  height: 22px;
  padding: 0 6px;
  border-radius: 4px;
  background: #00b9a8;
  color: #fff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
}

.edu-item__grid {
  margin-top: 10px;
}

.edu-item__tags {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  flex-wrap: wrap;
}

.module-panel__edu {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edu-item {
  padding: 10px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
}

.edu-item__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edu-item__row + .edu-item__row {
  margin-top: 10px;
}

.edu-item__row :deep(.el-input) {
  flex: 1;
  min-width: 0;
}

.edu-item__date {
  flex: 0 0 auto;
  width: 240px;
}

.edu-item__date :deep(.el-input) {
  width: 100%;
}

.project-exp-extra {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.project-exp-extra :deep(.el-input) {
  width: 100%;
}

.edu-item__edu-extra {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.edu-item__edu-extra :deep(.el-select) {
  width: 100%;
}

.edu-item__edu-extra :deep(.el-input) {
  width: 100%;
}

.module-panel__btn {
  margin-right: 4px;
}

.module-panel__btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  line-height: 18px;
  flex: 0 0 18px;
  overflow: hidden;
}

.module-panel__edu-add-btn {
  color: #fff !important;
}

.module-panel__edu-add-btn:hover {
  color: #fff !important;
}

.module-item__right--with-add {
  gap: 6px;
}

.module-item__right--with-add :deep(.el-button.module-panel__edu-add-btn) {
  color: #fff !important;
}

.module-icon-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 8px;
  padding-right: 16px;
  box-sizing: border-box;
}

.module-icon-picker__item {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  background: #f5f7fa;
  transition: background-color 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 1px solid transparent;
}

.module-icon-picker__item:hover {
  background: #e5e7eb;
}

.module-icon-picker__item.is-selected {
  background: rgba(64, 158, 255, 0.12);
  border-color: rgba(64, 158, 255, 0.65);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.18);
}

.module-grid-editor {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.module-grid-row {
  position: relative;
  display: grid;
  gap: 10px;
  align-items: center;
}

.module-grid-row__delete {
  position: absolute;
  right: -28px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--el-color-danger);
  cursor: pointer;
}

.module-collapse-enter-active,
.module-collapse-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.module-collapse-enter-from,
.module-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

.module-collapse-enter-to,
.module-collapse-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>