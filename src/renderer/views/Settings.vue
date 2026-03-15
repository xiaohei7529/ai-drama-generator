<template>
  <div class="settings">
    <h2>⚙️ 设置</h2>
    
    <!-- AI 提供商配置 -->
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>🤖 AI 提供商配置</span>
        </div>
      </template>
      
      <el-form :model="settings" label-width="150px">
        <!-- 通义千问 -->
        <el-form-item label="通义千问 API Key">
          <el-input 
            v-model="settings.dashscopeApiKey" 
            type="password"
            placeholder="请输入通义千问 API Key"
            show-password
            clearable
          />
          <el-button type="primary" size="small" @click="testConnection('dashscope')">
            测试连接
          </el-button>
          <div class="help-text">
            获取方式：访问 
            <el-link type="primary" href="https://dashscope.console.aliyun.com/" target="_blank">
              阿里云 DashScope 控制台
            </el-link>
          </div>
        </el-form-item>
        
        <!-- 文心一言 -->
        <el-form-item label="文心一言 API Key">
          <el-input 
            v-model="settings.ernieApiKey" 
            type="password"
            placeholder="请输入文心一言 API Key"
            show-password
            clearable
          />
          <el-button type="primary" size="small" @click="testConnection('ernie')">
            测试连接
          </el-button>
          <div class="help-text">
            获取方式：访问 
            <el-link type="primary" href="https://cloud.baidu.com/product/wenxinworkshop" target="_blank">
              百度智能云控制台
            </el-link>
          </div>
        </el-form-item>
        
        <!-- 讯飞星火 -->
        <el-form-item label="讯飞星火 API Key">
          <el-input 
            v-model="settings.iflytekApiKey" 
            type="password"
            placeholder="请输入讯飞星火 API Key"
            show-password
            clearable
          />
          <el-button type="primary" size="small" @click="testConnection('iflytek')">
            测试连接
          </el-button>
          <div class="help-text">
            获取方式：访问 
            <el-link type="primary" href="https://console.xfyun.cn/" target="_blank">
              讯飞开放平台
            </el-link>
          </div>
        </el-form-item>
        
        <!-- 默认 AI 提供商 -->
        <el-form-item label="默认 AI 提供商">
          <el-select v-model="settings.defaultProvider" placeholder="请选择">
            <el-option label="通义千问" value="dashscope" />
            <el-option label="文心一言" value="ernie" />
            <el-option label="讯飞星火" value="iflytek" />
          </el-select>
        </el-form-item>
        
        <!-- 保存按钮 -->
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存配置</el-button>
          <el-button @click="resetSettings">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 测试连接结果 -->
    <el-dialog v-model="testDialogVisible" title="连接测试" width="400px">
      <div v-if="testResult" class="test-result">
        <el-alert 
          :title="testResult.success ? '连接成功！' : '连接失败'"
          :type="testResult.success ? 'success' : 'error'"
          :description="testResult.message"
          show-icon
          :closable="false"
        />
      </div>
      <template #footer>
        <el-button @click="testDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import DramaGenerator from '../../ai/drama-generator.js'

// 设置数据
const settings = reactive({
  dashscopeApiKey: '',
  ernieApiKey: '',
  iflytekApiKey: '',
  defaultProvider: 'dashscope'
})

// 测试对话框
const testDialogVisible = ref(false)
const testResult = ref(null)

// 加载设置
onMounted(() => {
  loadSettings()
})

// 加载本地存储的设置
const loadSettings = () => {
  const saved = localStorage.getItem('ai-drama-settings')
  if (saved) {
    const parsed = JSON.parse(saved)
    Object.assign(settings, parsed)
  }
}

// 保存设置
const saveSettings = () => {
  localStorage.setItem('ai-drama-settings', JSON.stringify(settings))
  ElMessage.success('配置已保存！')
}

// 重置设置
const resetSettings = () => {
  settings.dashscopeApiKey = ''
  settings.ernieApiKey = ''
  settings.iflytekApiKey = ''
  settings.defaultProvider = 'dashscope'
  ElMessage.info('配置已重置')
}

// 测试连接
const testConnection = async (provider) => {
  testDialogVisible.value = true
  testResult.value = null
  
  let apiKey = ''
  let providerName = ''
  
  switch(provider) {
    case 'dashscope':
      apiKey = settings.dashscopeApiKey
      providerName = '通义千问'
      break
    case 'ernie':
      apiKey = settings.ernieApiKey
      providerName = '文心一言'
      break
    case 'iflytek':
      apiKey = settings.iflytekApiKey
      providerName = '讯飞星火'
      break
  }
  
  if (!apiKey) {
    testResult.value = {
      success: false,
      message: '请先输入 API Key'
    }
    return
  }
  
  try {
    // 使用 DramaGenerator 测试连接
    const generator = new DramaGenerator(apiKey)
    const result = await generator.testConnection()
    
    testResult.value = {
      success: result.success,
      message: result.success 
        ? `${providerName} API 连接正常` 
        : `${providerName} API 连接失败：${result.message}`
    }
  } catch (error) {
    testResult.value = {
      success: false,
      message: `测试失败：${error.message}`
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.settings h2 {
  margin-bottom: 20px;
  color: #303133;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.test-result {
  padding: 20px;
}
</style>
