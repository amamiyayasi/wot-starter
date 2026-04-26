<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { use__NAME_PASCAL__Store } from '@/store/use__NAME_PASCAL__Store'

const store = use__NAME_PASCAL__Store()

const overview = computed(() => store.overview)
const tasks = computed(() => store.tasks)
const loading = computed(() => store.loading)

definePage({
  name: '__NAME_CAMEL__Dashboard',
  style: {
    navigationBarTitleText: '__TITLE__',
  },
})

onMounted(() => {
  if (!store.overview)
    store.bootstrap()
})

function handleRefresh() {
  store.bootstrap()
}

const conversionBadge = computed(() => {
  if (!overview.value)
    return '--'
  return `${overview.value.conversion}%`
})

function progressColor(value: number) {
  if (value >= 80)
    return '#22c55e'
  if (value >= 50)
    return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <scroll-view class="page" scroll-y>
    <view class="hero">
      <view>
        <text class="hero__title">__TITLE__</text>
        <text class="hero__subtitle">掌握团队节奏与交付进度，随时准备接入真实业务。</text>
      </view>
      <wd-button size="small" plain :loading="loading" @click="handleRefresh">
        刷新数据
      </wd-button>
    </view>

    <view class="overview" v-if="overview">
      <view class="overview__card">
        <text class="overview__label">预计营收</text>
        <text class="overview__value">￥{{ overview.revenue.toLocaleString() }}</text>
      </view>
      <view class="overview__card">
        <text class="overview__label">订单量</text>
        <text class="overview__value">{{ overview.orders }}</text>
      </view>
      <view class="overview__card">
        <text class="overview__label">转化率</text>
        <text class="overview__value overview__value--badge">{{ conversionBadge }}</text>
      </view>
      <view class="overview__card">
        <text class="overview__label">满意度</text>
        <text class="overview__value">{{ overview.satisfaction }}%</text>
      </view>
    </view>
    <view v-else class="overview overview--placeholder">
      <text class="placeholder">加载中...</text>
    </view>

    <view class="tasks">
      <view class="tasks__header">
        <text class="tasks__title">重点任务</text>
        <text class="tasks__count">{{ tasks.length }} 个</text>
      </view>
      <view v-if="tasks.length" class="tasks__list">
        <view
          v-for="task in tasks"
          :key="task.id"
          class="tasks__item"
        >
          <view class="tasks__meta">
            <text class="tasks__name">{{ task.title }}</text>
            <text class="tasks__owner">负责人：{{ task.owner }}</text>
          </view>
          <view class="tasks__footer">
            <text class="tasks__time">更新：{{ task.updatedAt }}</text>
            <wd-progress
              :percentage="task.progress"
              :stroke-color="progressColor(task.progress)"
              stroke-width="6"
            />
          </view>
          <view class="tasks__actions">
            <wd-button
              size="small"
              plain
              @click="store.reorderTask(task.id, 'up')"
            >
              上移
            </wd-button>
            <wd-button
              size="small"
              plain
              @click="store.reorderTask(task.id, 'down')"
            >
              下移
            </wd-button>
          </view>
        </view>
      </view>
      <view v-else class="tasks__empty">
        <text>暂无任务，点击刷新同步最新数据。</text>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 48rpx;
  background: #f4f6fb;
  box-sizing: border-box;
}

.hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 32rpx;

  &__title {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: #111827;
  }

  &__subtitle {
    display: block;
    margin-top: 12rpx;
    font-size: 26rpx;
    color: #6b7280;
    line-height: 1.6;
  }
}

.overview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
  margin-bottom: 32rpx;

  &__card {
    padding: 24rpx;
    border-radius: 24rpx;
    background: linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%);
    box-shadow: 0 12rpx 32rpx rgba(99, 102, 241, 0.15);
  }

  &__label {
    display: block;
    font-size: 26rpx;
    color: #4338ca;
    margin-bottom: 12rpx;
  }

  &__value {
    display: block;
    font-size: 34rpx;
    font-weight: 700;
    color: #1f2937;

    &--badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8rpx 20rpx;
      border-radius: 999rpx;
      background: rgba(59, 130, 246, 0.12);
      color: #2563eb;
    }
  }

  &--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200rpx;
    background: #eef2ff;
    color: #6b7280;
    border-radius: 24rpx;
  }
}

.placeholder {
  font-size: 28rpx;
  color: #6b7280;
}

.tasks {
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(15, 23, 42, 0.12);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: #111827;
  }

  &__count {
    font-size: 24rpx;
    color: #6b7280;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }

  &__item {
    padding: 20rpx;
    border-radius: 20rpx;
    background: #f9fafb;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }

  &__name {
    font-size: 28rpx;
    font-weight: 600;
    color: #1f2937;
  }

  &__owner {
    font-size: 24rpx;
    color: #6b7280;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20rpx;
  }

  &__time {
    font-size: 24rpx;
    color: #6b7280;
  }

  &__actions {
    margin-top: 16rpx;
    display: flex;
    gap: 16rpx;
  }

  &__empty {
    padding: 60rpx 20rpx;
    text-align: center;
    color: #9ca3af;
  }
}
</style>
