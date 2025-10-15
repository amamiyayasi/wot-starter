<script setup lang="ts">
definePage({
  name: '__PAGE_NAME__',
  // __LAYOUT_PLACEHOLDER__
  style: {
    navigationBarTitleText: '__PAGE_TITLE__',
  },
})

const store = use__PASCAL_NAME__Store()

onMounted(() => {
  store.bootstrap()
})

const isLoading = computed(() => store.loading)
const overview = computed(() => store.overview)
const items = computed(() => store.items)
const filters = computed(() => store.filters)

function handleRefresh() {
  store.bootstrap()
}

function applyFilter(type: 'status' | 'keyword', value: string) {
  if (type === 'status')
    store.updateStatus(value)
  else
    store.updateKeyword(value)
}

function openDetail(itemId: number) {
  const target = items.value.find(item => item.id === itemId)
  if (!target)
    return

  uni.showToast({ title: `${target.name} - 可跳转详情页`, icon: 'none' })
}
</script>

<template>
  <scroll-view scroll-y class="h-full box-border">
    <view class="box-border p-4">
      <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <view class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <view>
            <text class="text-5 font-bold text-gray-900 dark:text-gray-100">
              {{ overview.name }}
            </text>
            <text class="text-3 text-gray-500">
              {{ overview.description }}
            </text>
          </view>
          <wd-button type="primary" plain :loading="isLoading" @click="handleRefresh">
            刷新数据
          </wd-button>
        </view>
      </view>

      <view class="mt-4 grid gap-3 md:grid-cols-3">
        <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
          <text class="text-3 text-gray-500">总计事项</text>
          <text class="mt-2 block text-6 font-bold text-gray-900 dark:text-gray-100">
            {{ overview.total }}
          </text>
        </view>
        <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
          <text class="text-3 text-gray-500">进行中</text>
          <text class="mt-2 block text-6 font-bold text-gray-900 dark:text-gray-100">
            {{ overview.processing }}
          </text>
        </view>
        <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
          <text class="text-3 text-gray-500">已完成</text>
          <text class="mt-2 block text-6 font-bold text-gray-900 dark:text-gray-100">
            {{ overview.done }}
          </text>
        </view>
      </view>

      <view class="mt-4 space-y-3 rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <view class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <view class="flex-1">
            <wd-input
              :model-value="filters.keyword"
              placeholder="输入关键词过滤"
              clearable
              @update:model-value="value => applyFilter('keyword', value)"
            />
          </view>
          <view class="flex gap-2">
            <wd-button
              v-for="option in store.statusOptions"
              :key="option.value"
              size="small"
              :type="filters.status === option.value ? 'primary' : 'default'"
              :plain="filters.status !== option.value"
              @click="applyFilter('status', option.value)"
            >
              {{ option.label }}
            </wd-button>
          </view>
        </view>

        <view class="space-y-3">
          <view
            v-for="item in items"
            :key="item.id"
            class="rounded-2 border border-gray-100 p-3 dark:border-gray-700"
            @click="openDetail(item.id)"
          >
            <view class="flex items-center justify-between">
              <text class="text-4 font-semibold text-gray-900 dark:text-gray-100">
                {{ item.name }}
              </text>
              <text class="text-3 text-gray-500">
                {{ item.updatedAt }}
              </text>
            </view>
            <text class="mt-2 block text-3 text-gray-600 dark:text-gray-300">
              {{ item.description }}
            </text>
            <view class="mt-3 flex flex-wrap gap-2">
              <view
                v-for="tag in item.tags"
                :key="tag"
                class="rounded-full bg-gray-100 px-2 py-0.5 text-2 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                #{{ tag }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped>
scroll-view {
  height: 100vh;
}
</style>
