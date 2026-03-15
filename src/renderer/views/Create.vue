<template>
  <div class="create">
    <h2>✍️ 创作短剧剧本</h2>
    
    <el-card class="create-card">
      <el-form :model="form" label-width="120px">
        <!-- 主题 -->
        <el-form-item label="剧本主题" required>
          <el-input 
            v-model="form.theme" 
            placeholder="例如：霸道总裁爱上我、逆袭人生"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <!-- 风格 -->
        <el-form-item label="剧本风格" required>
          <el-select v-model="form.style" placeholder="请选择风格">
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
          />
          <span class="help-text"> 分钟/集</span>
        </el-form-item>
        
        <!-- AI 提供商 -->
        <el-form-item label="AI 提供商">
          <el-select v-model="form.provider" placeholder="请选择">
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
          >
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 生成结果 -->
    <el-card v-if="result" class="result-card">
      <template #header>
        <div class="result-header">
          <span>📜 生成结果</span>
          <el-button size="small" @click="copyResult">复制</el-button>
        </div>
      </template>
      
      <div class="result-content">
        <pre>{{ result.content }}</pre>
      </div>
      
      <div class="result-info">
        <el-tag size="small">{{ result.model }}</el-tag>
        <span class="time">{{ result.timestamp }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
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

// 生成状态
const isGenerating = ref(false)
const result = ref(null)

// 获取 API Key
const getApiKey = () => {
  const settings = localStorage.getItem('ai-drama-settings')
  if (!settings) {
    ElMessage.warning('请先在设置页面配置 API Key')
    return null
  }
  
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
  // 验证表单
  if (!form.theme) {
    ElMessage.warning('请输入剧本主题')
    return
  }
  
  if (!form.style) {
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
    
    // 创建生成器
    const generator = new DramaGenerator(apiKey)
    
    // 生成剧本
    const drama = await generator.generateDrama({
      theme: form.theme,
      style: form.style,
      episodes: form.episodes,
      duration: form.duration
    })
    
    result.value = drama
    ElMessage.success('剧本生成成功！')
  } catch (error) {
    ElMessage.error(`生成失败：${error.message}`)
  } finally {
    isGenerating.value = false
  }
}

// 复制结果
const copyResult = () => {
  if (result.value && result.value.content) {
    navigator.clipboard.writeText(result.value.content)
    ElMessage.success('已复制到剪贴板')
  }
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

.result-card {
  margin-top: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
