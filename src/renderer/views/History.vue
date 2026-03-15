<template>
  <div class="history">
    <h2>📜 历史记录</h2>
    
    <el-empty v-if="historyList.length === 0" description="暂无历史记录" />
    
    <template v-else>
      <!-- 操作栏 -->
      <div class="action-bar">
        <el-button type="danger" size="small" @click="clearAll" :disabled="historyList.length === 0">
          清空全部
        </el-button>
        <el-button size="small" @click="exportHistory">
          导出记录
        </el-button>
      </div>
      
      <!-- 历史记录列表 -->
      <el-timeline>
        <el-timeline-item 
          v-for="(item, index) in historyList" 
          :key="index"
          :timestamp="item.timestamp"
          placement="top"
          size="large"
        >
          <el-card>
            <div class="history-item">
              <div class="header">
                <el-tag :type="getTypeTag(item.provider)">{{ getProviderName(item.provider) }}</el-tag>
                <span class="style">{{ item.style }}</span>
              </div>
              <h4>{{ item.theme }}</h4>
              <div class="meta">
                <span>{{ item.episodes }}集 × {{ item.duration }}分钟</span>
                <span>{{ item.status === 'completed' ? '✅ 已完成' : '⏳ 生成中' }}</span>
              </div>
              <div class="actions">
                <el-button size="small" @click="viewDetail(item)">查看详情</el-button>
                <el-button size="small" type="primary" @click="regenerate(item)">重新生成</el-button>
                <el-button size="small" type="danger" @click="deleteItem(index)">删除</el-button>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </template>
    
    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="剧本详情" width="800px">
      <div v-if="currentDetail" class="detail-content">
        <pre>{{ currentDetail.content }}</pre>
      </div>
      <template #footer>
        <el-button @click="copyDetail">复制内容</el-button>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 历史记录
const historyList = ref([])
const detailVisible = ref(false)
const currentDetail = ref(null)

// 加载历史记录
onMounted(() => {
  loadHistory()
})

// 加载历史记录
const loadHistory = () => {
  const saved = localStorage.getItem('ai-drama-history')
  if (saved) {
    historyList.value = JSON.parse(saved)
  }
}

// 保存历史记录
const saveHistory = () => {
  localStorage.setItem('ai-drama-history', JSON.stringify(historyList.value))
}

// 获取提供商名称
const getProviderName = (provider) => {
  const names = {
    dashscope: '通义千问',
    ernie: '文心一言',
    iflytek: '讯飞星火'
  }
  return names[provider] || provider
}

// 获取标签类型
const getTypeTag = (provider) => {
  const types = {
    dashscope: 'primary',
    ernie: 'success',
    iflytek: 'warning'
  }
  return types[provider] || 'info'
}

// 查看详情
const viewDetail = (item) => {
  currentDetail.value = item
  detailVisible.value = true
}

// 复制详情
const copyDetail = () => {
  if (currentDetail.value && currentDetail.value.content) {
    navigator.clipboard.writeText(currentDetail.value.content)
    ElMessage.success('已复制到剪贴板')
  }
}

// 重新生成
const regenerate = (item) => {
  // 跳转到创作页面并填充表单
  localStorage.setItem('ai-drama-regenerate', JSON.stringify(item))
  window.location.hash = '/create'
  ElMessage.info('已跳转到创作页面')
}

// 删除单条
const deleteItem = (index) => {
  ElMessageBox.confirm('确定要删除这条历史记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    historyList.value.splice(index, 1)
    saveHistory()
    ElMessage.success('删除成功')
  })
}

// 清空全部
const clearAll = () => {
  ElMessageBox.confirm('确定要清空所有历史记录吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    historyList.value = []
    saveHistory()
    ElMessage.success('已清空所有历史记录')
  })
}

// 导出历史记录
const exportHistory = () => {
  const content = historyList.value.map(item => 
    `主题：${item.theme}\n风格：${item.style}\n集数：${item.episodes}\n时长：${item.duration}分钟\n提供商：${getProviderName(item.provider)}\n时间：${item.timestamp}\n\n${item.content}\n\n${'='.repeat(50)}\n\n`
  ).join('')
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-drama-history-${new Date().toISOString().split('T')[0]}.txt`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

// 监听生成完成事件 (从创作页面)
window.addEventListener('storage', (e) => {
  if (e.key === 'ai-drama-new-history' && e.newValue) {
    const newItem = JSON.parse(e.newValue)
    historyList.value.unshift(newItem)
    saveHistory()
  }
})
</script>

<style scoped>
.history {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.history h2 {
  margin-bottom: 20px;
  color: #303133;
}

.action-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.history-item {
  padding: 10px 0;
}

.header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.style {
  font-size: 14px;
  color: #606266;
}

.history-item h4 {
  margin: 10px 0;
  color: #303133;
}

.meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 10px;
}

.detail-content {
  max-height: 500px;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 5px;
}

.detail-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}
</style>
