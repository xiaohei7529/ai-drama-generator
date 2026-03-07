# 🎬 AI 短剧生成器 - AI 服务集成方案

**版本**: v0.2.0  
**创建时间**: 2026-03-07 19:50  
**目标**: 接入 LLM API 实现剧本生成功能

---

## 🎯 功能目标

实现 AI 剧本生成引擎，支持：
- 输入故事创意，自动生成完整剧本
- 支持多种剧本风格（言情/悬疑/喜剧等）
- 剧本编辑和优化
- 角色管理

---

## 🤖 AI 提供商选择

### 推荐方案

| 提供商 | 模型 | 优势 | 成本 |
|--------|------|------|------|
| **通义千问** | Qwen-Max | 中文优化，成本低 | ¥0.02/1K tokens |
| **OpenAI** | GPT-4 | 质量最高 | $0.03/1K tokens |
| **豆包** | Doubao-Pro | 免费额度多 | 免费 |

### 技术选型

**首选**: 通义千问 (DashScope)
- 中文理解能力强
- 成本低
- 阿里云稳定

**备用**: OpenAI GPT-4
- 质量最高
- 国际化支持

---

## 🔧 技术实现

### 1. API 集成

#### 通义千问 API
```javascript
// src/ai/providers/dashscope.js
const DashScope = require('@aliyun/dashscope');

class ScriptGenerator {
  constructor(apiKey) {
    this.client = new DashScope({ apiKey });
  }

  async generateScript(idea, style = '言情', episodes = 5) {
    const prompt = this.buildPrompt(idea, style, episodes);
    const response = await this.client.generate(prompt);
    return this.parseScript(response);
  }

  buildPrompt(idea, style, episodes) {
    return `请创作一个${style}题材的短剧剧本，共${episodes}集。
    
故事创意：${idea}

要求：
1. 每集 2-3 分钟
2. 包含角色设定
3. 包含分集大纲
4. 情节紧凑，有冲突和悬念

请按以下格式输出：
# 剧本标题
## 角色设定
## 分集大纲
`;
  }

  parseScript(response) {
    // 解析 AI 返回的剧本内容
    return {
      title: this.extractTitle(response),
      characters: this.extractCharacters(response),
      episodes: this.extractEpisodes(response)
    };
  }
}

module.exports = ScriptGenerator;
```

### 2. 配置文件

```javascript
// src/config/ai.config.js
module.exports = {
  providers: {
    dashscope: {
      apiKey: process.env.DASHSCOPE_API_KEY,
      model: 'qwen-max',
      timeout: 30000
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4',
      timeout: 30000
    }
  },
  defaultProvider: 'dashscope'
};
```

### 3. Electron 主进程集成

```javascript
// src/main/ai-service.js
const { ipcMain } = require('electron');
const ScriptGenerator = require('../ai/providers/dashscope');

let generator = null;

ipcMain.handle('ai:initialize', async (event, config) => {
  generator = new ScriptGenerator(config.apiKey);
  return { success: true };
});

ipcMain.handle('ai:generate-script', async (event, idea, options) => {
  if (!generator) {
    throw new Error('AI 服务未初始化');
  }
  
  try {
    const script = await generator.generateScript(
      idea,
      options.style,
      options.episodes
    );
    return { success: true, data: script };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

### 4. 渲染进程调用

```javascript
// src/renderer/composables/useAI.js
import { ipcRenderer } from 'electron';

export function useAI() {
  const initialize = async (apiKey) => {
    return await ipcRenderer.invoke('ai:initialize', { apiKey });
  };

  const generateScript = async (idea, options = {}) => {
    return await ipcRenderer.invoke('ai:generate-script', idea, options);
  };

  return {
    initialize,
    generateScript
  };
}
```

---

## 📦 依赖安装

```bash
# 通义千问 SDK
npm install @aliyun/dashscope

# 或 OpenAI SDK
npm install openai

# 环境变量管理
npm install dotenv
```

---

## 🔐 API Key 管理

### 方式一：环境变量

创建 `.env` 文件：
```bash
DASHSCOPE_API_KEY=your-dashscope-api-key
OPENAI_API_KEY=your-openai-api-key
```

### 方式二：应用内配置

在应用设置中提供 UI 界面让用户输入 API Key，保存到本地存储。

---

## 📝 测试用例

```javascript
// tests/ai/script-generator.test.js
const ScriptGenerator = require('../../src/ai/providers/dashscope');

describe('ScriptGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new ScriptGenerator(process.env.DASHSCOPE_API_KEY);
  });

  test('should generate script with valid idea', async () => {
    const idea = '霸道总裁爱上我';
    const result = await generator.generateScript(idea, '言情', 3);
    
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('characters');
    expect(result.episodes).toHaveLength(3);
  });

  test('should support different styles', async () => {
    const styles = ['言情', '悬疑', '喜剧', '动作'];
    
    for (const style of styles) {
      const result = await generator.generateScript('测试创意', style, 1);
      expect(result).toBeDefined();
    }
  });
});
```

---

## 🚀 开发计划

### 第 1 周 (2026-03-07 ~ 2026-03-14)
- [ ] 集成通义千问 API
- [ ] 实现剧本生成引擎
- [ ] 编写单元测试
- [ ] UI 界面开发

### 第 2 周 (2026-03-14 ~ 2026-03-21)
- [ ] 支持多种剧本风格
- [ ] 剧本编辑功能
- [ ] 角色管理
- [ ] 性能优化

### 第 3 周 (2026-03-21 ~ 2026-03-28)
- [ ] 接入备用 AI 提供商
- [ ] 批量生成
- [ ] 模板系统
- [ ] 用户测试

---

## 📊 成本估算

### 通义千问定价

| 模型 | 输入价格 | 输出价格 |
|------|---------|---------|
| Qwen-Max | ¥0.04/1K tokens | ¥0.12/1K tokens |
| Qwen-Plus | ¥0.02/1K tokens | ¥0.06/1K tokens |
| Qwen-Turbo | ¥0.008/1K tokens | ¥0.02/1K tokens |

### 单次生成成本

假设生成一个 5 集剧本：
- 输入：500 tokens
- 输出：3000 tokens
- **成本**: 约 ¥0.4 (Qwen-Plus)

### 免费额度

- 通义千问：新用户赠送 ¥20 额度
- 可生成约 50 个剧本

---

## 🎯 成功指标

| 指标 | 目标 | 实测 |
|------|------|------|
| 剧本生成时间 | <30 秒 | - |
| 剧本质量评分 | >4.0/5.0 | - |
| 用户满意度 | >80% | - |
| API 调用成功率 | >99% | - |

---

**维护者**: xiaohei7529  
**最后更新**: 2026-03-07 19:50

**🎬 AI Short Drama - 让 AI 帮你创作精彩短剧！**
