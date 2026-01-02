# JS逆向沙箱化补环境框架

一个完整的 JavaScript 浏览器环境模拟框架，支持 Proxy 递归代理、环境注入、AI 辅助补环境等功能，专为 JS 逆向工程设计。

## 🌟 功能特性

- **🔒 沙箱隔离**: 基于 isolated-vm 实现安全的 JS 执行环境
- **🔄 Proxy 递归代理**: 全对象深度代理，自动记录属性访问和 undefined 项
- **📦 环境代码库**: 完整的 BOM/DOM/WebAPI 本地实现（25+ 环境模块）
- **🤖 AI 补环境**: 支持 OpenAI/DeepSeek，智能生成补环境代码
- **🎯 可视化界面**: 现代化 Web 管理界面，支持监控面板和 Mock 配置
- **📷 快照管理**: 保存/加载环境状态
- **🕷️ 环境采集**: DrissionPage 自动采集浏览器环境
- **⚙️ Mock 配置**: 灵活的返回值 mock 和预设模板

## 📂 项目结构

```
/project-root
├── /server                     # Node 本地服务
│   ├── index.js                # 服务入口
│   ├── /routes                 # API路由
│   │   ├── env.js              # 环境文件管理
│   │   ├── sandbox.js          # 沙箱执行
│   │   ├── ai.js               # AI补环境
│   │   ├── snapshot.js         # 快照管理
│   │   ├── log.js              # 日志管理
│   │   └── mock.js             # Mock配置管理
│   ├── /sandbox                # isolated-vm 封装
│   │   ├── SandboxManager.js   # 沙箱管理器
│   │   ├── ProxyLogger.js      # 代理日志
│   │   └── DeepProxy.js        # 深度代理
│   └── /ai                     # AI 接口封装
│       └── AIProvider.js       # AI提供者
│
├── /web                        # 前端界面
│   ├── index.html
│   ├── /js
│   │   ├── api.js              # API客户端
│   │   └── app.js              # 应用主逻辑
│   └── /css
│       └── style.css           # 样式文件
│
├── /env                        # 环境代码库（核心）
│   ├── /core                   # 核心监控
│   │   └── EnvMonitor.js       # 增强版监控系统（mock/调用链追踪）
│   ├── /bom                    # BOM 相关
│   │   ├── window.js
│   │   ├── navigator.js
│   │   ├── location.js
│   │   ├── history.js
│   │   ├── screen.js
│   │   ├── storage.js
│   │   ├── crypto.js
│   │   ├── performance.js
│   │   ├── console.js
│   │   └── observers.js        # MutationObserver/IntersectionObserver等
│   ├── /dom                    # DOM 相关
│   │   ├── document.js         # 完整Document实现（带监控）
│   │   ├── event.js            # 完整事件系统
│   │   └── elements.js         # 50+种HTML元素类型
│   ├── /webapi                 # Web API
│   │   ├── fetch.js
│   │   ├── xhr.js
│   │   ├── url.js
│   │   ├── blob.js
│   │   └── network.js          # 增强版网络请求（带mock支持）
│   ├── /encoding               # 编码相关
│   │   ├── atob.js
│   │   └── textencoder.js
│   ├── /timer                  # 定时器
│   │   └── timeout.js
│   └── /ai-generated           # AI 补充（独立存放）
│       └── _index.js           # AI 补充汇总入口
│
├── /config                     # 配置文件
│   └── mock-rules.json         # Mock规则配置
│
├── /collector                  # DrissionPage 采集脚本（Python）
│   ├── collect.py              # 采集入口
│   ├── requirements.txt        # Python依赖
│   └── /templates              # 输出的 JSON 模板
│
├── /snapshots                  # 环境快照存储
├── /logs                       # 日志
└── /docs                       # 文档
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- Python >= 3.8 (用于环境采集)
- Chrome/Edge 浏览器 (用于环境采集)

### 安装

```bash
# 克隆项目
git clone https://github.com/lasawang/js-sandbox-env-framework
cd js-sandbox-env-framework

# 安装 Node.js 依赖
npm install

# 安装 Python 依赖（用于环境采集）
cd collector
pip install -r requirements.txt
cd ..
```

### 启动服务

```bash
# 启动 Node 服务
npm start

