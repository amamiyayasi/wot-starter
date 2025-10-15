<script setup lang="ts">
definePage({
  name: '__PAGE_NAME__',
  // __LAYOUT_PLACEHOLDER__
  style: {
    navigationBarTitleText: '__PAGE_TITLE__',
  },
})

const filters = reactive({
  keyword: '',
  status: 'all',
  owner: 'all',
})

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'processing' },
  { label: '待启动', value: 'pending' },
  { label: '已完成', value: 'finished' },
]

const sortOptions = [
  { label: '按更新时间', value: 'updated' },
  { label: '按优先级', value: 'priority' },
  { label: '按截止时间', value: 'deadline' },
]

const sortState = reactive({ key: 'updated', ascending: false })

const projects = ref([
  {
    id: 1,
    name: '智慧门店运营系统',
    owner: '增长团队',
    status: 'processing',
    updatedAt: '2 小时前',
    priority: 1,
    deadline: '2025-07-15',
    tags: ['零售', '微信小程序'],
    favorite: true,
    summary: '负责门店连锁的会员、优惠、数据看板等核心功能',
  },
  {
    id: 2,
    name: '企业培训平台',
    owner: '企业服务组',
    status: 'pending',
    updatedAt: '昨天 18:30',
    priority: 2,
    deadline: '2025-08-02',
    tags: ['H5', '直播'],
    favorite: false,
    summary: '面向企业的培训报名、直播课堂、考试等业务场景',
  },
  {
    id: 3,
    name: '跨境电商客服助手',
    owner: 'AI 创新组',
    status: 'finished',
    updatedAt: '2025-06-30',
    priority: 0,
    deadline: '2025-06-20',
    tags: ['AI', '多语言'],
    favorite: true,
    summary: '提供工单智能分类、多语言翻译和高频问题推荐功能',
  },
  {
    id: 4,
    name: 'SaaS 运营驾驶舱',
    owner: '数据平台组',
    status: 'processing',
    updatedAt: '45 分钟前',
    priority: 0,
    deadline: '2025-07-02',
    tags: ['可视化', '看板'],
    favorite: false,
    summary: '聚合核心经营指标，支持自定义指标和多维度分析',
  },
])

const filteredProjects = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase()

  return projects.value.filter((item) => {
    const keywordMatch = !keyword
      || item.name.toLowerCase().includes(keyword)
      || item.summary.toLowerCase().includes(keyword)
    const statusMatch = filters.status === 'all' || item.status === filters.status
    const ownerMatch = filters.owner === 'all' || item.owner === filters.owner

    return keywordMatch && statusMatch && ownerMatch
  })
})

const sortedProjects = computed(() => {
  const list = filteredProjects.value.slice()

  list.sort((a, b) => {
    if (sortState.key === 'priority') {
      return sortState.ascending ? a.priority - b.priority : b.priority - a.priority
    }

    if (sortState.key === 'deadline') {
      return sortState.ascending
        ? Number(new Date(a.deadline)) - Number(new Date(b.deadline))
        : Number(new Date(b.deadline)) - Number(new Date(a.deadline))
    }

    return sortState.ascending ? a.id - b.id : b.id - a.id
  })

  return list
})

const ownerOptions = computed(() => {
  const owners = new Set(projects.value.map(item => item.owner))
  return ['all', ...owners]
})

function resetFilters() {
  filters.keyword = ''
  filters.status = 'all'
  filters.owner = 'all'
  sortState.key = 'updated'
  sortState.ascending = false
}

function toggleFavorite(id: number) {
  const target = projects.value.find(item => item.id === id)
  if (!target)
    return

  target.favorite = !target.favorite
}

function handleSortChange(option: { value: string }) {
  if (sortState.key === option.value) {
    sortState.ascending = !sortState.ascending
  }
  else {
    sortState.key = option.value as typeof sortState.key
    sortState.ascending = false
  }
}

function openProjectDetail(project: { name: string }) {
  uni.showToast({
    title: `${project.name} - 可在此接入路由`,
    icon: 'none',
  })
}

function triggerSearch() {
  uni.showToast({
    title: filters.keyword ? `已应用「${filters.keyword}」关键词` : '筛选条件已更新',
    icon: 'none',
  })
}
</script>

