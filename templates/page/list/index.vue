<script setup lang="ts">
const keyword = ref('')
const currentStatus = ref('all')

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '规划中', value: 'planning' },
  { label: '开发中', value: 'developing' },
  { label: '待交付', value: 'pending' },
]

const projectList = reactive([
  {
    id: 1,
    name: '商城小程序改版',
    owner: 'Lee',
    status: 'developing',
    progress: 68,
    deadline: '2025-09-12',
  },
  {
    id: 2,
    name: '城市活动营销页',
    owner: 'Kara',
    status: 'planning',
    progress: 35,
    deadline: '2025-08-03',
  },
  {
    id: 3,
    name: '会员增长运营后台',
    owner: 'Chen',
    status: 'pending',
    progress: 92,
    deadline: '2025-07-21',
  },
])

const filteredList = computed(() => {
  return projectList
    .filter((item) => {
      if (currentStatus.value !== 'all' && item.status !== currentStatus.value)
        return false
      if (!keyword.value)
        return true
      return item.name.includes(keyword.value) || item.owner.includes(keyword.value)
    })
    .sort((a, b) => b.progress - a.progress)
})

const statusTextMap: Record<string, string> = {
  all: '全部',
  planning: '规划中',
  developing: '开发中',
  pending: '待交付',
}

const statusColorMap: Record<string, string> = {
  all: '#6366f1',
  planning: '#0ea5e9',
  developing: '#22c55e',
  pending: '#f97316',
}

const summary = computed(() => {
  const total = projectList.length
  const done = projectList.filter((item) => item.progress >= 90).length
  const busy = projectList.filter((item) => item.status === 'developing').length
  return [
    { label: '项目总数', value: total },
    { label: '即将交付', value: done },
    { label: '开发中', value: busy },
  ]
})

definePage({
  name: '__NAME_CAMEL__List',
  style: {
    navigationBarTitleText: '__TITLE__',
  },
})

function handleStatusChange(item: (typeof statusTabs)[number]) {
  currentStatus.value = item.value
}

function handleItemTap(item: (typeof projectList)[number]) {
  console.log('📌 选中项目：', item)
}
</script>

<template>
  <scroll-view class="page" scroll-y>
    <view class="summary">
      <view v-for="item in summary" :key="item.label" class="summary__item">
        <text class="summary__value">{{ item.value }}</text>
        <text class="summary__label">{{ item.label }}</text>
      </view>
    </view>

    <view class="filter">
      <wd-search
        v-model="keyword"
        shape="round"
        placeholder="搜索项目或负责人"
      />
      <scroll-view class="filter__tabs" scroll-x>
        <view class="filter__tab-list">
          <view
            v-for="item in statusTabs"
            :key="item.value"
            class="filter__tab"
            :class="{ 'filter__tab--active': currentStatus === item.value }"
            @click="handleStatusChange(item)"
          >
            {{ item.label }}
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="list">
      <view
        v-for="item in filteredList"
        :key="item.id"
        class="list__card"
        @click="handleItemTap(item)"
      >
        <view class="list__header">
          <text class="list__title">{{ item.name }}</text>
          <wd-tag
            :color="statusColorMap[item.status]"
            plain
            size="small"
          >
            {{ statusTextMap[item.status] }}
          </wd-tag>
        </view>
        <view class="list__meta">
          <text class="list__meta-item">负责人：{{ item.owner }}</text>
          <text class="list__meta-item">截止：{{ item.deadline }}</text>
        </view>
        <wd-progress :percentage="item.progress" stroke-width="6" />
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

.summary {
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 32rpx;

  &__item {
    flex: 1;
    padding: 20rpx;
    border-radius: 20rpx;
    background: #ffffff;
    text-align: center;
    box-shadow: 0 8rpx 24rpx rgba(79, 70, 229, 0.08);
  }

  &__value {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: #111827;
  }

  &__label {
    display: block;
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #6b7280;
  }
}

.filter {
  margin-bottom: 28rpx;

  &__tabs {
    margin-top: 16rpx;
    white-space: nowrap;
  }

  &__tab-list {
    display: inline-flex;
    gap: 16rpx;
  }

  &__tab {
    padding: 12rpx 28rpx;
    border-radius: 999rpx;
    background: #e0e7ff;
    color: #4338ca;
    font-size: 26rpx;

    &--active {
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      color: #ffffff;
      box-shadow: 0 8rpx 20rpx rgba(99, 102, 241, 0.35);
    }
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  &__card {
    padding: 24rpx;
    border-radius: 24rpx;
    background: #ffffff;
    box-shadow: 0 12rpx 28rpx rgba(15, 23, 42, 0.08);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1f2937;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    color: #6b7280;
    font-size: 24rpx;
  }

  &__meta-item {
    display: block;
  }
}
</style>
