<template>
  <div class="batch-create">
    <h2>📦 批量生成</h2>

    <el-card class="form-card">
      <el-form
        :model="batchForm"
        label-width="120px"
      >
        <!-- 主题列表 -->
        <el-form-item
          label="主题列表"
          required
        >
          <el-input
            v-model="batchForm.themes"
            type="textarea"
            :rows="8"
            placeholder="每行一个主题，例如：&#10;霸道总裁爱上我&#10;逆袭人生&#10;都市仙医"
            :disabled="isBatchGenerating"
          />
          <div class="help-text">
            已输入 {{ themeCount }} 个主题
          </div>
        </el-form-item>

        <!-- 统一参数 -->
        <el-form-item label="统一参数">
          <el-row
            :gutter="16"
            style="width: 100%"
          >
            <el-col :span="8">
              <el-form-item
                label="风格"
                label-width="40px"
              >
                <el-select
                  v-model="batchForm.style"
                  style="width: 100%"
                  :disabled="isBatchGenerating"
                >
                  <el-option
                    v-for="s in STYLES"
                    :key="s"
                    :label="s"
                    :value="s"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="集数"
                label-width="40px"
              >
                <el-input-number
                  v-model="batchForm.episodes"
                  :min="1"
                  :max="100"
                  :disabled="isBatchGenerating"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="时长"
                label-width="40px"
              >
                <el-input-number
                  v-model="batchForm.duration"
                  :min="1"
                  :max="30"
                  :disabled="isBatchGenerating"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 提供商 & 并发 -->
        <el-form-item label="AI 提供商">
          <el-select
            v-model="batchForm.provider"
            style="width: 240px"
            :disabled="isBatchGenerating"
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

        <el-form-item label="并发数量">
          <el-input-number
            v-model="batchForm.concurrent"
            :min="1"
            :max="5"
            :disabled="isBatchGenerating"
          />
          <span class="help-text">建议不超过 3（避免触发 API 限流）</span>
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="isBatchGenerating"
            :disabled="!settingsStore.hasApiKey(batchForm.provider) || themeCount === 0"
            @click="startBatchGenerate"
          >
            {{ isBatchGenerating ? '生成中...' : '开始批量生成' }}
          </el-button>
          <el-button
            :disabled="!isBatchGenerating"
            @click="stopBatchGenerate"
          >
            停止
          </el-button>
          <el-button
            :disabled="batchResults.length === 0"
            @click="exportAll"
          >
            导出全部
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 进度面板 -->
    <el-card
      v-if="batchQueue.length > 0"
      class="progress-card"
    >
      <template #header>
        <div class="row-between">
          <span>📊 生成进度</span>
          <el-tag :type="progressTagType">
            已完成 {{ completedCount }} / {{ themeCount }}
            <template v-if="failedCount > 0">
              （失败 {{ failedCount }}）
            </template>
          </el-tag>
        </div>
      </template>

      <el-scrollbar max-height="360px">
        <div
          v-for="(item, idx) in batchQueue"
          :key="idx"
          class="queue-item"
          :class="item.status"
        >
          <span class="idx-badge">{{ idx + 1 }}</span>
          <span class="theme-text">{{ item.theme }}</span>
          <div class="status-area">
            <el-progress
              v-if="item.status === 'generating'"
              :percentage="item.progress"
              :stroke-width="8"
              :show-text="false"
              class="item-progress"
            />
            <el-tag
              size="small"
              :type="STATUS_TYPE[item.status]"
            >
              {{ STATUS_TEXT[item.status] }}
            </el-tag>
          </div>
        </div>
      </el-scrollbar>
    </el-card>

    <!-- 结果列表 -->
    <el-card
      v-if="batchResults.length > 0"
      class="result-card"
    >
      <template #header>
        <div class="row-between">
          <span>✅ 完成结果（{{ batchResults.length }} 个）</span>
          <el-button
            size="small"
            @click="exportAll"
          >
            导出全部
          </el-button>
        </div>
      </template>

      <el-collapse accordion>
        <el-collapse-item
          v-for="(res, idx) in batchResults"
          :key="idx"
          :name="idx"
        >
          <template #title>
            <span>{{ res.theme }}</span>
            <el-tag
              size="small"
              style="margin-left: 10px"
            >
              {{ res.style }}
            </el-tag>
          </template>
          <div class="result-detail">
            <div class="result-meta">
              <span>{{ res.episodes }}集 × {{ res.duration }}分钟</span>
              <span>{{ formatTime(res.timestamp) }}</span>
            </div>
            <div class="result-body">
              <pre>{{ res.content }}</pre>
            </div>
            <div class="result-actions">
              <el-button
                size="small"
                @click="copySingle(res.content)"
              >
                复制
              </el-button>
              <el-button
                size="small"
                @click="exportSingle(res)"
              >
                导出
              </el-button>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSettingsStore } from '../stores/index.js'
import { useHistoryStore } from '../stores/index.js'
import { batchExport, copyToClipboard } from '../utils/export.js'
import DramaGenerator from '../../ai/drama-generator.js'

