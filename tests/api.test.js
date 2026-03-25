/**
 * AI 剧本生成器 - API 测试文件
 */

import DramaGenerator from '../src/ai/drama-generator.js'

const TEST_CONFIG = {
  apiKey: process.env.DASHSCOPE_API_KEY || 'YOUR_API_KEY',
  model: 'qwen-turbo'
}

const testCases = [
  {
    name: '测试 1: 都市题材短剧',
    options: {
      theme: '霸道总裁爱上我',
      style: '都市',
      episodes: 3,
      duration: 2
    }
  },
  {
    name: '测试 2: 逆袭题材短剧',
    options: {
      theme: '穷小子逆袭成为首富',
      style: '逆袭',
      episodes: 3,
      duration: 2
    }
  },
  {
    name: '测试 3: 古装题材短剧',
    options: {
      theme: '王妃的逆袭之路',
      style: '古装',
      episodes: 3,
      duration: 2
    }
  }
]

const results = {
  total: 0,
  success: 0,
  failed: 0,
  errors: []
}

async function testConnection() {
  console.log('\n🔍 测试 1: API 连接测试')
  const generator = new DramaGenerator(TEST_CONFIG.apiKey)
  
  try {
    const result = await generator.testConnection()
    if (result.success) {
      console.log('✅ API 连接正常')
      results.success++
    } else {
      console.log('❌ API 连接失败:', result.message)
      results.failed++
    }
  } catch (error) {
    console.log('❌ 测试异常:', error.message)
    results.failed++
  }
  results.total++
}

async function testDramaGeneration(testCase) {
  console.log(`\n🎬 测试：${testCase.name}`)
  const generator = new DramaGenerator(TEST_CONFIG.apiKey)
  
  try {
    const startTime = Date.now()
    const result = await generator.generateDrama(testCase.options)
    const endTime = Date.now()
    
    console.log('✅ 生成成功!')
    console.log(`   耗时：${(endTime - startTime) / 1000}秒`)
    console.log(`   内容长度：${result.content.length}字符`)
    results.success++
  } catch (error) {
    console.log('❌ 生成失败:', error.message)
    results.failed++
    results.errors.push({ test: testCase.name, error: error.message })
  }
  results.total++
}

function printReport() {
  console.log('\n\n📊 测试报告')
  console.log('='.repeat(50))
  console.log(`总测试数：${results.total}`)
  console.log(`成功：${results.success}`)
  console.log(`失败：${results.failed}`)
  console.log(`成功率：${(results.success / results.total * 100).toFixed(1)}%`)
}

async function runAllTests() {
  console.log('🚀 开始执行 API 测试套件')
  console.log('='.repeat(50))
  
  if (!TEST_CONFIG.apiKey || TEST_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.log('\n⚠️ 警告：未配置有效的 API Key')
    console.log('请在环境变量中设置 DASHSCOPE_API_KEY')
    return
  }
  
  await testConnection()
  
  for (const testCase of testCases) {
    await testDramaGeneration(testCase)
  }
  
  printReport()
}

runAllTests().catch(console.error)

export default runAllTests