<template>
  <scroll-view scroll-y class="h-full box-border">
    <view class="box-border p-4">
      <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <text class="text-5 font-bold text-gray-900 dark:text-gray-100">
          __PAGE_TITLE__
        </text>
        <text class="mt-1 block text-3 text-gray-500">
          通过筛选、排序快速定位负责的项目，并查看状态
        </text>
      </view>

      <view class="mt-4 space-y-4 rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <view class="flex flex-col gap-3 md:flex-row md:items-center">
          <view class="flex-1">
            <wd-input
              v-model="filters.keyword"
              placeholder="输入关键词，支持项目名、简介"
              clearable
            />
          </view>
          <view class="flex gap-2">
            <wd-button type="primary" @click="triggerSearch">
              搜索
            </wd-button>
            <wd-button type="default" plain @click="resetFilters">
              重置
            </wd-button>
          </view>
        </view>

        <view class="flex flex-wrap items-center gap-2">
          <text class="text-3 text-gray-500">
            状态：
          </text>
          <view
            v-for="option in statusOptions"
            :key="option.value"
            class="rounded-full px-3 py-1 text-3"
            :class="[
              option.value === filters.status
                ? 'bg-[var(--wot-color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
            ]"
            @click="filters.status = option.value"
          >
            {{ option.label }}
          </view>
        </view>

        <view class="flex flex-wrap items-center gap-2">
          <text class="text-3 text-gray-500">
            团队：
          </text>
          <view
            v-for="owner in ownerOptions"
            :key="owner"
            class="rounded-full px-3 py-1 text-3"
            :class="[
              owner === filters.owner
                ? 'bg-[var(--wot-color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
            ]"
            @click="filters.owner = owner"
          >
            {{ owner === 'all' ? '全部团队' : owner }}
          </view>
        </view>

        <view class="flex flex-wrap items-center gap-2">
          <text class="text-3 text-gray-500">
            排序：
          </text>
          <view
            v-for="option in sortOptions"
            :key="option.value"
            class="flex items-center gap-1 rounded-full px-3 py-1 text-3"
            :class="[
              option.value === sortState.key
                ? 'bg-[var(--wot-color-primary)] text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
            ]"
            @click="handleSortChange(option)"
          >
            <text>{{ option.label }}</text>
            <wd-icon
              v-if="option.value === sortState.key"
              :name="sortState.ascending ? 'arrow-up' : 'arrow-down'"
              size="14px"
              color="#fff"
            />
          </view>
        </view>
      </view>

      <view class="mt-4 space-y-3">
        <view
          v-for="project in sortedProjects"
          :key="project.id"
          class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]"
          @click="openProjectDetail(project)"
        >
          <view class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <view class="flex-1">
              <view class="flex items-center gap-2">
                <text class="text-4 font-semibold text-gray-900 dark:text-gray-100">
                  {{ project.name }}
                </text>
                <view
                  class="rounded-full px-2 py-0.5 text-2 text-white"
                  :class="{
                    'bg-emerald-500': project.status === 'finished',
                    'bg-sky-500': project.status === 'processing',
                    'bg-amber-500': project.status === 'pending',
                  }"
                >
                  {{ project.status === 'finished' ? '已完成' : project.status === 'processing' ? '进行中' : '待启动' }}
                </view>
              </view>
              <text class="mt-2 block text-3 leading-relaxed text-gray-600 dark:text-gray-300">
                {{ project.summary }}
              </text>

              <view class="mt-3 flex flex-wrap items-center gap-2 text-3 text-gray-500">
                <view class="flex items-center gap-1">
                  <wd-icon name="friends" size="14px" color="#666" />
                  <text>{{ project.owner }}</text>
                </view>
                <view class="flex items-center gap-1">
                  <wd-icon name="clock" size="14px" color="#666" />
                  <text>截止：{{ project.deadline }}</text>
                </view>
                <view class="flex items-center gap-1">
                  <wd-icon name="time" size="14px" color="#666" />
                  <text>更新：{{ project.updatedAt }}</text>
                </view>
              </view>

              <view class="mt-3 flex flex-wrap gap-2">
                <view
                  v-for="tag in project.tags"
                  :key="tag"
                  class="rounded-full bg-gray-100 px-3 py-1 text-3 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  #{{ tag }}
                </view>
              </view>
            </view>

            <view class="flex flex-col items-end justify-between">
              <wd-button
                size="small"
                type="primary"
                :plain="!project.favorite"
                @click.stop="toggleFavorite(project.id)"
              >
                {{ project.favorite ? '取消收藏' : '收藏' }}
              </wd-button>
              <text class="text-3 text-gray-400">
                优先级：{{ project.priority + 1 }} 级
              </text>
            </view>
          </view>
        </view>

        <view v-if="!sortedProjects.length" class="rounded-3 bg-white p-8 text-center text-gray-500">
          暂无数据，可调整筛选条件后重试
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
