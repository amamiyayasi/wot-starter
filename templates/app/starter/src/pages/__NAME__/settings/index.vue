<script setup lang="ts">
import { computed, ref } from 'vue'
import { use__NAME_PASCAL__Store } from '@/store/use__NAME_PASCAL__Store'

const store = use__NAME_PASCAL__Store()

const preferences = computed(() => store.preferences)
const themeColor = ref(store.themeColor)

const colorOptions = [
  '#6366f1',
  '#0ea5e9',
  '#22c55e',
  '#f97316',
  '#ec4899',
]

definePage({
  name: '__NAME_CAMEL__Settings',
  style: {
    navigationBarTitleText: '__TITLE__ - 设置',
  },
})

function togglePreference(prefKey: string, payload: boolean | { value: boolean }) {
  const nextValue = typeof payload === 'boolean' ? payload : payload?.value
  if (typeof nextValue === 'boolean')
    store.updatePreference(prefKey, nextValue)
}

function handleColorSelect(color: string) {
  themeColor.value = color
  store.setThemeColor(color)
  uni.showToast({ title: `主题色 ${color} 已应用`, icon: 'none' })
}
</script>

<template>
  <scroll-view class="page" scroll-y>
    <view class="group">
      <text class="group__title">通知与协作</text>
      <wd-cell-group border custom-class="rounded-3 overflow-hidden">
        <wd-cell
          v-for="item in preferences"
          :key="item.key"
          center
          :title="item.label"
          :label="item.description"
        >
          <template #value>
            <wd-switch
              :model-value="item.value"
              size="18px"
              @change="togglePreference(item.key, $event.value)"
            />
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>

    <view class="group">
      <text class="group__title">主题定制</text>
      <view class="color-picker">
        <view
          v-for="color in colorOptions"
          :key="color"
          class="color-picker__item"
          :class="{ 'color-picker__item--active': color === themeColor }"
          :style="{ backgroundColor: color }"
          @click="handleColorSelect(color)"
        >
          <wd-icon
            v-if="color === themeColor"
            name="check"
            color="#ffffff"
            size="18px"
          />
        </view>
      </view>
      <text class="group__tips">选择主题色后，可在页面中通过 store.themeColor 引用。</text>
    </view>

    <view class="group">
      <text class="group__title">数据管理</text>
      <wd-button block plain @click="store.bootstrap()">
        重新同步看板数据
      </wd-button>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 24rpx 24rpx 48rpx;
  background: #f9fafb;
  box-sizing: border-box;
}

.group {
  margin-bottom: 36rpx;

  &__title {
    display: block;
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #111827;
  }

  &__tips {
    display: block;
    margin-top: 16rpx;
    color: #6b7280;
    font-size: 24rpx;
  }
}

.color-picker {
  display: flex;
  gap: 16rpx;

  &__item {
    width: 68rpx;
    height: 68rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 24rpx rgba(17, 24, 39, 0.18);
    opacity: 0.7;

    &--active {
      opacity: 1;
      transform: translateY(-6rpx);
    }
  }
}
</style>
