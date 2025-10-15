<script setup lang="ts">
definePage({
  name: '__PAGE_NAME__',
  // __LAYOUT_PLACEHOLDER__
  style: {
    navigationBarTitleText: '__PAGE_TITLE__',
  },
})

const rangeOptions = ['本周', '本月', '本季度']
const activeRange = ref(rangeOptions[0])

const overviewMetrics = ref([
  { key: 'revenue', label: '今日成交额', value: '¥128,420', delta: '+18.6%', deltaType: 'up' },
  { key: 'orders', label: '新增订单', value: '312', delta: '+42', deltaType: 'up' },
  { key: 'customers', label: '新增客户', value: '58', delta: '+9', deltaType: 'up' },
  { key: 'refund', label: '退款率', value: '1.4%', delta: '-0.3%', deltaType: 'down' },
])

const quickActions = [
  { key: 'campaign', label: '创建活动', icon: 'add', hint: '3 个模板可用' },
  { key: 'report', label: '导出报表', icon: 'share', hint: '支持 Excel/CSV' },
  { key: 'member', label: '邀请成员', icon: 'friends', hint: '已邀请 5 人' },
]

const projectHighlights = ref([
  {
    name: '智慧零售增长计划',
    owner: '产品团队',
    progress: 0.78,
    status: '进行中',
    deadline: '剩余 6 天',
  },
  {
    name: '会员系统重构',
    owner: '技术平台组',
    progress: 0.54,
    status: '规划中',
    deadline: '待排期',
  },
  {
    name: '支付体验优化',
    owner: '增长团队',
    progress: 0.92,
    status: '即将完成',
    deadline: '本周内',
  },
])

const todoItems = ref([
  { id: 1, title: '审核新的渠道投放计划', owner: '王琳', finished: false },
  { id: 2, title: '确认 6 月增长数据', owner: '赵云', finished: true },
  { id: 3, title: '同步会员版本发布说明', owner: '产品团队', finished: false },
  { id: 4, title: '准备季度复盘材料', owner: '运营团队', finished: false },
])

const announcements = [
  { id: 1, title: '平台将在本周日凌晨进行系统升级维护', time: '今天 08:30', tag: '系统' },
  { id: 2, title: '广告渠道返利活动上线，查看详情了解投放规则', time: '昨天 21:10', tag: '市场' },
  { id: 3, title: '新绩效看板已发布，欢迎体验并反馈建议', time: '昨天 14:05', tag: '公告' },
]

const completedRate = computed(() => {
  if (!todoItems.value.length)
    return 0

  const finished = todoItems.value.filter(item => item.finished).length
  return Math.round((finished / todoItems.value.length) * 100)
})

function setActiveRange(option: string) {
  activeRange.value = option
}

function toggleTodo(itemId: number) {
  const target = todoItems.value.find(item => item.id === itemId)
  if (!target)
    return

  target.finished = !target.finished
}

function handleQuickAction(action: { label: string }) {
  uni.showToast({
    title: `${action.label} - 待接入业务逻辑`,
    icon: 'none',
  })
}
</script>

