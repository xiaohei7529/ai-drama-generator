/**
 * Pinia Settings Store
 * API Key 通过 Electron IPC 加密存储，渲染层只在内存中持有明文值。
 * 若不在 Electron 环境（如纯浏览器测试），降级为 localStorage。
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const PROVIDERS = {
  dashscope: '通义千问',
  ernie: '文心一言',
  iflytek: '讯飞星火',
}

function isElectron() {
  return typeof window !== 'undefined' && !!window.electronAPI
}

export const useSettingsStore = defineStore('settings', () => {
  const dashscopeApiKey = ref('')
  const ernieApiKey = ref('')
  const iflytekApiKey = ref('')
  const defaultProvider = ref('dashscope')
  const loaded = ref(false)

  const providerName = computed(() => (provider) => PROVIDERS[provider] ?? provider)

  function getApiKey(provider) {
    switch (provider) {
      case 'dashscope': return dashscopeApiKey.value
      case 'ernie':     return ernieApiKey.value
      case 'iflytek':   return iflytekApiKey.value
      default:          return dashscopeApiKey.value
    }
  }

  function hasApiKey(provider) {
    return !!getApiKey(provider)
  }

  async function load() {
    if (loaded.value) return
    let data = {}
    if (isElectron()) {
      data = (await window.electronAPI.getSettings()) ?? {}
    } else {
      try {
        const raw = localStorage.getItem('ai-drama-settings')
        data = raw ? JSON.parse(raw) : {}
      } catch { data = {} }
    }
    dashscopeApiKey.value = data.dashscopeApiKey ?? ''
    ernieApiKey.value     = data.ernieApiKey     ?? ''
    iflytekApiKey.value   = data.iflytekApiKey   ?? ''
    defaultProvider.value = data.defaultProvider ?? 'dashscope'
    loaded.value = true
  }

  async function save(patch = {}) {
    const data = {
      dashscopeApiKey: dashscopeApiKey.value,
      ernieApiKey:     ernieApiKey.value,
      iflytekApiKey:   iflytekApiKey.value,
      defaultProvider: defaultProvider.value,
      ...patch,
    }
    Object.assign({ dashscopeApiKey, ernieApiKey, iflytekApiKey, defaultProvider }, {
      dashscopeApiKey: { value: data.dashscopeApiKey },
      ernieApiKey:     { value: data.ernieApiKey },
      iflytekApiKey:   { value: data.iflytekApiKey },
      defaultProvider: { value: data.defaultProvider },
    })
    dashscopeApiKey.value = data.dashscopeApiKey
    ernieApiKey.value     = data.ernieApiKey
    iflytekApiKey.value   = data.iflytekApiKey
    defaultProvider.value = data.defaultProvider

    if (isElectron()) {
      return window.electronAPI.saveSettings(data)
    } else {
      localStorage.setItem('ai-drama-settings', JSON.stringify(data))
      return { success: true }
    }
  }

  async function reset() {
    dashscopeApiKey.value = ''
    ernieApiKey.value     = ''
    iflytekApiKey.value   = ''
    defaultProvider.value = 'dashscope'
    if (isElectron()) {
      return window.electronAPI.resetSettings()
    } else {
      localStorage.removeItem('ai-drama-settings')
      return { success: true }
    }
  }

  return {
    dashscopeApiKey, ernieApiKey, iflytekApiKey, defaultProvider, loaded,
    providerName, getApiKey, hasApiKey,
    load, save, reset,
  }
})
