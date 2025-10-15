<script setup lang="ts">
definePage({
  name: '__NAME_CAMEL__',
  style: {
    navigationBarTitleText: '__TITLE__',
    navigationBarBackgroundColor: '#ffffff',
  },
})

const highlights = [
  {
    title: '业务目标',
    description:
      '清晰拆分业务目标，快速梳理需求范围，帮助对齐交付预期。',
  },
  {
    title: '技术栈',
    description: '基于 Vue 3 + UniApp + WotUI，覆盖多端统一体验。',
  },
  {
    title: '交付节奏',
    description:
      '通过模版化快速产出页面骨架，降低重复工作量。',
  },
]

const quickActions = [
  {
    label: '完善需求',
    description: '同步需求文档或原型地址。',
  },
  {
    label: '设计页面',
    description: '根据模块拆分建立页面结构。',
  },
  {
    label: '对接接口',
    description: '整理接口协议、Mock 数据和联调计划。',
  },
]

function handleAction(action: (typeof quickActions)[number]) {
  console.log(`🚀 ${action.label} 已触发，请在此处接入实际逻辑。`)
}
</script>

<template>
  <scroll-view class="page" scroll-y>
    <view class="section">
      <text class="section__title">__TITLE__</text>
      <text class="section__subtitle">
        为即将交付的业务快速搭建落地页骨架，沉淀复用内容，提升迭代效率。
      </text>
    </view>

    <view class="section">
      <text class="section__heading">项目要点</text>
      <view class="grid">
        <view v-for="item in highlights" :key="item.title" class="card">
          <text class="card__title">{{ item.title }}</text>
          <text class="card__description">{{ item.description }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section__heading">快速操作</text>
      <wd-cell-group border custom-class="rounded-3 overflow-hidden">
        <wd-cell
          v-for="action in quickActions"
          :key="action.label"
          center
          :title="action.label"
          :label="action.description"
          is-link
          @click="handleAction(action)"
        />
      </wd-cell-group>
    </view>

    <view class="section">
      <wd-button type="primary" block @click="handleAction(quickActions[0])">
        立即开始规划
      </wd-button>
      <wd-button class="mt-3" plain block @click="handleAction(quickActions[1])">
        查看设计交付清单
      </wd-button>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx 24rpx 48rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #ffffff 0%, #f7f8fa 100%);
}

.section {
  margin-bottom: 48rpx;

  &__title {
    display: block;
    margin-bottom: 12rpx;
    font-size: 36rpx;
    font-weight: 600;
    color: #1f2933;
  }

  &__subtitle {
    display: block;
    color: #52606d;
    font-size: 28rpx;
    line-height: 1.6;
  }

  &__heading {
    display: block;
    margin-bottom: 20rpx;
    color: #111827;
    font-weight: 600;
    font-size: 30rpx;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260rpx, 1fr));
  gap: 20rpx;
}

.card {
  padding: 24rpx;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.06);

  &__title {
    display: block;
    margin-bottom: 12rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #111827;
  }

  &__description {
    display: block;
    font-size: 26rpx;
    line-height: 1.6;
    color: #4b5563;
  }
}
</style>
