<script setup lang="ts">
definePage({
  name: '__PAGE_NAME__',
  // __LAYOUT_PLACEHOLDER__
  style: {
    navigationBarTitleText: '__PAGE_TITLE__',
  },
})

const steps = ['基础信息', '功能配置', '结果确认']
const currentStep = ref(0)

const baseForm = reactive({
  appName: '',
  contact: '',
  phone: '',
})

const configForm = reactive({
  needAnalytics: true,
  needNotify: false,
  needLogin: true,
  description: '请描述要实现的核心功能与交付目标',
})

const confirmAgree = ref(false)

const errors = reactive<{ [key: string]: string }>({})

const previewResult = computed(() => ({
  ...baseForm,
  ...configForm,
  modules: [
    configForm.needLogin && '身份体系',
    configForm.needAnalytics && '数据分析',
    configForm.needNotify && '消息通知',
  ].filter(Boolean),
}))

function nextStep() {
  if (currentStep.value === 0 && !validateBaseForm())
    return
  if (currentStep.value === 1 && !validateConfigForm())
    return

  currentStep.value = Math.min(currentStep.value + 1, steps.length - 1)
}

function prevStep() {
  currentStep.value = Math.max(currentStep.value - 1, 0)
}

function validateBaseForm() {
  errors.appName = baseForm.appName.trim() ? '' : '请输入项目名称'
  errors.contact = baseForm.contact.trim() ? '' : '请输入联系人'
  errors.phone = baseForm.phone.trim() ? '' : '请输入联系方式'
  return !errors.appName && !errors.contact && !errors.phone
}

function validateConfigForm() {
  errors.description = configForm.description.trim() ? '' : '请补充需求描述'
  return !errors.description
}

