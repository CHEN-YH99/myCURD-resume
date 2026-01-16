<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeData } from '@/types/resume'

type TitleAlign = 'left' | 'center' | 'right'

const props = defineProps<{
  resume: ResumeData
}>()

const align = computed<TitleAlign>(() => (props.resume.title as any)?.align || 'center')

const alignClass = computed(() => `is-align-${align.value}`)

const showAvatar = computed(() => {
  const url = props.resume.personInfo?.avatarUrl
  return !!url
})
</script>

<template>
  <div class="r-header" :class="alignClass">
    <div class="r-header__content">
      <div class="r-header__main">
        <div class="r-header__top">
          <div class="r-header__title">{{ resume.title.title || '简历模板' }}</div>
        </div>

        <div v-if="resume.jobIntention.enabled" class="r-header__meta">
          <template v-for="(k, idx) in resume.jobIntention.order" :key="k">
            <template v-if="resume.jobIntention.fields[k]">
              <span v-if="k === 'workYears'">工作经验：{{ resume.jobIntention.workYears }}年</span>
              <span v-else-if="k === 'position'">求职意向：{{ resume.jobIntention.position }}</span>
              <span v-else-if="k === 'city'">期望城市：{{ resume.jobIntention.city }}</span>
              <span v-else-if="k === 'salary'">期望薪资：{{ resume.jobIntention.salary }}</span>
              <span v-else-if="k === 'custom'">{{ resume.jobIntention.custom?.title }}：{{ resume.jobIntention.custom?.value }}</span>

              <span v-if="idx !== resume.jobIntention.order.length - 1" class="sep">|</span>
            </template>
          </template>
        </div>

        <div
          v-if="resume.personInfo.enabled"
          class="r-header__contact"
          :class="{
            'is-two-columns': resume.personInfo.preview?.columns === 2,
            'is-three-columns': resume.personInfo.preview?.columns === 3
          }"
        >
          <template v-for="key in resume.personInfo.order" :key="key">
            <span v-if="key === 'name'" class="item">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">姓名：</span>
              {{ resume.personInfo.name }}
            </span>

            <span v-else-if="key === 'gender'" class="item">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">性别/年龄：</span>
              {{ resume.personInfo.gender }} | {{ resume.personInfo.age }}岁
            </span>

            <span v-else-if="key === 'age' && !(resume.personInfo.order || []).includes('gender')" class="item">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">年龄：</span>
              {{ resume.personInfo.age }}岁
            </span>

            <span v-else-if="key === 'phone'" class="item">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">电话：</span>
              {{ resume.personInfo.phone }}
            </span>

            <span v-else-if="key === 'email'" class="item">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">邮箱：</span>
              {{ resume.personInfo.email }}
            </span>

            <span v-else-if="key === 'wechat'" class="item">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">微信：</span>
              {{ resume.personInfo.wechat }}
            </span>

            <a v-else-if="key === 'github'" class="item link" :href="resume.personInfo.github" target="_blank" rel="noreferrer">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">Github：</span>
              {{ resume.personInfo.github }}
            </a>

            <span v-else-if="!(key === 'age' && (resume.personInfo.order || []).includes('gender')) && resume.personInfo.fields?.[key]?.enabled !== false" class="item">
              <span v-if="resume.personInfo.preview?.showLabels" class="label">{{ resume.personInfo.fields?.[key]?.label }}：</span>
              {{ resume.personInfo.fields?.[key]?.value }}
            </span>
          </template>
        </div>
      </div>

      <div v-if="showAvatar" class="r-header__aside">
        <div class="r-header__avatar">
          <img class="r-header__img" :src="resume.personInfo.avatarUrl" alt="avatar" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.r-header__content {
  display: flex;
  gap: 14px;
}

.r-header__main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.r-header__aside {
  flex: 0 0 auto;
}

// Align Left
.is-align-left {
  .r-header__main {
    order: 1;
  }
  .r-header__aside {
    order: 2;
  }
  .r-header__meta,
  .r-header__contact {
    justify-content: flex-start;
  }
  .r-header__avatar {
    width: 90px;
    height: 90px;
  }
}

// Align Right
.is-align-right {
  .r-header__main {
    order: 2;
    align-items: flex-end;
  }
  .r-header__aside {
    order: 1;
  }
  .r-header__meta,
  .r-header__contact {
    justify-content: flex-end;
  }
  .r-header__title {
    text-align: right;
  }
  .r-header__avatar {
    width: 90px;
    height: 90px;
  }
}

// Align Center
.is-align-center {
  .r-header__content {
    flex-direction: column;
    align-items: center;
  }
  .r-header__aside {
    order: 1;
  }
  .r-header__main {
    order: 2;
    width: 100%;
    align-items: center;
  }
  .r-header__title {
    text-align: center;
  }
  .r-header__meta {
    justify-content: center;
  }
  .r-header__contact {
    width: auto;
    justify-content: center;
  }
  .r-header__avatar {
    width: 78px;
    height: 78px;
  }
}

.r-header__avatar {
  width: 78px;
  height: 78px;
  border-radius: var(--r-avatar-radius, 50%);
  overflow: hidden;
  border: 3px solid var(--el-color-primary-light-9);
  background: #fff;
}

.r-header__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.r-header__title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  letter-spacing: 1px;
}

.r-header__meta {
  font-size: 14px;
  color: #111827;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.sep {
  color: #9ca3af;
}

.r-header__contact {
  width: 100%;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 13px;
  color: #111827;
}

.r-header__contact.is-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 14px;
  row-gap: 6px;
  align-items: start;
}

.r-header__contact.is-three-columns {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 14px;
  row-gap: 6px;
  align-items: start;
}

.is-align-right {
  .r-header__contact.is-two-columns,
  .r-header__contact.is-three-columns {
    justify-items: end;
  }
  .r-header__contact.is-two-columns .item,
  .r-header__contact.is-three-columns .item {
    text-align: right;
  }
}

.is-align-center {
  .r-header__contact.is-two-columns,
  .r-header__contact.is-three-columns {
    justify-items: center;
  }

  .r-header__contact.is-two-columns .item,
  .r-header__contact.is-three-columns .item {
    display: inline-flex;
    justify-content: flex-start;
    text-align: left;
  }

  .r-header__contact.is-two-columns .label,
  .r-header__contact.is-three-columns .label {
    text-align: left;
  }
}

.item {
  white-space: nowrap;
}

.r-header__contact.is-two-columns .item {
  white-space: normal;
}

.label {
  color: #6b7280;
}

.link {
  color: var(--el-color-primary);
}
</style>
