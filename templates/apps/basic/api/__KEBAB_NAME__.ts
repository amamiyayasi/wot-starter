interface FetchParams {
  keyword: string
  status: string
}

export async function fetch__PASCAL_NAME__Overview() {
  return {
    name: '__PAGE_TITLE__',
    description: '这里是模块的简介，生成后可替换为真实的业务说明',
    total: 18,
    processing: 7,
    done: 9,
  }
}

export async function fetch__PASCAL_NAME__List(params: FetchParams) {
  const source = [
    {
      id: 1,
      name: '渠道数据治理',
      description: '聚合多渠道线索，并对脏数据进行清洗与重分配',
      tags: ['数据', '治理'],
      status: 'processing',
      updatedAt: '5 分钟前',
    },
    {
      id: 2,
      name: '增长实验平台',
      description: '沉淀 AB 实验流程，可视化实验数据与转化指标',
      tags: ['实验', '可视化'],
      status: 'pending',
      updatedAt: '1 小时前',
    },
    {
      id: 3,
      name: '会员体系升级',
      description: '重构等级权益体系，接入积分商城与任务激励',
      tags: ['会员', '小程序'],
      status: 'finished',
      updatedAt: '昨天 19:20',
    },
  ]

  return source.filter((item) => {
    const keyword = params.keyword.trim().toLowerCase()
    const keywordMatch = !keyword
      || item.name.toLowerCase().includes(keyword)
      || item.description.toLowerCase().includes(keyword)

    const statusMatch = params.status === 'all' || item.status === params.status
    return keywordMatch && statusMatch
  })
}