const STYLES = ['都市', '言情', '逆袭', '战神', '神医', '萌宝', '古装', '悬疑', '喜剧']
const STATUS_TYPE = { pending: 'info', generating: 'warning', completed: 'success', failed: 'danger' }
const STATUS_TEXT = { pending: '等待中', generating: '生成中', completed: '已完成', failed: '失败' }

const settingsStore = useSettingsStore()
const historyStore  = useHistoryStore()

const batchForm = reactive({
  themes: '',
  style: '都市',
  episodes: 5,
  duration: 2,
  provider: 'dashscope',
  concurrent: 2,
})

const isBatchGenerating = ref(false)
const shouldStop        = ref(false)
const batchQueue        = ref([])
const batchResults      = ref([])

const themeCount = computed(() =>
  batchForm.themes.split('\n').filter((t) => t.trim()).length
)
const completedCount = computed(() =>
  batchQueue.value.filter((i) => i.status === 'completed').length
)
const failedCount = computed(() =>
  batchQueue.value.filter((i) => i.status === 'failed').length
)
const progressTagType = computed(() => {
  if (completedCount.value === themeCount.value && themeCount.value > 0) return 'success'
  if (isBatchGenerating.value) return 'warning'
  return 'info'
})

onMounted(async () => {
  await settingsStore.load()
  batchForm.provider = settingsStore.defaultProvider
})

function parseThemes() {
  return batchForm.themes.split('\n').map((t) => t.trim()).filter(Boolean)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function startBatchGenerate() {
  const themes = parseThemes()
  if (themes.length === 0) { ElMessage.warning('请输入至少一个主题'); return }

  const apiKey = settingsStore.getApiKey(batchForm.provider)
  if (!apiKey) { ElMessage.warning('请先配置该提供商的 API Key'); return }

  try {
    await ElMessageBox.confirm(
      `将生成 ${themes.length} 个剧本，预计约 ${Math.ceil(themes.length * 2 / batchForm.concurrent)} 分钟，确定开始吗？`,
      '批量生成确认',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch { return }

  isBatchGenerating.value = true
  shouldStop.value = false
  batchQueue.value = themes.map((theme) => ({ theme, status: 'pending', progress: 0 }))
  batchResults.value = []

  const generator = new DramaGenerator(apiKey)
  const running = new Set()

  for (let i = 0; i < themes.length; i++) {
    if (shouldStop.value) break

    while (running.size >= batchForm.concurrent) {
      await sleep(400)
      if (shouldStop.value) break
    }
    if (shouldStop.value) break

    running.add(i)
    batchQueue.value[i].status = 'generating'
    generateOne(generator, themes[i], i, running)
  }

  while (running.size > 0) await sleep(400)

  isBatchGenerating.value = false
  const msg = shouldStop.value
    ? '批量生成已停止'
    : `批量生成完成，成功 ${completedCount.value}/${themes.length}`
  shouldStop.value ? ElMessage.info(msg) : ElMessage.success(msg)
}

async function generateOne(generator, theme, index, running) {
  try {
    const res = await generator.generateDrama({
      theme,
      style:    batchForm.style,
      episodes: batchForm.episodes,
      duration: batchForm.duration,
    })

    batchQueue.value[index].status   = 'completed'
    batchQueue.value[index].progress = 100

    const record = {
      ...res,
      theme,
      style:    batchForm.style,
      episodes: batchForm.episodes,
      duration: batchForm.duration,
      provider: batchForm.provider,
    }
    batchResults.value.push(record)
    historyStore.add(record)
  } catch (err) {
    batchQueue.value[index].status = 'failed'
    ElMessage.error(`"${theme}" 生成失败：${err.message}`)
  } finally {
    running.delete(index)
  }
}

function stopBatchGenerate() {
  shouldStop.value = true
  ElMessage.info('正在停止，当前任务完成后将暂停...')
}

function exportAll() {
  if (batchResults.value.length === 0) { ElMessage.warning('暂无结果'); return }
  batchExport(batchResults.value, 'md')
  ElMessage.success('导出成功')
}

function exportSingle(res) {
  batchExport([res], 'md')
}

async function copySingle(content) {
  const ok = await copyToClipboard(content)
  ok ? ElMessage.success('已复制') : ElMessage.error('复制失败')
}

function formatTime(ts) {
  return ts ? new Date(ts).toLocaleString('zh-CN') : ''
}
</script>

<style scoped>
.batch-create {
  padding: 28px;
  max-width: 920px;
  margin: 0 auto;
}

.batch-create h2 {
  margin-bottom: 20px;
  color: #303133;
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

.row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 队列列表 */
.queue-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 4px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.queue-item:last-child { border-bottom: none; }
.queue-item.generating { background: #fdf6ec; }
.queue-item.completed  { background: #f0f9eb; }
.queue-item.failed     { background: #fef0f0; }

.idx-badge {
  width: 24px;
  height: 24px;
  background: #909399;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}

.theme-text {
  flex: 1;
  font-size: 14px;
}

.status-area {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 200px;
  flex-shrink: 0;
}

.item-progress {
  flex: 1;
}

/* 结果 */
.result-detail { padding: 10px 0; }

.result-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}

.result-body {
  background: #f5f7fa;
  padding: 14px;
  border-radius: 6px;
  max-height: 320px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.result-body pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.result-actions {
  display: flex;
  gap: 8px;
}
</style>
