<template>
  <div class="create">
    <h2>✍️ 创作短剧剧本</h2>
    
    <!-- 提示 -->
    <el-alert
      v-if="!hasApiKey"
      title="请先配置 API Key"
      type="warning"
      description="请在设置页面配置 AI 提供商的 API Key 后才能使用生成功能"
      show-icon
      closable
    >
      <template #default>
        <el-button type="primary" size="small" @click="$router.push('/settings')">
          前往设置
        </el-button>
      </template>
    </el-alert>
    
    <el-card class="create-card">
      <el-form :model="form" label-width="120px" :disabled="isGenerating">
        <!-- 主题 -->
        <el-form-item label="剧本主题" required :error="errors.theme">
          <el-input 
            v-model="form.theme" 
            placeholder="例如：霸道总裁爱上我、逆袭人生"
            maxlength="100"
            show-word-limit
            :disabled="isGenerating"
          />
        </el-form-item>
        
        <!-- 风格 -->
        <el-form-item label="剧本风格" required :error="errors.style">
          <el-select 
            v-model="form.style" 
            placeholder="请选择风格"
            :disabled="isGenerating"
            style="width: 100%"
          >
            <el-option label="都市" value="都市" />
            <el-option label="言情" value="言情" />
            <el-option label="逆袭" value="逆袭" />
            <el-option label="战神" value="战神" />
            <el-option label="神医" value="神医" />
            <el-option label="萌宝" value="萌宝" />
            <el-option label="古装" value="古装" />
          </el-select>
        </el-form-item>
        
        <!-- 集数 -->
        <el-form-item label="集数" required>
          <el-input-number 
            v-model="form.episodes" 
            :min="1" 
            :max="100" 
            :step="1"
            :disabled="isGenerating"
          />
          <span class="help-text"> 集 (建议 1-10 集)</span>
        </el-form-item>
        
        <!-- 每集时长 -->
        <el-form-item label="每集时长" required>
          <el-input-number 
            v-model="form.duration" 
            :min="1" 
            :max="10" 
            :step="1"
            :disabled="isGenerating"
          />
          <span class="help-text"> 分钟/集</span>
        </el-form-item>
        
        <!-- AI 提供商 -->
        <el-form-item label="AI 提供商">
          <el-select 
            v-model="form.provider" 
            placeholder="请选择"
            :disabled="isGenerating"
            style="width: 100%"
          >
            <el-option label="通义千问" value="dashscope" />
            <el-option label="文心一言" value="ernie" />
            <el-option label="讯飞星火" value="iflytek" />
          </el-select>
        </el-form-item>
        
        <!-- 生成按钮 -->
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            @click="generateDrama"
            :loading="isGenerating"
            :disabled="!hasApiKey"
          >
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 加载状态 -->
    <el-card v-if="isGenerating" class="loading-card">
      <div class="loading-content">
        <el-progress 
          :percentage="loadingProgress" 
          :format="loadingFormat"
          :stroke-width="20"
          :status="loadingProgress === 100 ? 'success' : undefined"
        />
        <p class="loading-text">{{ loadingText }}</p>
      </div>
    </el-card>
    
    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      :title="errorTitle"
      :description="errorMessage"
      type="error"
      show-icon
      closable
    >
      <template #default>
        <el-button type="primary" size="small" @click="retryGenerate">重试</el-button>
      </template>
    </el-alert>
    
    <!-- 生成结果 -->
    <el-card v-if="result && !error" class="result-card">
      <template #header>
        <div class="result-header">
          <span>📜 生成结果</span>
          <div class="header-actions">
            <el-button size="small" @click="copyResult">复制</el-button>
            <el-button size="small" @click="saveToHistory">保存</el-button>
          </div>
        </div>
      </template>
      
      <div class="result-content">
        <pre>{{ result.content }}</pre>
      </div>
      
      <div class="result-info">
        <el-tag size="small">{{ result.model }}</el-tag>
        <span class="time">{{ formatTime(result.timestamp) }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import DramaGenerator from '../../ai/drama-generator.js'

// 表单数据
const form = reactive({
  theme: '',
  style: '',
  episodes: 5,
  duration: 2,
  provider: 'dashscope'
})

// 错误信息
const errors = reactive({
  theme: '',
  style: ''
})

// 生成状态
const isGenerating = ref(false)
const loadingProgress = ref(0)
const loadingText = ref('正在思考中...')
const result = ref(null)
const error = ref(false)
const errorTitle = ref('')
const errorMessage = ref('')

// 检查 API Key
const hasApiKey = computed(() => {
  const settings = localStorage.getItem('ai-drama-settings')
  if (!settings) return false
  
  const parsed = JSON.parse(settings)
  switch(form.provider) {
    case 'dashscope':
      return !!parsed.dashscopeApiKey
    case 'ernie':
      return !!parsed.ernieApiKey
    case 'iflytek':
      return !!parsed.iflytekApiKey
    default:
      return !!parsed.dashscopeApiKey
  }
})

// 加载动画文案
const loadingFormat = (percentage) => {
  const texts = [
    '正在思考中...',
    '正在构思剧情...',
    '正在设计人物...',
    '正在编写对话...',
    '正在完善细节...',
    '即将完成...'
  ]
  const index = Math.floor((percentage / 100) * texts.length)
  loadingText.value = texts[Math.min(index, texts.length - 1)]
  return `${percentage}%`
}

// 获取 API Key
const getApiKey = () => {
  const settings = localStorage.getItem('ai-drama-settings')
  if (!settings) return null
  
  const parsed = JSON.parse(settings)
  switch(form.provider) {
    case 'dashscope':
      return parsed.dashscopeApiKey
    case 'ernie':
      return parsed.ernieApiKey
    case 'iflytek':
      return parsed.iflytekApiKey
    default:
      return parsed.dashscopeApiKey
  }
}

// 生成剧本
const generateDrama = async () => {
  // 重置状态
  error.value = false
  errors.theme = ''
  errors.style = ''
  
  // 验证表单
  if (!form.theme) {
    errors.theme = '请输入剧本主题'
    ElMessage.warning('请输入剧本主题')
    return
  }
  
  if (!form.style) {
    errors.style = '请选择剧本风格'
    ElMessage.warning('请选择剧本风格')
    return
  }
  
  // 获取 API Key
  const apiKey = getApiKey()
  if (!apiKey) {
    ElMessage.warning('请先配置 API Key')
    return
  }
  
  try {
    isGenerating.value = true
    loadingProgress.value = 0
    
    // 模拟加载进度
    const progressInterval = setInterval(() => {
      if (loadingProgress.value < 90) {
        loadingProgress.value += Math.random() * 10
      }
    }, 500)
    
    // 创建生成器
    const generator = new DramaGenerator(apiKey)
    
    // 生成剧本
    const drama = await generator.generateDrama({
      theme: form.theme,
      style: form.style,
      episodes: form.episodes,
      duration: form.duration
    })
    
    clearInterval(progressInterval)
    loadingProgress.value = 100
    
    result.value = drama
    ElMessage.success('剧本生成成功！')
    
    // 保存到历史记录
    saveToHistory(drama)
  } catch (err) {
    error.value = true
    errorTitle.value = '生成失败'
    errorMessage.value = err.message
    ElMessage.error(`生成失败：${err.message}`)
  } finally {
    isGenerating.value = false
    setTimeout(() => {
      loadingProgress.value = 0
    }, 1000)
  }
}

// 重试生成
const retryGenerate = () => {
  error.value = false
  generateDrama()
}

// 复制结果
const copyResult = () => {
  if (result.value && result.value.content) {
    navigator.clipboard.writeText(result.value.content)
    ElMessage.success('已复制到剪贴板')
  }
}

// 保存到历史记录
const saveToHistory = (dramaData) => {
  const historyItem = {
    ...dramaData,
    theme: form.theme,
    style: form.style,
    episodes: form.episodes,
    duration: form.duration,
    provider: form.provider,
    timestamp: new Date().toISOString()
  }
  
  // 触发 storage 事件通知历史页面
  localStorage.setItem('ai-drama-new-history', JSON.stringify(historyItem))
  ElMessage.success('已保存到历史记录')
}

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}
</script>

<style scoped>
.create {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.create h2 {
  margin-bottom: 20px;
  color: #303133;
}

.create-card {
  margin-bottom: 20px;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.loading-card {
  margin-bottom: 20px;
}

.loading-content {
  padding: 20px;
  text-align: center;
}

.loading-text {
  margin-top: 15px;
  color: #606266;
  font-size: 14px;
}

.result-card {
  margin-top: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.result-content {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 5px;
  max-height: 500px;
  overflow-y: auto;
}

.result-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

.result-info {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.time {
  font-size: 12px;
  color: #909399;
}
</style>
