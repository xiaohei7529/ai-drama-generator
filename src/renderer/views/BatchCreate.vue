<template>
  <div class="batch-create">
    <h2>📦 批量生成</h2>
    
    <el-card class="batch-card">
      <el-form :model="batchForm" label-width="120px">
        <!-- 批量主题 -->
        <el-form-item label="主题列表" required>
          <el-input
            v-model="batchForm.themes"
            type="textarea"
            :rows="8"
            placeholder="每行一个主题，例如：&#10;霸道总裁爱上我&#10;逆袭人生&#10;都市仙医"
          />
          <div class="help-text">
            已输入 {{ themeCount }} 个主题
          </div>
        </el-form-item>
        
        <!-- 统一设置 -->
        <el-form-item label="统一设置">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="风格">
                <el-select v-model="batchForm.style" placeholder="请选择" style="width: 100%">
                  <el-option label="都市" value="都市" />
                  <el-option label="言情" value="言情" />
                  <el-option label="逆袭" value="逆袭" />
                  <el-option label="战神" value="战神" />
                  <el-option label="神医" value="神医" />
                  <el-option label="萌宝" value="萌宝" />
                  <el-option label="古装" value="古装" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集数">
                <el-input-number v-model="batchForm.episodes" :min="1" :max="100" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="时长">
                <el-input-number v-model="batchForm.duration" :min="1" :max="10" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        
        <!-- AI 提供商 -->
        <el-form-item label="AI 提供商">
          <el-select v-model="batchForm.provider" placeholder="请选择" style="width: 100%">
            <el-option label="通义千问" value="dashscope" />
            <el-option label="文心一言" value="ernie" />
            <el-option label="讯飞星火" value="iflytek" />
          </el-select>
        </el-form-item>
        
        <!-- 并发控制 -->
        <el-form-item label="并发数量">
          <el-input-number v-model="batchForm.concurrent" :min="1" :max="5" :step="1" />
          <span class="help-text"> 个 (同时生成的数量，建议不超过 3 个)</span>
        </el-form-item>
        
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            @click="startBatchGenerate"
            :loading="isBatchGenerating"
            :disabled="!hasApiKey || themeCount === 0"
          >
            {{ isBatchGenerating ? '批量生成中...' : '开始批量生成' }}
          </el-button>
          <el-button @click="stopBatchGenerate" :disabled="!isBatchGenerating">停止</el-button>
          <el-button @click="exportBatchResult" :disabled="batchResults.length === 0">导出结果</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 进度显示 -->
    <el-card v-if="isBatchGenerating" class="progress-card">
      <template #header>
        <div class="progress-header">
          <span>📊 生成进度</span>
          <el-tag :type="progressStatus">{{ completedCount }} / {{ themeCount }}</el-tag>
        </div>
      </template>
      
      <div class="progress-list">
        <div 
          v-for="(item, index) in batchQueue" 
          :key="index"
          class="progress-item"
          :class="item.status"
        >
          <div class="item-info">
            <span class="index">{{ index + 1 }}</span>
            <span class="theme">{{ item.theme }}</span>
          </div>
          <div class="item-status">
            <el-tag size="small" :type="getStatusType(item.status)">
              {{ getStatusText(item.status) }}
            </el-tag>
            <el-progress 
              v-if="item.status === 'generating'"
              :percentage="item.progress" 
              :stroke-width="10"
              :show-text="false"
              class="item-progress"
            />
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 结果列表 -->
    <el-card v-if="batchResults.length > 0" class="result-card">
      <template #header>
        <div class="result-header">
          <span>✅ 完成结果 ({{ batchResults.length }})</span>
          <el-button size="small" @click="exportBatchResult">导出全部</el-button>
        </div>
      </template>
      
      <el-collapse accordion>
        <el-collapse-item 
          v-for="(result, index) in batchResults" 
          :key="index"
          :title="result.theme"
          :name="index"
        >
          <div class="result-detail">
            <div class="result-meta">
              <el-tag>{{ result.style }}</el-tag>
              <span>{{ result.episodes }}集 × {{ result.duration }}分钟</span>
            </div>
            <div class="result-content">
              <pre>{{ result.content }}</pre>
            </div>
            <div class="result-actions">
              <el-button size="small" @click="copyResult(result.content)">复制</el-button>
              <el-button size="small" @click="exportSingle(result)">导出</el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import DramaGenerator from '../../ai/drama-generator.js'
import { batchExport } from '../../utils/export'

// 批量表单
const batchForm = reactive({
  themes: '',
  style: '都市',
  episodes: 5,
  duration: 2,
  provider: 'dashscope',
  concurrent: 2
})

// 批量状态
const isBatchGenerating = ref(false)
const shouldStop = ref(false)
const batchQueue = ref([])
const batchResults = ref([])

// 主题数量
const themeCount = computed(() => {
  return batchForm.themes.split('\n').filter(t => t.trim()).length
})

