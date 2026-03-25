<template>
  <div class="app-layout">
    <!-- 侧边导航 -->
    <el-aside
      class="sidebar"
      width="200px"
    >
      <div class="logo">
        <span class="logo-icon">🎬</span>
        <span class="logo-text">AI 短剧生成器</span>
      </div>

      <el-menu
        :default-active="$route.path"
        :router="true"
        class="side-menu"
        background-color="#1a1a2e"
        text-color="#c0c4cc"
        active-text-color="#409eff"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/create">
          <el-icon><EditPen /></el-icon>
          <span>创作剧本</span>
        </el-menu-item>
        <el-menu-item index="/batch-create">
          <el-icon><Files /></el-icon>
          <span>批量生成</span>
        </el-menu-item>
        <el-menu-item index="/history">
          <el-icon><Clock /></el-icon>
          <span>历史记录</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <span class="version">v{{ appVersion }}</span>
      </div>
    </el-aside>

    <!-- 主内容区 -->
    <el-main class="main-content">
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { House, EditPen, Files, Clock, Setting } from '@element-plus/icons-vue'
import { useSettingsStore } from './stores/index.js'

const appVersion = ref('0.1.0')
const settingsStore = useSettingsStore()

onMounted(async () => {
  if (typeof window !== 'undefined' && window.electronAPI) {
    appVersion.value = await window.electronAPI.getAppVersion()
  }
  // 预加载设置（含 API Key）到 Pinia
  await settingsStore.load()
})
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}

.side-menu {
  flex: 1;
  border-right: none;
}

.side-menu .el-menu-item {
  height: 46px;
  line-height: 46px;
  margin: 2px 8px;
  border-radius: 6px;
  padding-left: 16px !important;
}

.side-menu .el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.15) !important;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.version {
  font-size: 11px;
  color: #606266;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
