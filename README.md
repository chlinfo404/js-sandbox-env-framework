# JS逆向沙箱化补环境框架

一个完整的 JavaScript 浏览器环境模拟框架，支持 Proxy 递归代理、环境注入、AI 辅助补环境等功能，专为 JS 逆向工程设计。

## 🌟 功能特性

- **🔒 沙箱隔离**: 基于 isolated-vm 实现安全的 JS 执行环境
- **🔄 Proxy 递归代理**: 全对象深度代理，自动记录属性访问和 undefined 项
- **📦 环境代码库**: 完整的 BOM/DOM/WebAPI 本地实现
- **🤖 AI 补环境**: 支持 OpenAI/DeepSeek，智能生成补环境代码
- **🎯 可视化界面**: 现代化 Web 管理界面
- **📷 快照管理**: 保存/加载环境状态
- **🕷️ 环境采集**: DrissionPage 自动采集浏览器环境

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
│   │   └── log.js              # 日志管理
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
│   ├── /bom                    # BOM 相关
│   │   ├── window.js
│   │   ├── navigator.js
│   │   ├── location.js
│   │   ├── history.js
│   │   ├── screen.js
│   │   ├── storage.js
│   │   ├── crypto.js
│   │   ├── performance.js
│   │   └── console.js
│   ├── /dom                    # DOM 相关
│   │   ├── document.js
│   │   └── event.js
│   ├── /webapi                 # Web API
│   │   ├── fetch.js
│   │   ├── xhr.js
│   │   ├── url.js
│   │   └── blob.js
│   ├── /encoding               # 编码相关
│   │   ├── atob.js
│   │   └── textencoder.js
│   ├── /timer                  # 定时器
│   │   └── timeout.js
│   └── /ai-generated           # AI 补充（独立存放）
│       └── _index.js           # AI 补充汇总入口
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
git clone <repository-url>
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

### 2. AI 生成补环境代码

```javascript
// POST /api/ai/complete
{
    "property": "navigator.webdriver",
    "object": "window.navigator",
    "context": "反爬虫检测属性"
}
```

### 3. 环境采集（Python）

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

## 🛡️ 安全说明

- 沙箱基于 isolated-vm，代码在隔离环境中执行
- 环境文件删除仅限于 `ai-generated` 目录
- API Key 仅在服务端存储，不会暴露到前端

## 📦 已实现的环境模块

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

### DOM (文档对象模型)
- ✅ document - 文档对象
- ✅ Element - 元素类
- ✅ Event - 事件系统

### Web API
- ✅ fetch - Fetch API
- ✅ XMLHttpRequest - XHR
- ✅ URL/URLSearchParams - URL 处理
- ✅ Blob/File/FileReader - 文件处理
- ✅ FormData - 表单数据

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

## 📄 License

MIT License
