<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 左侧初始宽度（百分比） */
    leftWidth?: number
    /** 左侧最小宽度（百分比） */
    minLeftWidth?: number
    /** 左侧最大宽度（百分比） */
    maxLeftWidth?: number
    /** 右侧最小宽度（百分比） */
    minRightWidth?: number
    /** 是否禁用拖拽 */
    disabled?: boolean
  }>(),
  {
    leftWidth: 50,
    minLeftWidth: 20,
    maxLeftWidth: 80,
    minRightWidth: 20,
    disabled: false
  }
)

const emit = defineEmits<{
  resize: [leftWidth: number, rightWidth: number]
}>()

const containerRef = ref<HTMLElement | null>(null)

const leftWidthPercent = ref(props.leftWidth)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const startLeftWidth = ref(0)
const isMobile = ref(false)

const clampLeftWidth = (value: number) => {
  const minLeft = props.minLeftWidth
  const maxLeft = props.maxLeftWidth
  const minRight = props.minRightWidth

  const effectiveMinLeft = Math.max(minLeft, 0)
  const effectiveMaxLeft = Math.min(maxLeft, 100)

  let v = Math.max(effectiveMinLeft, Math.min(effectiveMaxLeft, value))

  // 右侧最小值限制：left <= 100 - minRight
  const maxLeftByRight = 100 - minRight
  v = Math.min(v, maxLeftByRight)

  return v
}

watch(
  () => props.leftWidth,
  (v) => {
    leftWidthPercent.value = clampLeftWidth(v)
  }
)

const leftWidthStyle = computed(() => {
  if (isMobile.value) {
    return { height: `${leftWidthPercent.value}%` }
  }
  return { width: `${leftWidthPercent.value}%` }
})

const rightWidthStyle = computed(() => {
  if (isMobile.value) {
    return { height: `${100 - leftWidthPercent.value}%` }
  }
  return { width: `${100 - leftWidthPercent.value}%` }
})

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const handleMouseDown = (e: MouseEvent) => {
  if (props.disabled) return

  isDragging.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  startLeftWidth.value = leftWidthPercent.value

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = isMobile.value ? 'row-resize' : 'col-resize'
  document.body.style.userSelect = 'none'

  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !containerRef.value) return

  let deltaPercent = 0

  if (isMobile.value) {
    const containerHeight = containerRef.value.offsetHeight
    const deltaY = e.clientY - startY.value
    deltaPercent = (deltaY / containerHeight) * 100
  } else {
    const containerWidth = containerRef.value.offsetWidth
    const deltaX = e.clientX - startX.value
    deltaPercent = (deltaX / containerWidth) * 100
  }

  let newLeftWidth = startLeftWidth.value + deltaPercent
  newLeftWidth = clampLeftWidth(newLeftWidth)

  leftWidthPercent.value = newLeftWidth

  const rightWidth = 100 - newLeftWidth
  emit('resize', newLeftWidth, rightWidth)
}

const handleMouseUp = () => {
  if (!isDragging.value) return

  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

const handleResize = () => {
  checkMobile()
}

onMounted(() => {
  checkMobile()
  leftWidthPercent.value = clampLeftWidth(leftWidthPercent.value)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})
</script>

<template>
  <div ref="containerRef" class="split-pane-container">
    <div class="split-pane-left" :style="leftWidthStyle">
      <slot name="left">
        <div class="default-panel">
          <el-empty description="左侧面板" />
        </div>
      </slot>
    </div>

    <div
      class="split-pane-divider"
      :class="{ dragging: isDragging, disabled: disabled }"
      @mousedown="handleMouseDown"
    >
      <div class="divider-handle"></div>
    </div>

    <div class="split-pane-right" :style="rightWidthStyle">
      <slot name="right">
        <div class="default-panel">
          <el-empty description="右侧面板" />
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.split-pane-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.split-pane-left,
.split-pane-right {
  height: 100%;
  overflow: auto;
  transition: width 0.2s ease;
  flex-shrink: 0;
}

.split-pane-left {
  background-color: var(--el-bg-color-page, #f5f7fa);
  border-right: 1px solid var(--el-border-color);
}

.split-pane-right {
  background-color: var(--el-bg-color);
}

.split-pane-divider {
  width: 4px;
  height: 100%;
  cursor: col-resize;
  position: relative;
  background-color: var(--el-border-color);
  flex-shrink: 0;
  transition: background-color 0.2s ease;
  z-index: 10;

  &:hover:not(.disabled) {
    background-color: var(--el-color-primary);
  }

  &.dragging {
    background-color: var(--el-color-primary);
  }

  &.disabled {
    cursor: default;
    opacity: 0.5;
  }
}

.divider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 40px;
  background-color: var(--el-fill-color-light);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 2px;
    height: 12px;
    background-color: var(--el-text-color-secondary);
    border-radius: 1px;
  }

  &::before {
    left: 6px;
  }

  &::after {
    right: 6px;
  }
}

.split-pane-divider:hover:not(.disabled) .divider-handle,
.split-pane-divider.dragging .divider-handle {
  background-color: var(--el-color-primary);

  &::before,
  &::after {
    background-color: #ffffff;
  }
}

.default-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

@media (max-width: 768px) {
  .split-pane-container {
    flex-direction: column;
  }

  .split-pane-left,
  .split-pane-right {
    width: 100% !important;
    height: 50%;
  }

  .split-pane-divider {
    width: 100%;
    height: 4px;
    cursor: row-resize;

    .divider-handle {
      width: 40px;
      height: 20px;

      &::before,
      &::after {
        width: 12px;
        height: 2px;
      }

      &::before {
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
      }

      &::after {
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