function submitForm() {
  if (!confirmAgree.value) {
    uni.showToast({ title: '请先勾选确认信息', icon: 'none' })
    return
  }

  uni.showToast({
    title: '提交成功，已生成基础模版',
    icon: 'success',
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
          逐步收集需求信息，生成交付所需的页面和模块
        </text>
      </view>

      <view class="mt-4 rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <view class="flex flex-col gap-3 md:flex-row md:items-center">
          <view
            v-for="(step, index) in steps"
            :key="step"
            class="flex flex-1 items-center gap-2"
          >
            <view
              class="flex h-8 w-8 items-center justify-center rounded-full text-3"
              :class="index <= currentStep ? 'bg-[var(--wot-color-primary)] text-white' : 'bg-gray-200 text-gray-500'"
            >
              {{ index + 1 }}
            </view>
            <text
              class="text-3"
              :class="index <= currentStep ? 'text-[var(--wot-color-primary)]' : 'text-gray-500'"
            >
              {{ step }}
            </text>
            <view v-if="index < steps.length - 1" class="hidden flex-1 border-t border-dashed border-gray-200 md:block" />
          </view>
        </view>
      </view>

      <view class="mt-4 rounded-3 bg-white p-4 shadow-sm dark:bg-[var(--wot-dark-background2)]">
        <view v-show="currentStep === 0" class="space-y-4">
          <view>
            <text class="block text-4 font-medium text-gray-900 dark:text-gray-100">
              项目信息
            </text>
            <text class="text-3 text-gray-500">
              便于确认交付范围和沟通方式
            </text>
          </view>

          <wd-cell-group border>
            <wd-cell title="项目名称" custom-class="items-start">
              <view class="flex-1">
                <wd-input
                  v-model="baseForm.appName"
                  placeholder="请输入项目名称，如 B 端管理后台"
                  clearable
                />
                <text v-if="errors.appName" class="mt-1 block text-3 text-rose-500">
                  {{ errors.appName }}
                </text>
              </view>
            </wd-cell>
            <wd-cell title="联系人" custom-class="items-start">
              <view class="flex-1">
                <wd-input v-model="baseForm.contact" placeholder="请输入联系人姓名" clearable />
                <text v-if="errors.contact" class="mt-1 block text-3 text-rose-500">
                  {{ errors.contact }}
                </text>
              </view>
            </wd-cell>
            <wd-cell title="联系方式" custom-class="items-start">
              <view class="flex-1">
                <wd-input v-model="baseForm.phone" placeholder="请输入手机号或微信号" clearable />
                <text v-if="errors.phone" class="mt-1 block text-3 text-rose-500">
                  {{ errors.phone }}
                </text>
              </view>
            </wd-cell>
          </wd-cell-group>
        </view>

        <view v-show="currentStep === 1" class="space-y-4">
          <view>
            <text class="block text-4 font-medium text-gray-900 dark:text-gray-100">
              功能模块
            </text>
            <text class="text-3 text-gray-500">
              选择常用模块，加速后续搭建
            </text>
          </view>

          <view class="space-y-3">
            <view class="flex items-center justify-between rounded-2 border border-gray-100 p-3 dark:border-gray-700">
              <view>
                <text class="block text-4 text-gray-900 dark:text-gray-100">
                  身份体系
                </text>
                <text class="text-3 text-gray-500">
                  包含登录注册、角色权限等基础能力
                </text>
              </view>
              <wd-switch v-model="configForm.needLogin" />
            </view>

            <view class="flex items-center justify-between rounded-2 border border-gray-100 p-3 dark:border-gray-700">
              <view>
                <text class="block text-4 text-gray-900 dark:text-gray-100">
                  数据分析
                </text>
                <text class="text-3 text-gray-500">
                  默认集成图表组件和统计卡片
                </text>
              </view>
              <wd-switch v-model="configForm.needAnalytics" />
            </view>

            <view class="flex items-center justify-between rounded-2 border border-gray-100 p-3 dark:border-gray-700">
              <view>
                <text class="block text-4 text-gray-900 dark:text-gray-100">
                  消息通知
                </text>
                <text class="text-3 text-gray-500">
                  内置任务提醒与全局消息弹层
                </text>
              </view>
              <wd-switch v-model="configForm.needNotify" />
            </view>
          </view>

          <view class="mt-4">
            <text class="block text-4 font-medium text-gray-900 dark:text-gray-100">
              需求描述
            </text>
            <view class="mt-2 rounded-2 border border-gray-200 bg-gray-50 p-3 text-3 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <textarea
                v-model="configForm.description"
                class="h-28 w-full resize-none bg-transparent"
                placeholder="补充关键业务流程、集成要求、交付节奏等信息"
              />
            </view>
            <text v-if="errors.description" class="mt-1 block text-3 text-rose-500">
              {{ errors.description }}
            </text>
          </view>
        </view>

        <view v-show="currentStep === 2" class="space-y-4">
          <view>
            <text class="block text-4 font-medium text-gray-900 dark:text-gray-100">
              信息确认
            </text>
            <text class="text-3 text-gray-500">
              核对配置，确认后自动生成模版
            </text>
          </view>

          <view class="space-y-2 rounded-2 border border-gray-100 p-3 text-3 text-gray-600 dark:border-gray-700 dark:text-gray-200">
            <view class="flex justify-between">
              <text>项目名称</text>
              <text class="font-medium text-gray-900 dark:text-gray-100">
                {{ previewResult.appName || '待填写' }}
              </text>
            </view>
            <view class="flex justify-between">
              <text>联系人</text>
              <text class="font-medium text-gray-900 dark:text-gray-100">
                {{ previewResult.contact || '待填写' }}
              </text>
            </view>
            <view class="flex justify-between">
              <text>核心模块</text>
              <text class="font-medium text-gray-900 dark:text-gray-100">
                {{ previewResult.modules.length ? previewResult.modules.join('、') : '未选择' }}
              </text>
            </view>
            <view>
              <text class="block text-gray-500">
                需求说明
              </text>
              <text class="mt-1 block text-gray-900 dark:text-gray-100">
                {{ previewResult.description }}
              </text>
            </view>
          </view>

          <view class="flex items-center gap-2 rounded-2 bg-gray-100 p-3 text-3 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
            <wd-switch v-model="confirmAgree" />
            <text>
              我已确认信息准确，并了解生成模版后需要根据业务进一步调整
            </text>
          </view>
        </view>

        <view class="mt-6 flex items-center justify-between">
          <wd-button :disabled="currentStep === 0" @click="prevStep">
            上一步
          </wd-button>
          <wd-button
            v-if="currentStep < steps.length - 1"
            type="primary"
            @click="nextStep"
          >
            下一步
          </wd-button>
          <wd-button v-else type="primary" @click="submitForm">
            提交生成
          </wd-button>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped>
scroll-view {
  height: 100vh;
}

textarea {
  outline: none;
}
</style>