# 或使用开发模式（自动重启）
npm run dev
```

服务启动后访问: http://localhost:3000

## 📖 API 文档

### 环境管理

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/env/list` | GET | 获取环境代码目录结构 |
| `/api/env/file?path=` | GET | 读取指定环境文件 |
| `/api/env/file` | POST | 写入/更新环境文件 |
| `/api/env/file?path=` | DELETE | 删除AI生成的文件 |

### 沙箱执行

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/sandbox/run` | POST | 执行JS代码 |
| `/api/sandbox/inject` | POST | 注入代码到沙箱 |
| `/api/sandbox/load-env` | POST | 加载环境文件 |
| `/api/sandbox/reset` | POST | 重置沙箱 |
| `/api/sandbox/status` | GET | 获取沙箱状态 |
| `/api/sandbox/undefined` | GET | 获取undefined列表 |
| `/api/sandbox/logs` | GET | 获取所有日志 |

### AI 补环境

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/ai/config` | GET/POST | 获取/设置AI配置 |
| `/api/ai/complete` | POST | 生成补环境代码 |
| `/api/ai/complete-batch` | POST | 批量生成 |
| `/api/ai/apply` | POST | 应用AI生成的代码 |
| `/api/ai/history` | GET | 获取AI历史记录 |
| `/api/ai/summary` | GET | 生成Markdown文档 |

### Mock 配置

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/mock/rules` | GET | 获取所有Mock规则 |
| `/api/mock/rules` | POST | 添加Mock规则 |
| `/api/mock/rules/:id` | DELETE | 删除Mock规则 |
| `/api/mock/rules/:id` | PATCH | 更新Mock规则状态 |
| `/api/mock/presets` | GET | 获取预设模板 |
| `/api/mock/presets/:name/apply` | POST | 应用预设模板 |
| `/api/mock/inject-code` | GET | 生成注入代码 |

### 快照管理

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/snapshot/list` | GET | 列出所有快照 |
| `/api/snapshot/save` | POST | 保存快照 |
| `/api/snapshot/load` | POST | 加载快照 |
| `/api/snapshot/:name` | DELETE | 删除快照 |

## 🎯 使用示例

### 1. 执行代码并检测 undefined

```javascript
// POST /api/sandbox/run
{
    "code": "console.log(navigator.webdriver); console.log(window.chrome);",
    "reset": true
}
```

### 2. 创建DOM元素

```javascript
// POST /api/sandbox/run
{
    "code": "var div = document.createElement('div'); div.id = 'test'; div.className = 'container'; JSON.stringify({tagName: div.tagName, id: div.id})"
}
// 返回: {"tagName":"DIV","id":"test"}
```

### 3. 使用Canvas

```javascript
// POST /api/sandbox/run
{
    "code": "var canvas = document.createElement('canvas'); canvas.width = 800; var ctx = canvas.getContext('2d'); ctx.fillRect(0,0,100,100); canvas.toDataURL()"
}
```

### 4. AI 生成补环境代码

```javascript
// POST /api/ai/complete
{
    "property": "navigator.webdriver",
    "object": "window.navigator",
    "context": "反爬虫检测属性"
}
```

### 5. 应用Mock预设

```javascript
// POST /api/mock/presets/anti-detect/apply
// 自动添加反检测相关的mock规则
```

### 6. 环境采集（Python）

```bash
cd collector
python collect.py https://example.com --output templates/example.json --gen-code
```

## 📝 AI 输出模板规范

AI 生成的补环境代码必须遵循以下格式：

```javascript
/**
 * @env-property {类型} 属性/方法名
 * @description 功能描述
 * @params {参数类型} 参数名 - 参数说明
 * @returns {返回类型} 返回值说明
 * @compatibility 兼容性说明
 * @generated-by AI平台名称
 * @generated-at 生成时间
 */
(function() {
    // 实现代码
})();
```

## 🔧 配置说明

### 环境变量

```bash
# 服务端口
PORT=3000

# OpenAI API Key
OPENAI_API_KEY=sk-xxx

# DeepSeek API Key  
DEEPSEEK_API_KEY=sk-xxx
```

### AI 配置

支持通过 Web 界面或 API 配置：
- **平台选择**: OpenAI / DeepSeek
- **API Key**: 各平台的 API 密钥
- **Base URL**: 自定义 API 地址（可选）

