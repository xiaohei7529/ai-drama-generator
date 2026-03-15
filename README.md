# 🎬 AI 短剧生成器 (AI Drama Generator)

> 使用 AI 技术自动生成短剧剧本、分镜、配音一站式解决方案

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Version](https://img.shields.io/badge/version-0.2.0-orange)]()
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
ai-drama-generator-setup-0.2.0.exe

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
# 下载并安装
wget https://github.com/xiaohei7529/ai-drama-generator/releases/download/v0.2.0/ai-drama-generator-0.2.0.AppImage
chmod +x ai-drama-generator-0.2.0.AppImage
./ai-drama-generator-0.2.0.AppImage
```

---

## 📊 开发状态

**当前版本**: v0.2.0  
**开发状态**: 🟡 开发中  
**最后更新**: 2026-03-15

### 本周进展 (2026-03-09 至 2026-03-15)

**核心成就**:
- ✅ AI 剧本生成功能开发完成
- ✅ 通义千问 SDK 集成
- ✅ DramaGenerator 类实现
- ✅ API 调研和文档编写

**Git 统计**:
- 本周提交：15 次
- 代码行数：800+ 行
- 文档数量：8 份

**已完成功能**:
- ✅ 项目基础架构
- ✅ AI 集成方案
- ✅ AI 剧本生成器模块
- ✅ 每日报告机制

**进行中**:
- 🔄 API Key 配置 UI
- 🔄 测试和优化

**下周计划**:
- [ ] API Key 配置 UI 完成
- [ ] AI 生成功能测试
- [ ] 用户界面优化
- [ ] v0.2.0 发布准备

---

## 📁 项目结构

```
ai-drama-generator/
├── src/
│   ├── main/           # Electron 主进程
│   ├── preload/        # 预加载脚本
│   ├── renderer/       # Vue 渲染进程
│   └── ai/             # AI 模块
│       └── drama-generator.js  # 剧本生成器
├── docs/               # 文档
├── scripts/            # 脚本
├── reports/            # 报告
└── package.json        # 项目配置
```

---

## 🛠️ 技术栈

### 桌面应用
- **框架**: Electron 28.0
- **前端**: Vue 3.4 + Element Plus 2.5
- **构建**: Vite 5.0
- **打包**: electron-builder

### AI 服务
- **通义千问** (DashScope) - 剧本生成
- **其他 AI** - 待集成

### 状态管理
- **Pinia** 2.1

---

## 📖 文档导航

| 文档 | 说明 |
|------|------|
| [AI 集成方案](docs/AI_INTEGRATION_PLAN.md) | AI 集成详细方案 |
| [开发路线图](ROADMAP.md) | 项目发展规划 |
| [任务清单](TASK_LIST.md) | 开发任务列表 |
| [任务跟踪](TASK_TRACKER.md) | 任务进度跟踪 |

---

## 🔧 配置说明

### 环境变量

```bash
# AI 提供商 API Key
DASHSCOPE_API_KEY=your_key  # 通义千问
```

### API Key 获取

1. 访问阿里云 DashScope 控制台
2. 注册/登录账号
3. 创建 API Key
4. 复制到项目配置

---

## 🤝 贡献指南

欢迎贡献代码、文档或建议！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📄 开源协议

本项目采用 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

感谢以下开源项目：
- [Electron](https://www.electronjs.org/)
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [DashScope](https://dashscope.aliyun.com/)

---

## 📞 联系方式

- **GitHub**: https://github.com/xiaohei7529/ai-drama-generator
- **Issues**: https://github.com/xiaohei7529/ai-drama-generator/issues
- **Email**: xiaohei7529@gmail.com

---

*AI Drama Generator v0.2.0 - 让 AI 帮你创作精彩短剧！* 🎬

**最后更新**: 2026-03-15