// 检查 API Key
const hasApiKey = computed(() => {
  const settings = localStorage.getItem('ai-drama-settings')
  if (!settings) return false
  const parsed = JSON.parse(settings)
  return !!parsed.dashscopeApiKey
})

// 完成数量
const completedCount = computed(() => {
  return batchQueue.value.filter(item => item.status === 'completed').length
})

// 进度状态
const progressStatus = computed(() => {
  if (completedCount.value === themeCount.value) return 'success'
  if (isBatchGenerating.value) return 'warning'
  return 'info'
})

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    pending: 'info',
    generating: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    pending: '等待中',
    generating: '生成中',
    completed: '已完成',
    failed: '失败'
  }
  return texts[status] || status
}

// 解析主题列表
const parseThemes = () => {
  return batchForm.themes.split('\n').filter(t => t.trim()).map(t => t.trim())
}

// 开始批量生成
const startBatchGenerate = async () => {
  const themes = parseThemes()
  
  if (themes.length === 0) {
    ElMessage.warning('请输入至少一个主题')
    return
  }
  
  const apiKey = getApiKey()
  if (!apiKey) {
    ElMessage.warning('请先配置 API Key')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `将生成 ${themes.length} 个剧本，预计需要 ${themes.length * 2} 分钟，确定开始吗？`,
      '批量生成',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    return
  }
  
  isBatchGenerating.value = true
  shouldStop.value = false
  batchQueue.value = themes.map(theme => ({
    theme,
    status: 'pending',
    progress: 0,
    result: null
  }))
  batchResults.value = []
  
  // 开始批量生成
  const generator = new DramaGenerator(apiKey)
  const running = new Set()
  
  for (let i = 0; i < themes.length; i++) {
    if (shouldStop.value) break
    
    // 等待并发控制
    while (running.size >= batchForm.concurrent) {
      await sleep(500)
      if (shouldStop.value) break
    }
    
    if (shouldStop.value) break
    
    // 开始生成
    const index = i
    running.add(index)
    batchQueue.value[index].status = 'generating'
    
    generateSingle(generator, themes[index], index, running)
  }
  
  // 等待所有完成
  while (running.size > 0) {
    await sleep(500)
  }
  
  isBatchGenerating.value = false
  
  if (shouldStop.value) {
    ElMessage.info('批量生成已停止')
  } else {
    ElMessage.success(`批量生成完成，成功 ${completedCount.value}/${themes.length}`)
  }
}

// 生成单个剧本
const generateSingle = async (generator, theme, index, running) => {
  try {
    const result = await generator.generateDrama({
      theme,
      style: batchForm.style,
      episodes: batchForm.episodes,
      duration: batchForm.duration
    })
    
    batchQueue.value[index].status = 'completed'
    batchQueue.value[index].progress = 100
    batchQueue.value[index].result = result
    
    batchResults.value.push({
      ...result,
      theme,
      style: batchForm.style,
      episodes: batchForm.episodes,
      duration: batchForm.duration
    })
  } catch (err) {
    batchQueue.value[index].status = 'failed'
    ElMessage.error(`"${theme}" 生成失败：${err.message}`)
  } finally {
    running.delete(index)
  }
}

// 停止生成
const stopBatchGenerate = () => {
  shouldStop.value = true
  ElMessage.info('正在停止批量生成...')
}

// 导出批量结果
const exportBatchResult = () => {
  if (batchResults.value.length === 0) {
    ElMessage.warning('没有可导出的结果')
    return
  }
  
  batchExport(batchResults.value, 'md')
  ElMessage.success('导出成功')
}

// 导出单个结果
const exportSingle = (result) => {
  batchExport([result], 'md')
}

// 复制结果
const copyResult = (content) => {
  navigator.clipboard.writeText(content)
  ElMessage.success('已复制')
}

// 获取 API Key
const getApiKey = () => {
  const settings = localStorage.getItem('ai-drama-settings')
  if (!settings) return null
  const parsed = JSON.parse(settings)
  return parsed.dashscopeApiKey
}

// 延迟函数
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
</script>

<style scoped>
.batch-create {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.batch-create h2 {
  margin-bottom: 20px;
  color: #303133;
}

.batch-card {
  margin-bottom: 20px;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.progress-card {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-list {
  max-height: 400px;
  overflow-y: auto;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.progress-item:last-child {
  border-bottom: none;
}

.progress-item.generating {
  background: #fdf6ec;
}

.progress-item.completed {
  background: #f0f9ff;
}

.progress-item.failed {
  background: #fef0f0;
}

.item-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.index {
  width: 24px;
  height: 24px;
  background: #909399;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.theme {
  font-size: 14px;
}

.item-status {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 200px;
}

.item-progress {
  flex: 1;
}

.result-card {
  margin-top: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-detail {
  padding: 10px 0;
}

.result-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #909399;
}

.result-content {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.result-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.result-actions {
  display: flex;
  gap: 10px;
}
</style>
