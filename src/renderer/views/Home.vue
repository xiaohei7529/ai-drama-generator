<template>
  <div class="home">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="logo">🎬 AI 短剧生成器</div>
      <el-menu mode="horizontal" :ellipsis="false" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/create">创作</el-menu-item>
        <el-menu-item index="/projects">项目</el-menu-item>
        <el-menu-item index="/templates">模板</el-menu-item>
        <el-menu-item index="/settings">设置</el-menu-item>
      </el-menu>
    </div>

    <!-- 主要内容 -->
    <div class="main">
      <!-- 快速开始 -->
      <el-card class="quick-start">
        <h2>🚀 快速开始</h2>
        <p>输入主题，AI 自动生成完整短剧</p>
        <el-input
          v-model="theme"
          placeholder="请输入短剧主题，例如：都市爱情、职场逆袭、校园青春..."
          size="large"
          @keyup.enter="startCreate"
        >
          <template #append>
            <el-button type="primary" size="large" @click="startCreate">
              开始创作
            </el-button>
          </template>
        </el-input>
      </el-card>

      <!-- 功能卡片 -->
      <el-row :gutter="20" class="features">
        <el-col :span="8" v-for="feature in features" :key="feature.title">
          <el-card shadow="hover" class="feature-card" @click="feature.action">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </el-card>
        </el-col>
      </el-row>

      <!-- 最近项目 -->
      <el-card class="recent-projects">
        <h2>📁 最近项目</h2>
        <el-empty v-if="projects.length === 0" description="暂无项目" />
        <el-table v-else :data="projects" style="width: 100%">
          <el-table-column prop="name" label="项目名称" />
          <el-table-column prop="theme" label="主题" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button size="small" @click="openProject(row)">打开</el-button>
              <el-button size="small" type="danger" @click="deleteProject(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const theme = ref('')

const features = [
  { icon: '🤖', title: 'AI 剧本生成', desc: '输入主题，自动生成完整剧本', action: () => router.push('/create') },
  { icon: '🎨', title: '智能分镜', desc: '根据剧本自动生成分镜脚本', action: () => router.push('/create') },
  { icon: '🎙️', title: 'AI 配音', desc: '多角色 AI 语音合成', action: () => router.push('/create') },
  { icon: '🖼️', title: '场景生成', desc: 'AI 生成场景图片/视频', action: () => router.push('/create') },
  { icon: '📹', title: '视频合成', desc: '自动合成完整短剧视频', action: () => router.push('/create') },
  { icon: '📦', title: '批量生成', desc: '批量生产短剧内容', action: () => router.push('/create') },
]

const projects = ref([
  { name: '都市爱情故事', theme: '都市爱情', status: '已完成', createdAt: '2026-03-06' },
  { name: '职场逆袭', theme: '职场励志', status: '生成中', createdAt: '2026-03-06' },
])

const startCreate = () => {
  if (!theme.value) {
    alert('请输入主题')
    return
  }
  router.push({ path: '/create', query: { theme: theme.value } })
}

const getStatusType = (status) => {
  const types = { '已完成': 'success', '生成中': 'warning', '草稿': 'info' }
  return types[status] || 'info'
}

const openProject = (project) => {
  console.log('打开项目:', project)
}

const deleteProject = (project) => {
  console.log('删除项目:', project)
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.logo {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-right: 40px;
}

.main {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.quick-start {
  margin-bottom: 30px;
}

.quick-start h2 {
  margin-bottom: 10px;
}

.quick-start p {
  color: #666;
  margin-bottom: 20px;
}

.features {
  margin-bottom: 30px;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature-card h3 {
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  font-size: 14px;
}

.recent-projects {
  margin-bottom: 30px;
}

.recent-projects h2 {
  margin-bottom: 20px;
}
</style>
