# 🎬 AI 短剧生成器 (AI Drama Generator)

> 使用 AI 技术自动生成短剧剧本、分镜、配音一站式解决方案

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Version](https://img.shields.io/badge/version-0.1.0-orange)]()
[![AI Powered](https://img.shields.io/badge/AI-Enabled-purple)]()

---

## 📖 项目简介

**AI 短剧生成器** 是一款智能化的短剧创作工具，利用 AI 技术帮助用户快速生成短剧内容。

### 核心功能

- 🤖 **AI 剧本生成** - 输入主题，自动生成完整剧本
- 🎨 **智能分镜** - 根据剧本自动生成分镜脚本
- 🎙️ **AI 配音** - 多角色 AI 语音合成
- 🖼️ **场景生成** - AI 生成场景图片/视频
- 📹 **视频合成** - 自动合成完整短剧视频
- 💻 **跨平台** - 支持 Windows/Mac/Linux

---

## 🚀 快速开始

### 安装

#### Windows

```bash
# 下载安装包
ai-drama-generator-setup-0.1.0.exe

# 或使用 winget
winget install ai-drama-generator
```

#### macOS

```bash
# 使用 Homebrew
brew install --cask ai-drama-generator
```

#### Linux

```bash
# Debian/Ubuntu
sudo apt install ./ai-drama-generator_0.1.0_amd64.deb
```

---

## 🎯 使用场景

### 1. 短剧创作者
- 快速生成剧本创意
- 自动生成分镜脚本
- 降低创作门槛

### 2. 自媒体运营
- 批量生成短剧内容
- 保持内容更新频率
- 提高创作效率

### 3. 教育机构
- 教学演示视频制作
- 学生创作工具
- 降低视频制作成本

### 4. 企业营销
- 产品宣传短剧
- 品牌故事视频
- 营销内容批量生产

---

## 📦 技术架构

```
┌─────────────────────────────────────────────────┐
│                  用户界面层                      │
│              (Electron + Vue3)                  │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  业务逻辑层                      │
│        (剧本生成 | 分镜 | 配音 | 合成)            │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  AI 服务层                        │
│   (LLM | TTS | 图像生成 | 视频生成)              │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  数据存储层                      │
│          (SQLite | 本地文件 | 云端)              │
└─────────────────────────────────────────────────┘
```

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Electron 28 + Vue 3 + TypeScript |
| **AI 服务** | OpenAI API / 通义千问 / 本地模型 |
| **TTS** | Azure TTS / ElevenLabs / VITS |
| **图像** | Stable Diffusion / DALL-E 3 |
| **视频** | FFmpeg + MoviePy |
| **数据库** | SQLite (lowdb) |
| **构建** | Vite + Electron-builder |

---

## 📁 项目结构

```
ai-drama-generator/
├── src/                    # 源代码
│   ├── main/               # 主进程
│   ├── renderer/           # 渲染进程
│   ├── ai/                 # AI 服务模块
│   ├── generator/          # 生成引擎
│   └── utils/              # 工具函数
├── models/                 # AI 模型配置
├── outputs/                # 输出目录
├── package.json            # 项目配置
└── electron-builder.yml    # 打包配置
```

---

## 📋 开发计划

### v0.1.0 (当前)
- [x] 项目基础架构
- [x] Windows 打包支持
- [ ] AI 剧本生成
- [ ] 基础 UI 界面

### v0.2.0
- [ ] 分镜脚本生成
- [ ] AI 配音集成
- [ ] 场景图片生成

### v0.3.0
- [ ] 视频合成引擎
- [ ] 多角色配音
- [ ] 字幕自动生成

### v0.4.0
- [ ] 批量生成
- [ ] 模板系统
- [ ] 云端同步

### v1.0.0
- [ ] 完整功能
- [ ] 性能优化
- [ ] 正式发布

---

## 🔧 开发指南

### 环境要求

- Node.js >= 18.0.0
- Python >= 3.10 (AI 服务)
- FFmpeg >= 5.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

---

## 📄 开源协议

MIT License

---

## 📞 联系方式

- **Issues**: [GitHub Issues](https://github.com/xiaohei7529/ai-drama-generator/issues)
- **Email**: xiaohei7529@gmail.com

---

**Made with ❤️ and 🤖 by AI Drama Team**
