<template>
  <div class="settings">
    <h2>⚙️ 设置</h2>

    <el-card class="settings-card">
      <template #header>
        <span>🤖 AI 提供商配置</span>
      </template>

      <el-form
        v-loading="saving"
        :model="form"
        label-width="160px"
      >
        <!-- 通义千问 -->
        <el-form-item label="通义千问 API Key">
          <div class="key-row">
            <el-input
              v-model="form.dashscopeApiKey"
              type="password"
              placeholder="sk-..."
              show-password
              clearable
            />
            <el-button
              type="primary"
              :loading="testing === 'dashscope'"
              @click="testConnection('dashscope')"
            >
              测试
            </el-button>
          </div>
          <div class="help-text">
            获取：
            <el-link
              type="primary"
              href="https://dashscope.console.aliyun.com/"
              target="_blank"
            >
              阿里云 DashScope 控制台
            </el-link>
          </div>
        </el-form-item>

        <!-- 文心一言 -->
        <el-form-item label="文心一言 API Key">
          <div class="key-row">
            <el-input
              v-model="form.ernieApiKey"
              type="password"
              placeholder="请输入文心一言 API Key"
              show-password
              clearable
            />
            <el-button
              type="primary"
              :loading="testing === 'ernie'"
              @click="testConnection('ernie')"
            >
              测试
            </el-button>
          </div>
          <div class="help-text">
            获取：
            <el-link
              type="primary"
              href="https://cloud.baidu.com/product/wenxinworkshop"
              target="_blank"
            >
              百度智能云控制台
            </el-link>
          </div>
        </el-form-item>

        <!-- 讯飞星火 -->
        <el-form-item label="讯飞星火 API Key">
          <div class="key-row">
            <el-input
              v-model="form.iflytekApiKey"
              type="password"
              placeholder="请输入讯飞星火 API Key"
              show-password
              clearable
            />
            <el-button
              type="primary"
              :loading="testing === 'iflytek'"
              @click="testConnection('iflytek')"
            >
              测试
            </el-button>
          </div>
          <div class="help-text">
            获取：
            <el-link
              type="primary"
              href="https://console.xfyun.cn/"
              target="_blank"
            >
              讯飞开放平台
            </el-link>
          </div>
        </el-form-item>

        <!-- 默认提供商 -->
        <el-form-item label="默认 AI 提供商">
          <el-select
            v-model="form.defaultProvider"
            style="width: 200px"
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

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            :loading="saving"
            @click="saveSettings"
          >
            保存配置
          </el-button>
          <el-button @click="resetSettings">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 存储安全说明 -->
    <el-card class="info-card">
      <template #header>
        <span>🔒 安全说明</span>
      </template>
      <p>API Key 通过操作系统原生加密（Electron safeStorage）存储在本地，不会上传至任何服务器。</p>
    </el-card>

    <!-- 测试结果对话框 -->
    <el-dialog
      v-model="testDialogVisible"
      title="连接测试结果"
      width="420px"
    >
      <div class="test-result">
        <el-alert
          v-if="testResult"
          :title="testResult.success ? '连接成功' : '连接失败'"
          :type="testResult.success ? 'success' : 'error'"
          :description="testResult.message"
          show-icon
          :closable="false"
        />
        <el-skeleton
          v-else
          :rows="2"
          animated
        />
      </div>
      <template #footer>
        <el-button @click="testDialogVisible = false">
          关闭
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '../stores/index.js'
import DramaGenerator from '../../ai/drama-generator.js'

const settingsStore = useSettingsStore()

const form = reactive({
  dashscopeApiKey: '',
  ernieApiKey: '',
  iflytekApiKey: '',
  defaultProvider: 'dashscope',
})

const saving = ref(false)
const testing = ref('')
const testDialogVisible = ref(false)
const testResult = ref(null)

onMounted(async () => {
  await settingsStore.load()
  form.dashscopeApiKey = settingsStore.dashscopeApiKey
  form.ernieApiKey     = settingsStore.ernieApiKey
  form.iflytekApiKey   = settingsStore.iflytekApiKey
  form.defaultProvider = settingsStore.defaultProvider
})

async function saveSettings() {
  saving.value = true
  try {
    const result = await settingsStore.save({ ...form })
    if (result?.success === false) throw new Error(result.error)
    ElMessage.success('配置已保存')
  } catch (err) {
    ElMessage.error(`保存失败：${err.message}`)
  } finally {
    saving.value = false
  }
}

async function resetSettings() {
  try {
    await settingsStore.reset()
    form.dashscopeApiKey = ''
    form.ernieApiKey     = ''
    form.iflytekApiKey   = ''
    form.defaultProvider = 'dashscope'
    ElMessage.info('配置已重置')
  } catch (err) {
    ElMessage.error(`重置失败：${err.message}`)
  }
}

async function testConnection(provider) {
  const keyMap = {
    dashscope: form.dashscopeApiKey,
    ernie: form.ernieApiKey,
    iflytek: form.iflytekApiKey,
  }
  const apiKey = keyMap[provider]

  if (!apiKey) {
    ElMessage.warning('请先输入该提供商的 API Key')
    return
  }

  testing.value = provider
  testDialogVisible.value = true
  testResult.value = null

  try {
    const generator = new DramaGenerator(apiKey)
    const result = await generator.testConnection()
    testResult.value = {
      success: result.success,
      message: result.success
        ? `${settingsStore.providerName(provider)} API 连接正常`
        : `连接失败：${result.message}`,
    }
  } catch (err) {
    testResult.value = { success: false, message: err.message }
  } finally {
    testing.value = ''
  }
}
</script>

<style scoped>
.settings {
  padding: 28px;
  max-width: 800px;
  margin: 0 auto;
}

.settings h2 {
  margin-bottom: 20px;
  color: #303133;
}

.settings-card,
.info-card {
  margin-bottom: 20px;
}

.key-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.key-row .el-input {
  flex: 1;
}

.help-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.info-card p {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.test-result {
  padding: 10px 0;
  min-height: 80px;
}
</style>