### Mock 预设模板

内置以下预设模板：
- **anti-detect**: 反自动化检测（隐藏 webdriver、chrome 等特征）
- **canvas-fp**: Canvas 指纹（固定 toDataURL/getImageData 返回值）
- **webgl-fp**: WebGL 指纹（模拟显卡信息）
- **audio-fp**: Audio 指纹（固定音频上下文参数）

## 🛡️ 安全说明

- 沙箱基于 isolated-vm，代码在隔离环境中执行
- 环境文件删除仅限于 `ai-generated` 目录
- API Key 仅在服务端存储，不会暴露到前端

## 📦 已实现的环境模块 (25+)

### Core（核心监控）
- ✅ EnvMonitor - 增强版监控系统（mock配置/调用链追踪/日志导出）

### BOM (浏览器对象模型)
- ✅ window - 窗口对象
- ✅ navigator - 浏览器信息
- ✅ location - URL 信息
- ✅ history - 历史记录
- ✅ screen - 屏幕信息
- ✅ localStorage/sessionStorage - 存储
- ✅ crypto - 加密 API
- ✅ performance - 性能 API
- ✅ console - 控制台
- ✅ MutationObserver - DOM 变化监听
- ✅ IntersectionObserver - 可见性监听
- ✅ ResizeObserver - 尺寸变化监听
- ✅ PerformanceObserver - 性能监听

### DOM (文档对象模型)
- ✅ document - 完整文档对象（createElement/querySelector等）
- ✅ Element - 基础元素类
- ✅ Event/CustomEvent - 完整事件系统
- ✅ MouseEvent/KeyboardEvent/TouchEvent - 输入事件
- ✅ **50+ HTML元素类型**:
  - HTMLDivElement, HTMLSpanElement, HTMLParagraphElement
  - HTMLAnchorElement, HTMLImageElement, HTMLButtonElement
  - HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement
  - HTMLFormElement, HTMLLabelElement, HTMLTableElement
  - HTMLCanvasElement (含 2D/WebGL 上下文)
  - HTMLVideoElement, HTMLAudioElement
  - HTMLScriptElement, HTMLStyleElement, HTMLLinkElement
  - HTMLIFrameElement, SVGSVGElement 等...

### Web API
- ✅ fetch - Fetch API（带 mock 支持）
- ✅ XMLHttpRequest - XHR（带 mock 支持）
- ✅ URL/URLSearchParams - URL 处理
- ✅ Blob/File/FileReader - 文件处理
- ✅ FormData - 表单数据
- ✅ Headers/Request/Response - Fetch 相关
- ✅ AbortController/AbortSignal - 请求控制

### 编码
- ✅ atob/btoa - Base64
- ✅ TextEncoder/TextDecoder - 文本编码

### 定时器
- ✅ setTimeout/setInterval - 定时器

## 🔄 工作流程

```
1. DrissionPage 采集目标站点环境 → 输出 JSON 模板
                ↓
2. Node 服务读取 JSON → 转换为 JS 环境代码 → 存入 /env 目录
                ↓
3. 执行目标 JS 代码 → isolated-vm 沙箱加载环境 → Proxy 监控
                ↓
4. 发现 undefined → 前端界面展示缺失列表
                ↓
5. 开发者选择：手动补充 或 AI 辅助生成
                ↓
6. AI 生成 → 预览确认 → 写入 /env/ai-generated/ → 记录日志
                ↓
7. 重新执行验证 → 通过 → 保存快照备用
```

## 🆕 v2.0 新增功能

- **增强版监控系统**: 完整的调用链追踪、mock 配置管理、日志导出
- **50+ HTML 元素类型**: 支持 div/canvas/video/audio/script/iframe 等所有常用元素
- **Observer API**: MutationObserver、IntersectionObserver、ResizeObserver 等
- **增强版网络请求**: XMLHttpRequest 和 fetch 支持灵活的 mock 配置
- **Mock 预设模板**: 内置反检测、Canvas指纹、WebGL指纹、Audio指纹等预设
- **Mock 配置 API**: 完整的 mock 规则管理接口
- **监控面板**: 实时查看调用统计、热点方法、调用链等

## 📄 License

MIT License
