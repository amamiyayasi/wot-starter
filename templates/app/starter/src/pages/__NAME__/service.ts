export interface __NAME_PASCAL__Overview {
  revenue: number
  orders: number
  conversion: number
  satisfaction: number
}

export interface __NAME_PASCAL__Task {
  id: number
  title: string
  owner: string
  progress: number
  updatedAt: string
}

export interface __NAME_PASCAL__Preference {
  key: string
  label: string
  description: string
  value: boolean
}

export async function fetch__NAME_PASCAL__Overview(): Promise<__NAME_PASCAL__Overview> {
  await new Promise((resolve) => setTimeout(resolve, 320))
  return {
    revenue: 168000,
    orders: 420,
    conversion: 12.4,
    satisfaction: 96,
  }
}

export async function fetch__NAME_PASCAL__Tasks(): Promise<__NAME_PASCAL__Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 320))
  return [
    {
      id: 1,
      title: '梳理版本需求并输出排期',
      owner: 'Iris',
      progress: 80,
      updatedAt: '2025-07-02',
    },
    {
      id: 2,
      title: '完善接口文档与 Mock 数据',
      owner: 'Chen',
      progress: 65,
      updatedAt: '2025-07-01',
    },
    {
      id: 3,
      title: '完成小程序端样式联调',
      owner: 'Lee',
      progress: 45,
      updatedAt: '2025-06-30',
    },
  ]
}

export function createDefaultPreferences(): __NAME_PASCAL__Preference[] {
  return [
    {
      key: 'autoSync',
      label: '自动同步云端',
      description: '联网后自动拉取最新配置与数据。',
      value: true,
    },
    {
      key: 'notify',
      label: '版本更新提醒',
      description: '关键节点推送消息提醒，避免遗漏。',
      value: true,
    },
    {
      key: 'showGuide',
      label: '显示操作指引',
      description: '为新成员展示功能引导和操作提示。',
      value: false,
    },
  ]
}
