<template>
  <div class="create">
    <h2>✍️ 创作短剧剧本</h2>

    <!-- 未配置 API Key 提示 -->
    <el-alert
      v-if="!settingsStore.hasApiKey(form.provider)"
      title="请先配置 API Key"
      type="warning"
      description="请在设置页面配置 AI 提供商的 API Key 后才能使用生成功能。"
      show-icon
      :closable="false"
      class="mb-20"
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

    <!-- 表单 -->
    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        :disabled="isGenerating"
      >
        <el-form-item
          label="剧本主题"
          prop="theme"
        >
          <el-input
            v-model="form.theme"
            placeholder="例如：霸道总裁爱上我、逆袭人生"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item
          label="剧本风格"
          prop="style"
        >
          <el-select
            v-model="form.style"
            placeholder="请选择风格"
            style="width: 100%"
          >
            <el-option
              v-for="s in STYLES"
              :key="s"
              :label="s"
              :value="s"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="集数">
          <el-input-number
            v-model="form.episodes"
            :min="1"
            :max="100"
          />
          <span class="help-text">集（建议 1–10）</span>
        </el-form-item>

        <el-form-item label="每集时长">
          <el-input-number
            v-model="form.duration"
            :min="1"
            :max="30"
          />
          <span class="help-text">分钟/集</span>
        </el-form-item>

        <el-form-item label="AI 提供商">
          <el-select
            v-model="form.provider"
            style="width: 100%"
          >
            <el-option
              label="通义千问"
              value="dashscope"
            />
            <el-option
              label="文心一言"
              value="ernie"
            />
            <el-option
              label="讯飞星火"
              value="iflytek"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="isGenerating"
            :disabled="!settingsStore.hasApiKey(form.provider)"
            @click="handleGenerate"
          >
            {{ isGenerating ? '生成中...' : '开始生成' }}
          </el-button>
          <el-button
            v-if="result"
            @click="resetResult"
          >
            重新开始
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 进度条 -->
    <el-card
      v-if="isGenerating"
      class="progress-card"
    >
      <div class="progress-content">
        <el-progress
          :percentage="Math.round(loadingProgress)"
          :stroke-width="18"
          :status="loadingProgress >= 100 ? 'success' : undefined"
        />
        <p class="progress-text">
          {{ progressText }}
        </p>
      </div>
    </el-card>

    <!-- 错误提示 -->
    <el-alert
      v-if="errorMsg"
      title="生成失败"
      :description="errorMsg"
      type="error"
      show-icon
      closable
      class="mb-20"
      @close="errorMsg = ''"
    >
      <template #default>
        <el-button
          type="primary"
          size="small"
          @click="handleGenerate"
        >
          重试
        </el-button>
      </template>
    </el-alert>

    <!-- 生成结果 -->
    <el-card
      v-if="result && !errorMsg"
      class="result-card"
    >
      <template #header>
        <div class="result-header">
          <span>📜 生成结果</span>
          <div class="header-actions">
            <el-button
              size="small"
              @click="copyResult"
            >
              复制
            </el-button>
            <el-button
              size="small"
              type="success"
              @click="exportResult"
            >
              导出
            </el-button>
          </div>
        </div>
      </template>

      <div class="result-body">
        <pre>{{ result.content }}</pre>
      </div>

      <div class="result-meta">
        <el-tag size="small">
          {{ result.model }}
        </el-tag>
        <span class="time">{{ formatTime(result.timestamp) }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '../stores/index.js'
import { useHistoryStore } from '../stores/index.js'
import { batchExport, copyToClipboard } from '../utils/export.js'
import DramaGenerator from '../../ai/drama-generator.js'

const STYLES = ['都市', '言情', '逆袭', '战神', '神医', '萌宝', '古装', '悬疑', '喜剧']
const PROGRESS_TEXTS = [
  '正在思考剧情方向...',
  '正在构建人物关系...',
  '正在设计情节冲突...',
  '正在编写精彩台词...',
  '正在完善细节...',
  '即将完成，稍候...',
]

const settingsStore = useSettingsStore()
const historyStore  = useHistoryStore()
const formRef = ref(null)

const form = reactive({
  theme: '',
  style: '',
  episodes: 5,
  duration: 2,
  provider: 'dashscope',
})

const rules = {
  theme: [{ required: true, message: '请输入剧本主题', trigger: 'blur' }],
  style: [{ required: true, message: '请选择剧本风格', trigger: 'change' }],
}

const isGenerating    = ref(false)
const loadingProgress = ref(0)
const progressText    = ref(PROGRESS_TEXTS[0])
const result          = ref(null)
const errorMsg        = ref('')

let progressTimer = null

onMounted(async () => {
  await settingsStore.load()
  form.provider = settingsStore.defaultProvider

  // 若从历史记录页跳转过来，预填表单
  const regenerate = localStorage.getItem('ai-drama-regenerate')
  if (regenerate) {
    try {
      const item = JSON.parse(regenerate)
      form.theme    = item.theme    ?? form.theme
      form.style    = item.style    ?? form.style
      form.episodes = item.episodes ?? form.episodes
      form.duration = item.duration ?? form.duration
      form.provider = item.provider ?? form.provider
    } catch { /* ignore */ }
    localStorage.removeItem('ai-drama-regenerate')
  }
})

function startProgressAnimation() {
  loadingProgress.value = 0
  progressText.value = PROGRESS_TEXTS[0]
  progressTimer = setInterval(() => {
    if (loadingProgress.value < 88) {
      loadingProgress.value = Math.min(88, loadingProgress.value + Math.random() * 8 + 2)
      const idx = Math.floor((loadingProgress.value / 100) * PROGRESS_TEXTS.length)
      progressText.value = PROGRESS_TEXTS[Math.min(idx, PROGRESS_TEXTS.length - 1)]
    }
  }, 600)
}

function stopProgressAnimation(success = true) {
  clearInterval(progressTimer)
  progressTimer = null
  if (success) {
    loadingProgress.value = 100
    progressText.value = '生成完成！'
  }
  setTimeout(() => { loadingProgress.value = 0 }, 1200)
}

async function handleGenerate() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const apiKey = settingsStore.getApiKey(form.provider)
  if (!apiKey) {
    ElMessage.warning('请先配置 API Key')
    return
  }

  errorMsg.value = ''
  result.value   = null
  isGenerating.value = true
  startProgressAnimation()

  try {
    const generator = new DramaGenerator(apiKey)
    const drama = await generator.generateDrama({
      theme:    form.theme,
      style:    form.style,
      episodes: form.episodes,
      duration: form.duration,
    })

    stopProgressAnimation(true)
    result.value = drama
    ElMessage.success('剧本生成成功！')

    historyStore.add({
      ...drama,
      theme:    form.theme,
      style:    form.style,
      episodes: form.episodes,
      duration: form.duration,
      provider: form.provider,
    })
  } catch (err) {
    stopProgressAnimation(false)
    errorMsg.value = err.message
    ElMessage.error(`生成失败：${err.message}`)
  } finally {
    isGenerating.value = false
  }
}

async function copyResult() {
  if (!result.value?.content) return
  const ok = await copyToClipboard(result.value.content)
  ok ? ElMessage.success('已复制到剪贴板') : ElMessage.error('复制失败，请手动选择复制')
}

function exportResult() {
  if (!result.value) return
  batchExport([{ ...result.value, theme: form.theme, style: form.style }], 'md')
  ElMessage.success('导出成功')
}

function resetResult() {
  result.value = null
  errorMsg.value = ''
}

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('zh-CN')
}
</script>

<style scoped>
.create {
  padding: 28px;
  max-width: 820px;
  margin: 0 auto;
}

.create h2 {
  margin-bottom: 20px;
  color: #303133;
}

.mb-20 {
  margin-bottom: 20px;
}

.form-card,
.progress-card,
.result-card {
  margin-bottom: 20px;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.progress-content {
  padding: 16px 0;
  text-align: center;
}

.progress-text {
  margin-top: 14px;
  color: #606266;
  font-size: 14px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.result-body {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 6px;
  max-height: 520px;
  overflow-y: auto;
}

.result-body pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.7;
}

.result-meta {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.time {
  font-size: 12px;
  color: #909399;
}
</style>
