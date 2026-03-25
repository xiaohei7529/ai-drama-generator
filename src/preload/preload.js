/**
 * Electron Preload 脚本
 * 通过 contextBridge 向渲染进程安全暴露 IPC 接口，
 * 禁止直接暴露 ipcRenderer 对象。
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // --- 应用信息 ---
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getAppPath: (name) => ipcRenderer.invoke('get-app-path', name),

  // --- 目录选择 ---
  selectOutputDir: () => ipcRenderer.invoke('select-output-dir'),

  // --- 设置（加密存储，不经过 localStorage）---
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  resetSettings: () => ipcRenderer.invoke('settings:reset'),

  // --- Python AI 脚本生成 ---
  generateScript: (params) => ipcRenderer.invoke('generate-script', params),
})