<template>
  <scroll-view scroll-y class="h-full box-border">
    <view class="box-border p-4">
      <view class="mb-4 rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <view class="flex items-center justify-between">
          <view>
            <text class="block text-5 font-bold text-gray-900 dark:text-gray-100">
              __PAGE_TITLE__
            </text>
            <text class="mt-1 block text-3 text-gray-500">
              掌握实时经营数据，快速安排团队工作
            </text>
          </view>
          <view class="hidden items-center gap-2 md:flex">
            <view
              v-for="option in rangeOptions"
              :key="option"
              class="rounded-full px-3 py-1 text-3"
              :class="[
                option === activeRange
                  ? 'bg-[var(--wot-color-primary)] text-white'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
              ]"
              @click="setActiveRange(option)"
            >
              {{ option }}
            </view>
          </view>
        </view>

        <view class="mt-4 flex gap-2 md:hidden">
          <picker :range="rangeOptions" @change="setActiveRange(rangeOptions[$event.detail.value])">
            <view class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-3 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              <wd-icon name="calendar" size="16px" />
              <text>{{ activeRange }}</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="grid gap-3 md:grid-cols-2">
        <view
          v-for="metric in overviewMetrics"
          :key="metric.key"
          class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]"
        >
          <view class="flex items-center justify-between">
            <text class="text-3 text-gray-500">
              {{ metric.label }}
            </text>
            <wd-icon
              :name="metric.key === 'refund' ? 'warning' : 'success'
              "
              size="18px"
              :color="metric.key === 'refund' ? '#f97316' : '#3b82f6'"
            />
          </view>
          <text class="mt-2 block text-6 font-bold text-gray-900 dark:text-gray-100">
            {{ metric.value }}
          </text>
          <text
            class="mt-1 block text-3"
            :class="metric.deltaType === 'up' ? 'text-emerald-500' : 'text-rose-500'"
          >
            {{ metric.delta }}
          </text>
        </view>
      </view>

      <view class="mt-4 grid gap-4 lg:grid-cols-3">
        <view class="lg:col-span-2">
          <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
            <view class="flex items-center justify-between">
              <text class="text-4 font-semibold text-gray-900 dark:text-gray-100">
                团队重点项目
              </text>
              <text class="text-3 text-gray-500">
                共 {{ projectHighlights.length }} 项
              </text>
            </view>

            <view class="mt-3 space-y-3">
              <view
                v-for="project in projectHighlights"
                :key="project.name"
                class="rounded-2 border border-gray-100 p-3 dark:border-gray-700"
              >
                <view class="flex items-center justify-between">
                  <view>
                    <text class="block text-4 font-medium text-gray-900 dark:text-gray-100">
                      {{ project.name }}
                    </text>
                    <text class="mt-1 block text-3 text-gray-500">
                      负责人：{{ project.owner }} · {{ project.status }}
                    </text>
                  </view>
                  <text class="text-3 text-gray-400">
                    {{ project.deadline }}
                  </text>
                </view>

                <view class="mt-3 h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  <view
                    class="h-full rounded-full bg-[var(--wot-color-primary)]"
                    :style="{ width: `${Math.round(project.progress * 100)}%` }"
                  />
                </view>
                <text class="mt-1 block text-3 text-gray-500">
                  已完成 {{ Math.round(project.progress * 100) }}%
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="space-y-4">
          <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
            <text class="text-4 font-semibold text-gray-900 dark:text-gray-100">
              快捷操作
            </text>
            <view class="mt-3 space-y-2">
              <view
                v-for="action in quickActions"
                :key="action.key"
                class="flex items-center justify-between rounded-2 border border-gray-100 px-3 py-2 dark:border-gray-700"
                @click="handleQuickAction(action)"
              >
                <view>
                  <text class="block text-4 text-gray-900 dark:text-gray-100">
                    {{ action.label }}
                  </text>
                  <text class="text-3 text-gray-500">
                    {{ action.hint }}
                  </text>
                </view>
                <wd-icon name="arrow-right" size="18px" color="#999" />
              </view>
            </view>
          </view>

          <view class="rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
            <text class="text-4 font-semibold text-gray-900 dark:text-gray-100">
              待办事项
            </text>
            <text class="mt-1 block text-3 text-gray-500">
              已完成 {{ completedRate }}%
            </text>
            <view class="mt-3 space-y-2">
              <view
                v-for="item in todoItems"
                :key="item.id"
                class="flex items-start justify-between rounded-2 border border-gray-100 px-3 py-2 dark:border-gray-700"
              >
                <view class="pr-2">
                  <text
                    class="block text-4"
                    :class="item.finished ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-gray-100'"
                  >
                    {{ item.title }}
                  </text>
                  <text class="text-3 text-gray-500">
                    负责人：{{ item.owner }}
                  </text>
                </view>
                <wd-button
                  size="small"
                  type="primary"
                  :plain="!item.finished"
                  @click="toggleTodo(item.id)"
                >
                  {{ item.finished ? '撤销' : '完成' }}
                </wd-button>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="mt-4 rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <view class="flex items-center justify-between">
          <text class="text-4 font-semibold text-gray-900 dark:text-gray-100">
            最新公告
          </text>
          <text class="text-3 text-gray-500">
            共 {{ announcements.length }} 条
          </text>
        </view>

        <view class="mt-3 space-y-2">
          <view
            v-for="item in announcements"
            :key="item.id"
            class="flex items-center justify-between rounded-2 border border-gray-100 px-3 py-2 dark:border-gray-700"
          >
            <view class="flex-1 pr-3">
              <text class="block text-4 text-gray-900 dark:text-gray-100">
                {{ item.title }}
              </text>
              <text class="text-3 text-gray-500">
                {{ item.time }} · {{ item.tag }}
              </text>
            </view>
            <wd-icon name="arrow-right" size="18px" color="#999" />
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
