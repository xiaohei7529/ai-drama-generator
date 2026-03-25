/**
 * 性能测试文件
 * 测试批量生成和并发控制性能
 */

import DramaGenerator from '../src/ai/drama-generator.js'

const TEST_CONFIG = {
  apiKey: process.env.DASHSCOPE_API_KEY || 'YOUR_API_KEY'
}

/**
 * 测试批量生成性能
 */
async function testBatchPerformance() {
  console.log('\n📊 测试：批量生成性能')
  console.log('='.repeat(50))
  
  const themes = [
    '霸道总裁爱上我',
    '穷小子逆袭',
    '都市仙医',
    '龙王归来',
    '天才萌宝'
  ]
  
  const results = []
  const startTime = Date.now()
  
  for (const theme of themes) {
    const generator = new DramaGenerator(TEST_CONFIG.apiKey)
    const singleStart = Date.now()
    
    try {
      await generator.generateDrama({
        theme,
        style: '都市',
        episodes: 1,
        duration: 2
      })
      
      const singleEnd = Date.now()
      results.push({
        theme,
        success: true,
        duration: (singleEnd - singleStart) / 1000
      })
      
      console.log(`✅ ${theme}: ${(singleEnd - singleStart) / 1000}秒`)
    } catch (error) {
      const singleEnd = Date.now()
      results.push({
        theme,
        success: false,
        error: error.message,
        duration: (singleEnd - singleStart) / 1000
      })
      
      console.log(`❌ ${theme}: ${error.message}`)
    }
  }
  
  const endTime = Date.now()
  const totalDuration = (endTime - startTime) / 1000
  
  console.log('\n📈 性能统计:')
  console.log(`   总耗时：${totalDuration}秒`)
  console.log(`   平均耗时：${(totalDuration / themes.length).toFixed(2)}秒/个`)
  console.log(`   成功：${results.filter(r => r.success).length}/${themes.length}`)
}

/**
 * 测试并发控制
 */
async function testConcurrency() {
  console.log('\n🔀 测试：并发控制性能')
  console.log('='.repeat(50))
  
  const themes = [
    '霸道总裁爱上我',
    '穷小子逆袭',
    '都市仙医',
    '龙王归来',
    '天才萌宝'
  ]
  
  const maxConcurrent = 2
  const running = new Set()
  const results = []
  const startTime = Date.now()
  
  console.log(`   并发数量：${maxConcurrent}`)
  console.log(`   主题数量：${themes.length}`)
  
  for (let i = 0; i < themes.length; i++) {
    // 等待并发控制
    while (running.size >= maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    running.add(i)
    
    const theme = themes[i]
    const singleStart = Date.now()
    
    DramaGenerator.prototype.generateDrama
      .call(new DramaGenerator(TEST_CONFIG.apiKey), {
        theme,
        style: '都市',
        episodes: 1,
        duration: 2
      })
      .then(() => {
        const singleEnd = Date.now()
        results.push({
          theme,
          success: true,
          duration: (singleEnd - singleStart) / 1000
        })
        console.log(`✅ ${theme}: ${(singleEnd - singleStart) / 1000}秒`)
      })
      .catch(error => {
        const singleEnd = Date.now()
        results.push({
          theme,
          success: false,
          error: error.message,
          duration: (singleEnd - singleStart) / 1000
        })
        console.log(`❌ ${theme}: ${error.message}`)
      })
      .finally(() => {
        running.delete(i)
      })
  }
  
  // 等待所有完成
  while (running.size > 0) {
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  const endTime = Date.now()
  const totalDuration = (endTime - startTime) / 1000
  
  console.log('\n📈 性能统计:')
  console.log(`   总耗时：${totalDuration}秒`)
  console.log(`   平均耗时：${(totalDuration / themes.length).toFixed(2)}秒/个`)
  console.log(`   成功：${results.filter(r => r.success).length}/${themes.length}`)
}

/**
 * 运行性能测试
 */
async function runPerformanceTests() {
  console.log('🚀 开始执行性能测试套件')
  console.log('='.repeat(50))
  
  if (!TEST_CONFIG.apiKey || TEST_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.log('\n⚠️ 警告：未配置有效的 API Key')
    return
  }
  
  await testBatchPerformance()
  await testConcurrency()
}

runPerformanceTests().catch(console.error)

export default runPerformanceTests
