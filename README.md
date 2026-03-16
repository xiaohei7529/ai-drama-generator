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

## 💻 个人部署操作

### 方式一：源码部署 (推荐开发者)

#### 1. 环境准备

**Node.js** (v18+):
```bash
# 检查版本
node --version

# 安装 (如未安装)
# Windows: 下载安装包 https://nodejs.org/
# macOS: brew install node
# Linux: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs
```

**Git**:
```bash
# 检查 Git
git --version

# 安装 (如未安装)
# Windows: https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt-get install git
```

#### 2. 克隆项目

```bash
# 克隆仓库
git clone https://github.com/xiaohei7529/ai-drama-generator.git
cd ai-drama-generator

# 查看项目结构
ls -la
```

#### 3. 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 安装通义千问 SDK (可选)
npm install dashscope
```

#### 4. 配置 API Key

**方式 A: 通过设置页面配置**
```
1. 启动应用后
2. 前往 设置 页面
3. 选择 AI 提供商 (通义千问/文心一言/讯飞星火)
4. 输入 API Key
5. 点击"测试连接"
6. 保存配置
```

**方式 B: 环境变量配置**
```bash
# Windows (PowerShell)
$env:DASHSCOPE_API_KEY="your_api_key_here"

# macOS/Linux
export DASHSCOPE_API_KEY="your_api_key_here"

# 或创建 .env 文件
echo "DASHSCOPE_API_KEY=your_api_key_here" > .env
```

**获取 API Key**:
- 通义千问：https://dashscope.console.aliyun.com/
- 文心一言：https://cloud.baidu.com/product/wenxinworkshop
- 讯飞星火：https://console.xfyun.cn/

#### 5. 启动开发服务器

```bash
# 启动应用
npm run dev

# 访问地址
# http://localhost:5173
```

#### 6. 构建生产版本

```bash
# 构建应用
npm run build

# 打包桌面应用
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

---

### 方式二：Docker 部署 (推荐生产环境)

#### 1. 安装 Docker

```bash
# 检查 Docker
docker --version

# 安装 Docker
# Windows/macOS: 下载 Docker Desktop https://www.docker.com/products/docker-desktop
# Linux: curl -fsSL https://get.docker.com | sh
```

#### 2. 拉取镜像

```bash
# 拉取最新镜像
docker pull xiaohei7529/ai-drama-generator:latest

# 或指定版本
docker pull xiaohei7529/ai-drama-generator:v0.2.0
```

#### 3. 运行容器

```bash
# 基本运行
docker run -d -p 5173:5173 --name ai-drama xiaohei7529/ai-drama-generator:latest

# 配置 API Key
docker run -d -p 5173:5173 \
  -e DASHSCOPE_API_KEY="your_api_key_here" \
  --name ai-drama \
  xiaohei7529/ai-drama-generator:latest

# 持久化存储
docker run -d -p 5173:5173 \
  -e DASHSCOPE_API_KEY="your_api_key_here" \
  -v ai-drama-data:/app/data \
  --name ai-drama \
  xiaohei7529/ai-drama-generator:latest
```

#### 4. 访问应用

```
# 浏览器访问
http://localhost:5173

# 查看日志
docker logs -f ai-drama

# 停止容器
docker stop ai-drama

# 删除容器
docker rm ai-drama
```

#### 5. Docker Compose 部署

创建 `docker-compose.yml`:
```yaml
version: '3.8'

services:
  ai-drama:
    image: xiaohei7529/ai-drama-generator:latest
    container_name: ai-drama-generator
    ports:
      - "5173:5173"
    environment:
      - DASHSCOPE_API_KEY=your_api_key_here
      - ERNIE_API_KEY=your_ernie_key_here
    volumes:
      - ai-drama-data:/app/data
    restart: unless-stopped

volumes:
  ai-drama-data:
```

启动服务:
```bash
# 启动
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止
docker-compose down
```

---

### 方式三：手动部署 (高级用户)

#### 1. 下载源码

```bash
# 下载源码包
wget https://github.com/xiaohei7529/ai-drama-generator/archive/refs/heads/master.zip
unzip master.zip
cd ai-drama-generator-master
```

