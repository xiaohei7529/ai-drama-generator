<template>
  <div class="home">
    <!-- 导航栏 -->
    <el-menu mode="horizontal" :router="true" :default-active="$route.path">
      <el-menu-item index="/">🏠 首页</el-menu-item>
      <el-menu-item index="/create">✍️ 创作</el-menu-item>
      <el-menu-item index="/settings">⚙️ 设置</el-menu-item>
    </el-menu>
    
    <!-- 主要内容 -->
    <div class="content">
      <h1>🎬 AI 短剧生成器</h1>
      <p class="subtitle">使用 AI 技术自动生成短剧剧本</p>
      
      <!-- 功能卡片 -->
      <el-row :gutter="20" class="feature-cards">
        <el-col :span="8">
          <el-card shadow="hover" class="feature-card" @click="$router.push('/create')">
            <div class="icon">✍️</div>
            <h3>AI 剧本生成</h3>
            <p>输入主题，自动生成完整剧本</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="feature-card">
            <div class="icon">🎨</div>
            <h3>智能分镜</h3>
            <p>根据剧本自动生成分镜脚本</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="feature-card" @click="$router.push('/settings')">
            <div class="icon">⚙️</div>
            <h3>AI 配置</h3>
            <p>配置 AI 提供商和 API Key</p>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 快速开始 -->
      <el-card class="quick-start">
        <h3>🚀 快速开始</h3>
        <ol>
          <li>前往 <el-link type="primary" @click="$router.push('/settings')">设置</el-link> 页面配置 API Key</li>
          <li>前往 <el-link type="primary" @click="$router.push('/create')">创作</el-link> 页面输入主题</li>
          <li>等待 AI 生成精彩剧本</li>
        </ol>
      </el-card>
    </div>
  </div>
</template>

<script setup>
// 组件逻辑
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
}

.content {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content h1 {
  font-size: 36px;
  color: #303133;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #909399;
  margin-bottom: 40px;
}

.feature-cards {
  margin-bottom: 40px;
}

.feature-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 14px;
  color: #909399;
}

.quick-start {
  max-width: 600px;
  margin: 0 auto;
}

.quick-start h3 {
  margin-bottom: 15px;
  color: #303133;
}

.quick-start ol {
  line-height: 2;
  color: #606266;
}
</style>
