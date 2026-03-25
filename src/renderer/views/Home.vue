<template>
  <div class="home">
    <div class="hero">
      <h1>🎬 AI 短剧生成器</h1>
      <p class="subtitle">
        输入主题，一键生成完整短剧剧本、分镜与配音方案
      </p>

      <div
        v-if="!settingsStore.hasApiKey(settingsStore.defaultProvider)"
        class="api-warning"
      >
        <el-alert
          title="尚未配置 API Key"
          type="warning"
          description="请前往设置页面配置 AI 提供商的 API Key，才能使用生成功能。"
          show-icon
          :closable="false"
        >
          <template #default>
            <el-button
              type="primary"
              size="small"
              @click="$router.push('/settings')"
            >
              前往设置
            </el-button>
          </template>
        </el-alert>
      </div>
    </div>

    <!-- 功能入口卡片 -->
    <el-row
      :gutter="20"
      class="feature-row"
    >
      <el-col
        v-for="card in cards"
        :key="card.to"
        :xs="24"
        :sm="12"
        :md="6"
      >
        <el-card
          shadow="hover"
          class="feature-card"
          :class="{ disabled: card.disabled }"
          @click="card.disabled ? null : $router.push(card.to)"
        >
          <div class="card-icon">
            {{ card.icon }}
          </div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.desc }}</p>
          <el-tag
            v-if="card.disabled"
            type="info"
            size="small"
          >
            即将推出
          </el-tag>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速开始 -->
    <el-card class="quick-start">
      <template #header>
        🚀 快速开始
      </template>
      <ol>
        <li>
          前往 <el-link
            type="primary"
            @click="$router.push('/settings')"
          >
            设置
          </el-link> 配置 API Key
        </li>
        <li>
          前往 <el-link
            type="primary"
            @click="$router.push('/create')"
          >
            创作
          </el-link> 页面，输入主题
        </li>
        <li>等待 AI 生成精彩剧本，一键保存或导出</li>
      </ol>
    </el-card>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../stores/index.js'

const settingsStore = useSettingsStore()

const cards = [
  {
    icon: '✍️',
    title: 'AI 剧本生成',
    desc: '输入主题，自动生成完整剧本',
    to: '/create',
  },
  {
    icon: '📦',
    title: '批量生成',
    desc: '多主题并发生成，提升效率',
    to: '/batch-create',
  },
  {
    icon: '📜',
    title: '历史记录',
    desc: '查看、导出所有生成结果',
    to: '/history',
  },
  {
    icon: '🎨',
    title: '智能分镜',
    desc: '根据剧本自动生成分镜脚本',
    to: '/storyboard',
    disabled: true,
  },
]
</script>

<style scoped>
.home {
  padding: 32px 28px;
  max-width: 960px;
  margin: 0 auto;
}

.hero {
  margin-bottom: 32px;
}

.hero h1 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 16px;
  color: #909399;
  margin-bottom: 20px;
}

.api-warning {
  margin-top: 12px;
}

.feature-row {
  margin-bottom: 28px;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.25s ease;
  padding: 8px 0;
}

.feature-card:hover:not(.disabled) {
  transform: translateY(-4px);
}

.feature-card.disabled {
  cursor: default;
  opacity: 0.6;
}

.card-icon {
  font-size: 42px;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.quick-start {
  max-width: 600px;
}

.quick-start ol {
  line-height: 2.2;
  color: #606266;
  padding-left: 20px;
}
</style>
