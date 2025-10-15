import { defineStore } from 'pinia'
import { fetch__PASCAL_NAME__List, fetch__PASCAL_NAME__Overview } from '@/api/__KEBAB_NAME__'

interface ItemRecord {
  id: number
  name: string
  description: string
  tags: string[]
  status: 'processing' | 'pending' | 'finished'
  updatedAt: string
}

interface Overview {
  name: string
  description: string
  total: number
  processing: number
  done: number
}

export const use__PASCAL_NAME__Store = defineStore('__KEBAB_NAME__', () => {
  const loading = ref(false)
  const overview = ref<Overview>({
    name: '__PAGE_TITLE__',
    description: '这里展示模块概览，可根据实际业务调整文案',
    total: 0,
    processing: 0,
    done: 0,
  })
  const items = ref<ItemRecord[]>([])
  const filters = reactive({
    keyword: '',
    status: 'all',
  })

  const statusOptions = [
    { label: '全部', value: 'all' },
    { label: '进行中', value: 'processing' },
    { label: '待处理', value: 'pending' },
    { label: '已完成', value: 'finished' },
  ]

  async function bootstrap() {
    try {
      loading.value = true
      const [overviewData, list] = await Promise.all([
        fetch__PASCAL_NAME__Overview(),
        fetch__PASCAL_NAME__List({
          keyword: filters.keyword,
          status: filters.status,
        }),
      ])
      overview.value = overviewData
      items.value = list
    }
    finally {
      loading.value = false
    }
  }

  function updateStatus(value: string) {
    filters.status = value
    bootstrap()
  }

  function updateKeyword(value: string) {
    filters.keyword = value
    bootstrap()
  }

  return {
    loading,
    overview,
    items,
    filters,
    statusOptions,
    bootstrap,
    updateStatus,
    updateKeyword,
  }
})
