<template>
  <div class="create">
    <h2>🎬 创作新短剧</h2>
    
    <el-steps :active="currentStep" finish-status="success" align-center class="steps">
      <el-step title="输入主题" />
      <el-step title="生成剧本" />
      <el-step title="配置角色" />
      <el-step title="生成配音" />
      <el-step title="合成视频" />
    </el-steps>

    <el-card class="step-content">
      <!-- 步骤 1: 输入主题 -->
      <div v-if="currentStep === 0">
        <el-form label-width="100px">
          <el-form-item label="短剧主题">
            <el-input v-model="form.theme" placeholder="例如：都市爱情、职场逆袭、校园青春" />
          </el-form-item>
          <el-form-item label="风格">
            <el-select v-model="form.style">
              <el-option label="剧情" value="drama" />
              <el-option label="喜剧" value="comedy" />
              <el-option label="爱情" value="romance" />
              <el-option label="动作" value="action" />
              <el-option label="悬疑" value="mystery" />
            </el-select>
          </el-form-item>
          <el-form-item label="时长">
            <el-slider v-model="form.duration" :min="30" :max="300" :step="30" show-input />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="nextStep">下一步：生成剧本</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤 2: 生成剧本 -->
      <div v-else-if="currentStep === 1">
        <div v-if="generating" class="generating">
          <el-progress :percentage="progress" :status="progress >= 100 ? 'success' : ''" />
          <p>{{ generatingText }}</p>
        </div>
        <div v-else>
          <el-input
            v-model="script"
            type="textarea"
            :rows="15"
            placeholder="AI 生成的剧本将显示在这里..."
          />
          <el-button type="primary" @click="nextStep">下一步：配置角色</el-button>
        </div>
      </div>

      <!-- 后续步骤... -->
      <div v-else>
        <el-empty description="功能开发中..." />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentStep = ref(0)
const generating = ref(false)
const progress = ref(0)
const generatingText = ref('')

const form = ref({
  theme: route.query.theme || '',
  style: 'drama',
  duration: 60
})

const script = ref('')

const nextStep = () => {
  if (currentStep.value === 0) {
    // 开始生成剧本
    currentStep.value++
    startGenerateScript()
  } else if (currentStep.value === 1) {
    currentStep.value++
  } else {
    currentStep.value++
  }
}

const startGenerateScript = () => {
  generating.value = true
  progress.value = 0
  
  const timer = setInterval(() => {
    progress.value += 10
    if (progress.value === 20) generatingText.value = '正在分析主题...'
    if (progress.value === 40) generatingText.value = '正在构思情节...'
    if (progress.value === 60) generatingText.value = '正在创作对话...'
    if (progress.value === 80) generatingText.value = '正在优化剧本...'
    
    if (progress.value >= 100) {
      clearInterval(timer)
      generating.value = false
      script.value = `剧本标题：${form.value.theme}

第一幕：咖啡厅
时间：白天
人物：主角 A，朋友 B

A: 我有一个梦想...
B: 什么梦想？
A: 我想成为一个短剧创作者！

（剧情继续...）`
    }
  }, 500)
}
</script>

<style scoped>
.create {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.create h2 {
  margin-bottom: 30px;
}

.steps {
  margin-bottom: 30px;
}

.step-content {
  min-height: 400px;
}

.generating {
  text-align: center;
  padding: 50px 0;
}

.generating p {
  margin-top: 20px;
  color: #666;
}
</style>
