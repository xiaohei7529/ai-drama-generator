/**
 * AI 剧本生成器
 * 使用通义千问 API 生成短剧剧本
 */

import axios from 'axios'

class DramaGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://dashscope.aliyuncs.com/api/v1'
    this.model = 'qwen-turbo' // 通义千问模型
  }

  /**
   * 生成短剧剧本
   * @param {Object} options - 生成参数
   * @param {string} options.theme - 主题/题材
   * @param {number} options.episodes - 集数
   * @param {string} options.style - 风格 (都市/言情/逆袭等)
   * @param {number} options.duration - 每集时长 (分钟)
   * @returns {Promise<Object>} 生成的剧本
   */
  async generateDrama(options) {
    const prompt = this.buildPrompt(options)
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/services/aigc/text-generation/generation`,
        {
          model: this.model,
          input: {
            prompt: prompt
          },
          parameters: {
            result_format: 'text',
            max_tokens: 2000,
            temperature: 0.7
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return this.parseResponse(response.data)
    } catch (error) {
      console.error('AI 剧本生成失败:', error)
      throw new Error(`API 调用失败：${error.message}`)
    }
  }

  /**
   * 构建提示词
   */
  buildPrompt(options) {
    const { theme, episodes, style, duration } = options
    
    return `请创作一部${style}题材的短剧剧本，主题"${theme}"。

要求：
1. 共${episodes}集，每集${duration}分钟
2. 剧情紧凑，有反转
3. 人物性格鲜明
4. 对话生动自然
5. 适合短视频平台传播

请提供：
1. 剧名
2. 故事简介 (200 字以内)
3. 主要人物设定
4. 分集大纲 (每集 100 字)
5. 第一集完整剧本`
  }

  /**
   * 解析 API 响应
   */
  parseResponse(data) {
    if (data.output && data.output.text) {
      return {
        success: true,
        content: data.output.text,
        model: this.model,
        timestamp: new Date().toISOString()
      }
    }
    
    throw new Error('API 响应格式异常')
  }

  /**
   * 测试 API 连接
   */
  async testConnection() {
    try {
      const result = await this.generateDrama({
        theme: '测试',
        episodes: 1,
        style: '都市',
        duration: 1
      })
      return { success: true, message: 'API 连接正常' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }
}

export default DramaGenerator
