<script setup lang="ts">
import { computed, ref } from 'vue'
import { Delete, MoreFilled, Plus } from '@element-plus/icons-vue'
import type { Component } from 'vue'

type HeaderAction = {
  icon?: Component
  label: string
  key: string
  danger?: boolean
}

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    /** Element Plus icon component */
    icon?: Component
    modelValue?: boolean
    collapsible?: boolean
    defaultCollapsed?: boolean
    showToggle?: boolean
    toggleText?: string
    addable?: boolean
    addText?: string
    actions?: HeaderAction[]
  }>(),
  {
    subtitle: '',
    icon: undefined,
    modelValue: true,
    collapsible: true,
    defaultCollapsed: false,
    showToggle: false,
    toggleText: '启用',
    addable: false,
    addText: '添加',
    actions: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'toggle-collapse', collapsed: boolean): void
  (e: 'add'): void
  (e: 'action', key: string): void
}>()

const collapsed = ref(!!props.defaultCollapsed)

const enabled = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const onHeaderClick = () => {
  if (!props.collapsible) return
  collapsed.value = !collapsed.value
  emit('toggle-collapse', collapsed.value)
}

const onAdd = () => emit('add')
const onAction = (key: string) => emit('action', key)
</script>

<template>
  <section class="c-section-card" :class="{ 'is-disabled': !enabled }">
    <div class="c-section-card__header" @click="onHeaderClick">
      <div class="c-section-card__title">
        <span class="c-section-card__icon">
          <el-icon v-if="icon" class="c-section-card__icon-inner"><component :is="icon" /></el-icon>
          <span v-else class="c-section-card__dot" />
        </span>
        <span class="c-section-card__title-text">{{ title }}</span>
        <span v-if="subtitle" class="c-section-card__subtitle">{{ subtitle }}</span>
      </div>

      <div class="c-section-card__tools" @click.stop>
        <div v-if="showToggle" class="c-section-card__toggle">
          <span class="c-section-card__toggle-text">{{ toggleText }}</span>
          <el-switch v-model="enabled" size="small" />
        </div>

        <el-button
          v-if="addable"
          class="c-icon-btn"
          type="primary"
          plain
          size="small"
          :icon="Plus"
          @click="onAdd"
        >
          {{ addText }}
        </el-button>

        <el-dropdown v-if="actions && actions.length" trigger="click" @command="onAction">
          <el-button class="c-icon-btn" size="small" :icon="MoreFilled" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="a in actions"
                :key="a.key"
                :command="a.key"
                :class="{ 'is-danger': a.danger }"
              >
                <el-icon v-if="a.icon" class="mr-8"><component :is="a.icon" /></el-icon>
                {{ a.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button v-else class="c-icon-btn" size="small" :icon="Delete" plain @click="onAction('delete')" />
      </div>
    </div>

    <el-collapse-transition>
      <div v-show="!collapsed" class="c-section-card__body">
        <slot />
      </div>
    </el-collapse-transition>
  </section>
</template>

<style lang="scss" scoped>
.c-section-card {
  background: #fff;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(17, 24, 39, 0.04);

  &.is-disabled {
    opacity: 0.65;
  }
}

.c-section-card__header {
  height: 44px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #f7fbff;
  border-bottom: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
}

.c-section-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.c-section-card__icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.c-section-card__icon-inner {
  color: var(--el-color-primary);
  font-size: 18px;
}

.c-section-card__dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--el-color-primary);
}

.c-section-card__title-text {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.c-section-card__subtitle {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.c-section-card__tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.c-section-card__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.c-section-card__toggle-text {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.c-section-card__body {
  padding: 10px 12px;
}

.c-icon-btn {
  border-radius: 8px;
}

:deep(.el-dropdown-menu__item.is-danger) {
  color: var(--el-color-danger);
}
</style>
