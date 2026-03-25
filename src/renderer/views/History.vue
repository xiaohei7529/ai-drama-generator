<template>
  <div class="history">
    <div class="page-header">
      <h2>📜 历史记录</h2>
      <div
        v-if="historyStore.items.length > 0"
        class="header-actions"
      >
        <el-input
          v-model="searchText"
          placeholder="搜索主题..."
          clearable
          style="width: 200px"
          size="small"
        />
        <el-button
          size="small"
          @click="exportAll"
        >
          导出全部
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="confirmClearAll"
        >
          清空全部
        </el-button>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="historyStore.items.length === 0"
      description="暂无历史记录，去创作第一个剧本吧！"
    >
      <el-button
        type="primary"
        @click="$router.push('/create')"
      >
        开始创作
      </el-button>
    </el-empty>

    <!-- 过滤后无结果 -->
    <el-empty
      v-else-if="filteredItems.length === 0"
      description="没有匹配的记录"
    />

    <!-- 历史记录列表 -->
    <el-timeline v-else>
      <el-timeline-item
        v-for="(item, idx) in filteredItems"
        :key="item.id ?? idx"
        :timestamp="formatTime(item.savedAt ?? item.timestamp)"
        placement="top"
        size="large"
      >
        <el-card class="history-card">
          <div class="item-header">
            <el-tag
              :type="providerTagType(item.provider)"
              size="small"
            >
              {{ settingsStore.providerName(item.provider) }}
            </el-tag>
            <el-tag
              type="info"
              size="small"
            >
              {{ item.style }}
            </el-tag>
            <span class="item-title">{{ item.theme }}</span>
          </div>
          <div class="item-meta">
            {{ item.episodes }}集 × {{ item.duration }}分钟
          </div>
          <div class="item-actions">
            <el-button
              size="small"
              @click="openDetail(item)"
            >
              查看详情
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="regenerate(item)"
            >
              重新生成
            </el-button>
            <el-button
              size="small"
              @click="exportSingle(item)"
            >
              导出
            </el-button>
            <el-button
              size="small"
              type="danger"
              plain
              @click="confirmDelete(idx)"
            >
              删除
            </el-button>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="剧本详情"
      width="800px"
      top="5vh"
    >
      <div
        v-if="currentDetail"
        class="detail-header"
      >
        <el-tag
          :type="providerTagType(currentDetail.provider)"
          size="small"
        >
          {{ settingsStore.providerName(currentDetail.provider) }}
        </el-tag>
        <strong style="margin-left: 10px">{{ currentDetail.theme }}</strong>
      </div>
      <div
        v-if="currentDetail"
        class="detail-body"
      >
        <pre>{{ currentDetail.content }}</pre>
      </div>
      <template #footer>
        <el-button @click="copyDetail">
          复制内容
        </el-button>
        <el-button @click="detailVisible = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useHistoryStore } from '../stores/index.js'
import { useSettingsStore } from '../stores/index.js'
import { batchExport, copyToClipboard } from '../utils/export.js'

const router        = useRouter()
const historyStore  = useHistoryStore()
const settingsStore = useSettingsStore()

const searchText    = ref('')
const detailVisible = ref(false)
const currentDetail = ref(null)

onMounted(() => {
  historyStore.load()
})

const filteredItems = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return historyStore.items
  return historyStore.items.filter((i) =>
    (i.theme ?? '').toLowerCase().includes(q) ||
    (i.style ?? '').toLowerCase().includes(q)
  )
})

function providerTagType(provider) {
  return { dashscope: 'primary', ernie: 'success', iflytek: 'warning' }[provider] ?? 'info'
}

function formatTime(ts) {
  return ts ? new Date(ts).toLocaleString('zh-CN') : ''
}

function openDetail(item) {
  currentDetail.value = item
  detailVisible.value = true
}

async function copyDetail() {
  if (!currentDetail.value?.content) return
  const ok = await copyToClipboard(currentDetail.value.content)
  ok ? ElMessage.success('已复制到剪贴板') : ElMessage.error('复制失败')
}

function regenerate(item) {
  localStorage.setItem('ai-drama-regenerate', JSON.stringify(item))
  router.push('/create')
}

function exportSingle(item) {
  batchExport([item], 'md')
}

function exportAll() {
  if (historyStore.items.length === 0) return
  batchExport(historyStore.items, 'md')
  ElMessage.success('导出成功')
}

async function confirmDelete(originalIdx) {
  // filteredItems 中的 idx 不等于 store 里的 idx，需要找原始 id
  const item = filteredItems.value[originalIdx]
  const storeIdx = historyStore.items.findIndex((i) => i === item)
  try {
    await ElMessageBox.confirm('确定要删除这条历史记录吗？', '提示', {
      type: 'warning',
      confirmButtonText: '删除',
      confirmButtonClass: 'el-button--danger',
    })
    historyStore.remove(storeIdx)
    ElMessage.success('删除成功')
  } catch { /* 取消 */ }
}

async function confirmClearAll() {
  try {
    await ElMessageBox.confirm('确定要清空所有历史记录吗？此操作不可恢复！', '警告', {
      type: 'error',
      confirmButtonText: '清空',
      confirmButtonClass: 'el-button--danger',
    })
    historyStore.clear()
    ElMessage.success('已清空所有历史记录')
  } catch { /* 取消 */ }
}
</script>

<style scoped>
.history {
  padding: 28px;
  max-width: 920px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-header h2 {
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.history-card { padding: 4px 0; }

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.item-meta {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.item-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 详情对话框 */
.detail-header {
  margin-bottom: 12px;
}

.detail-body {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 6px;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-body pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.7;
}
</style>
