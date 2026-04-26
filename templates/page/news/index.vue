<script setup lang="ts">
definePage({
  name: '__NAME_CAMEL__News',
  style: {
    navigationBarTitleText: '__TITLE__',
    navigationBarBackgroundColor: '#ffffff',
  },
})

const tabs = [
  { label: '大公司', value: 'corporate' },
  { label: '内容', value: 'content' },
  { label: '消费', value: 'consumer' },
  { label: '娱乐', value: 'entertainment' },
  { label: '区块链', value: 'blockchain' },
]

const activeTab = ref(tabs[0].value)

interface NewsItem {
  id: string
  title: string
  description: string
  source: string
  commentText: string
  timeText: string
  cover: string
  category: (typeof tabs)[number]['value']
}

const newsList = reactive<NewsItem[]>([
  {
    id: 'tencent-ai',
    title: '阿里思考方式真正厉害了，内部员工 7000 字深度干货',
    description: '腾讯需要的不是旧 NS，它需要的是一款全新的“动森”。',
    source: '36 氪',
    commentText: '0 评论',
    timeText: '5 年前',
    cover: 'https://cdn.wot-design-uni.net/static/news/news-ali.jpg',
    category: 'corporate',
  },
  {
    id: 'tencent-game',
    title: '腾讯云游戏免费两个月，我正在犹豫要不要续费',
    description: '云游戏体验升级，热门大作即可一键畅玩。',
    source: '腾讯新闻',
    commentText: '18 评论',
    timeText: '3 年前',
    cover: 'https://cdn.wot-design-uni.net/static/news/news-game.jpg',
    category: 'entertainment',
  },
  {
    id: 'netease-edu',
    title: '网易课堂向小学生开放：补课、社交与隐私焦虑',
    description: '教育产品继续向低龄化渗透，家长们怎么看？',
    source: '界面新闻',
    commentText: '6 评论',
    timeText: '2 年前',
    cover: 'https://cdn.wot-design-uni.net/static/news/news-edu.jpg',
    category: 'content',
  },
  {
    id: 'weibo-tools',
    title: '微信有几次大改版？你可能还不知道的十个小功能',
    description: '社交产品的小细节，决定了用户体验的温度。',
    source: '极客公园',
    commentText: '23 评论',
    timeText: '1 年前',
    cover: 'https://cdn.wot-design-uni.net/static/news/news-wechat.jpg',
    category: 'consumer',
  },
  {
    id: 'metaverse',
    title: '元宇宙风口冷了吗？看看区块链行业的新故事',
    description: '链游、社交与虚拟空间正在找到新的商业节奏。',
    source: '白鲸出海',
    commentText: '5 评论',
    timeText: '11 个月前',
    cover: 'https://cdn.wot-design-uni.net/static/news/news-chain.jpg',
    category: 'blockchain',
  },
])

const filteredNews = computed(() =>
  newsList.filter((item) => item.category === activeTab.value),
)

function handleTabChange(tab: (typeof tabs)[number]) {
  activeTab.value = tab.value
}

function handleNewsTap(item: NewsItem) {
  console.log('📰 打开新闻：', item)
}
</script>

<template>
  <scroll-view class="page" scroll-y>
    <view class="hero">
      <view class="hero__title">新闻资讯</view>
      <view class="hero__subtitle">最新行业热点与深度观察</view>
      <view class="hero__tabs">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="hero__tab"
          :class="{ 'hero__tab--active': activeTab === tab.value }"
          @click="handleTabChange(tab)"
        >
          {{ tab.label }}
        </view>
      </view>
    </view>

    <view class="list">
      <view
        v-for="item in filteredNews"
        :key="item.id"
        class="news-card"
        @click="handleNewsTap(item)"
      >
        <image class="news-card__cover" :src="item.cover" mode="aspectFill" />
        <view class="news-card__content">
          <text class="news-card__title">{{ item.title }}</text>
          <text class="news-card__desc">{{ item.description }}</text>
          <view class="news-card__meta">
            <text class="news-card__meta-text">{{ item.source }}</text>
            <text class="news-card__dot" />
            <text class="news-card__meta-text">{{ item.commentText }}</text>
            <text class="news-card__dot" />
            <text class="news-card__meta-text">{{ item.timeText }}</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 0 24rpx 48rpx;
  box-sizing: border-box;
  background: #f5f7fb;
}

.hero {
  margin: 24rpx 0 32rpx;
  padding: 48rpx 40rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, #3a7bff 0%, #4c5fff 100%);
  color: #ffffff;

  &__title {
    font-size: 40rpx;
    font-weight: 600;
    margin-bottom: 12rpx;
  }

  &__subtitle {
    font-size: 26rpx;
    opacity: 0.88;
    margin-bottom: 36rpx;
  }

  &__tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  &__tab {
    padding: 12rpx 28rpx;
    border-radius: 999rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.86);
    background: rgba(255, 255, 255, 0.16);
    transition: all 0.2s ease;

    &--active {
      color: #3750ff;
      background: #ffffff;
      font-weight: 600;
    }
  }
}

.list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.news-card {
  display: flex;
  gap: 24rpx;
  padding: 28rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.08);

  &__cover {
    width: 160rpx;
    height: 160rpx;
    border-radius: 20rpx;
    background: #e2e8f0;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1f2937;
    line-height: 1.5;
  }

  &__desc {
    font-size: 26rpx;
    color: #4b5563;
    line-height: 1.6;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 24rpx;
    color: #94a3b8;
  }

  &__meta-text {
    display: inline-flex;
  }

  &__dot {
    width: 6rpx;
    height: 6rpx;
    border-radius: 50%;
    background: #cbd5f5;
  }
}
</style>