#### 2. 安装依赖

```bash
# 安装依赖
npm install --production

# 安装可选依赖
npm install dashscope electron electron-builder
```

#### 3. 配置应用

创建 `config.js`:
```javascript
module.exports = {
  port: 5173,
  host: '0.0.0.0',
  api: {
    dashscope: {
      key: 'your_api_key_here',
      model: 'qwen-turbo'
    },
    ernie: {
      key: 'your_ernie_key_here'
    },
    iflytek: {
      key: 'your_iflytek_key_here'
    }
  },
  storage: {
    path: './data',
    maxSize: '1GB'
  }
}
```

#### 4. 启动应用

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm run start
```

---

## 🔧 部署故障排除

### 常见问题

#### 1. 依赖安装失败

**问题**: `npm install` 报错

**解决**:
```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com
npm install
```

#### 2. API Key 配置无效

**问题**: API 连接测试失败

**解决**:
```bash
# 检查 API Key 是否正确
echo $DASHSCOPE_API_KEY

# 测试 API 连接
curl -X POST "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen-turbo","input":{"prompt":"测试"}}'
```

#### 3. 端口被占用

**问题**: 端口 5173 已被占用

**解决**:
```bash
# 查找占用端口的进程
lsof -i :5173

# 杀死进程
kill -9 <PID>

# 或修改端口
export PORT=3000
npm run dev
```

#### 4. Docker 容器无法启动

**问题**: Docker 容器启动失败

**解决**:
```bash
# 查看日志
docker logs ai-drama-generator

# 检查资源
docker stats

# 重启容器
docker restart ai-drama-generator

# 重新创建容器
docker rm -f ai-drama-generator
docker run -d -p 5173:5173 --name ai-drama-generator xiaohei7529/ai-drama-generator:latest
```

---

## 📊 性能优化建议

### 开发环境

1. **使用热重载**:
```bash
npm run dev  # 自动热重载
```

2. **代码分割**:
```javascript
// 按需加载组件
const Create = () => import('@/views/Create.vue')
```

3. **缓存优化**:
```bash
# 启用 npm 缓存
npm config set cache ~/.npm-cache
```

### 生产环境

1. **使用 CDN**:
```html
<!-- 在 index.html 中使用 CDN -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

2. **Gzip 压缩**:
```bash
# 安装压缩插件
npm install compression-webpack-plugin
```

3. **图片优化**:
```bash
# 压缩图片
npm install image-webpack-loader
```

---

## 🔒 安全建议

### API Key 安全

1. **不要提交到 Git**:
```bash
# 添加到 .gitignore
echo ".env" >> .gitignore
echo "config.js" >> .gitignore
```

2. **使用环境变量**:
```bash
# 生产环境使用环境变量
export DASHSCOPE_API_KEY="your_key"
```

3. **定期更换 Key**:
```
建议每 3 个月更换一次 API Key
```

### 数据安全

1. **加密存储**:
```javascript
// 使用 crypto 模块加密敏感数据
const crypto = require('crypto')
```

2. **备份数据**:
```bash
# 定期备份数据目录
tar -czf backup-$(date +%Y%m%d).tar.gz ./data
```

---

## 📞 获取帮助

### 文档资源

- [功能文档](docs/CURRENT_FEATURES.md)
- [AI 集成方案](docs/AI_INTEGRATION_PLAN.md)
- [待执行任务](docs/PENDING_TASKS.md)
- [Bug 反馈](docs/BUG_REPORT.md)

### 联系方式

- **GitHub**: https://github.com/xiaohei7529/ai-drama-generator
- **Issues**: https://github.com/xiaohei7529/ai-drama-generator/issues
- **Email**: xiaohei7529@gmail.com

### 社区支持

- 加入 Discord 社区
- 关注 Twitter 更新
- 加入 Telegram 群组

---

## 📄 开源协议

本项目采用 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

*AI Drama Generator v0.2.0 - 让 AI 帮你创作精彩短剧！* 🎬

**最后更新**: 2026-03-16

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
