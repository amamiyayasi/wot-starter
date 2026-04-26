import { defineStore } from 'pinia'
import {
  createDefaultPreferences,
  fetch__NAME_PASCAL__Overview,
  fetch__NAME_PASCAL__Tasks,
  type __NAME_PASCAL__Overview,
  type __NAME_PASCAL__Preference,
  type __NAME_PASCAL__Task,
} from '@/pages/__NAME__/service'

interface __NAME_PASCAL__State {
  overview: __NAME_PASCAL__Overview | null
  tasks: __NAME_PASCAL__Task[]
  preferences: __NAME_PASCAL__Preference[]
  loading: boolean
  themeColor: string
}

export const use__NAME_PASCAL__Store = defineStore('__NAME_CAMEL__', {
  state: (): __NAME_PASCAL__State => ({
    overview: null,
    tasks: [],
    preferences: createDefaultPreferences(),
    loading: false,
    themeColor: '#6366f1',
  }),
  actions: {
    async bootstrap() {
      if (this.loading)
        return
      this.loading = true
      try {
        const [overview, tasks] = await Promise.all([
          fetch__NAME_PASCAL__Overview(),
          fetch__NAME_PASCAL__Tasks(),
        ])
        this.overview = overview
        this.tasks = tasks
      }
      finally {
        this.loading = false
      }
    },
    updatePreference(key: string, value: boolean) {
      this.preferences = this.preferences.map((item) => {
        if (item.key === key)
          return { ...item, value }
        return item
      })
    },
    reorderTask(taskId: number, direction: 'up' | 'down') {
      const index = this.tasks.findIndex((item) => item.id === taskId)
      if (index < 0)
        return
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= this.tasks.length)
        return
      const reordered = [...this.tasks]
      const [removed] = reordered.splice(index, 1)
      reordered.splice(targetIndex, 0, removed)
      this.tasks = reordered
    },
    setThemeColor(color: string) {
      this.themeColor = color
    },
  },
})
