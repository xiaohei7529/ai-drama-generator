/**
 * Pinia History Store
 * 统一管理生成历史记录，持久化到 localStorage。
 * 替代原先通过 storage 事件跨组件同步的方案。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ai-drama-history'
const MAX_ITEMS = 200

export const useHistoryStore = defineStore('history', () => {
  const items = ref([])
  const loaded = ref(false)

  function load() {
    if (loaded.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      items.value = raw ? JSON.parse(raw) : []
    } catch {
      items.value = []
    }
    loaded.value = true
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value.slice(0, MAX_ITEMS)))
  }

  /**
   * 新增一条历史记录（头部插入，最新优先）
   * @param {Object} record
   */
  function add(record) {
    if (!loaded.value) load()
    items.value.unshift({
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
    })
    persist()
  }

  /**
   * 删除指定索引的记录
   */
  function remove(index) {
    items.value.splice(index, 1)
    persist()
  }

  /**
   * 清空全部
   */
  function clear() {
    items.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return { items, loaded, load, add, remove, clear }
})
