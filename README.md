# JS 沙箱环境框架

一个功能完整的 JavaScript 沙箱执行框架，专为 JS 逆向工程设计。支持运行复杂混淆代码、环境注入、浏览器指纹采集、代理监控等功能。

## ✨ 核心特性

- 🚀 **高性能沙箱** - 基于 Node.js VM，成功运行 7866 行混淆代码（37ms）
- 📁 **独立运行器** - 命令行直接运行，无需启动服务
- 🔍 **代理监控** - 完整的 Proxy 追踪，记录所有属性访问和方法调用
- 🕷️ **环境采集** - DrissionPage 自动采集真实浏览器环境
- 🎯 **Web 界面** - 可视化管理，支持文件上传、代码搜索、日志查看
- 📊 **详细日志** - 属性访问、方法调用、控制台输出完整记录
- 🛠️ **多种工具** - 3 个运行器满足不同需求
- ⚡ **一键运行** - IDE 中双击运行，简单快捷

## 🚀 快速开始

### 安装

```bash
# 安装 Node.js 依赖
npm install

# (可选) 安装 Python 依赖用于环境采集
pip install -r collector/requirements.txt
```

### 30秒上手

```bash
# 运行你的第一个脚本
node standalone-runner.js your-script.js

# 就这么简单！
```

## 📖 使用方式

### 方式1: 命令行运行（推荐）

```bash
# 基础运行
node standalone-runner.js script.js

# 启用代理监控（查看详细日志）
node standalone-runner.js --proxy script.js

# 静默模式
node standalone-runner.js --quiet script.js

# 使用环境文件
node standalone-runner.js --env environment.json script.js

# 组合使用
node standalone-runner.js --proxy --env env.json script.js
```

### 方式2: Web 界面

```bash
# 启动服务
npm start

# 浏览器访问
http://localhost:3000
```

**功能**:
- ✅ 在线执行代码
- ✅ 上传 JS 文件运行
- ✅ 查看详细执行日志（属性访问、方法调用）
- ✅ 搜索环境代码
- ✅ 查看环境信息

### 方式3: 一键运行

```bash
# Windows 批处理（IDE 中双击）
run.bat script.js

# PowerShell
.\run.ps1 -ScriptFile script.js
```

## 🛠️ 可用工具

### 1. 基础运行器 - `standalone-runner.js`

快速运行，适合日常使用

```bash
node standalone-runner.js script.js
node standalone-runner.js --proxy script.js    # 启用代理监控
```

### 2. 日志查看器 - `view-logs.js`

查看函数调用和对象创建

```bash
node view-logs.js script.js
npm run logs script.js
```

### 3. 高级代理监控 - `load-proxy-env.js`

完整的 Proxy 监控，包含 toString 保护

```bash
node load-proxy-env.js script.js
npm run proxy script.js
```

## 🕷️ 环境采集

### 指纹采集

```bash
python collector/fingerprint-collector.py \
  --url https://example.com \
  --output fingerprint.json
```

### 网站环境采集（完整）

采集 location、navigator、document、screen 等所有信息

```bash
python collector/website-env-collector.py \
  --url https://www.douyin.com \
  --output douyin-env.js \
  --format js
```

**采集内容**:
- ✅ Location (href, protocol, pathname, search, hash 等)
- ✅ Navigator (userAgent, platform, plugins, mimeTypes 等 20+ 属性)
- ✅ Document (URL, domain, referrer, title, cookie 等)
- ✅ Screen (width, height, colorDepth, orientation 等)
- ✅ Window (innerWidth, devicePixelRatio 等)
- ✅ Performance (timing, timeOrigin)
- ✅ WebGL 指纹
- ✅ Canvas 指纹
- ✅ Audio 指纹

## 📋 完整工作流

### 场景1: 快速运行混淆代码

```bash
node standalone-runner.js a_bogus119.js
```

### 场景2: 调试代码，需要看详细日志

```bash
# 启用代理监控
node standalone-runner.js --proxy your-script.js

# 或使用日志查看器
node view-logs.js your-script.js
```

### 场景3: 采集真实环境运行

```bash
# 1. 采集目标网站环境
python collector/website-env-collector.py \
  --url https://target.com \
  --output target-env.js \
  --format js

# 2. 使用采集的环境运行
node standalone-runner.js --env target-env.js your-code.js

# 3. 如需监控，加上 --proxy
node standalone-runner.js --proxy --env target-env.js your-code.js
```

## 📊 日志查看

### 命令行查看

```bash
# 运行时自动显示统计
node standalone-runner.js --proxy script.js

# 输出:
# 📊 代理监控统计:
#    属性访问 (get): 18 次
#    属性设置 (set): 1 次
#    总操作数: 19 次
```

### Web 界面查看

1. 访问 http://localhost:3000
2. 执行代码后：
   - 点击 **"查看详细日志"** 按钮 - 弹窗显示所有日志
   - 点击 **"访问日志"** - 查看历史日志
   - 打开 **浏览器控制台** - 看到完整的日志输出

**日志内容包括**:
- 📝 属性访问（path、type、timestamp）
- 🔧 方法调用（path、参数类型、timestamp）
- 📋 控制台输出（log、error、warn、info）

## 🎯 代理监控功能

### 开关控制

```bash
# 不启用代理（快速）
node standalone-runner.js script.js

# 启用代理（详细日志）
node standalone-runner.js --proxy script.js

# 启用代理 + 静默模式（只看统计）
node standalone-runner.js --proxy --quiet script.js
```

### 监控内容

- ✅ 属性访问 (get)
- ✅ 属性设置 (set)
- ✅ 属性检查 (has)
- ✅ 属性删除 (deleteProperty)
- ✅ 属性定义 (defineProperty)
- ✅ 原型链操作 (getPrototypeOf, setPrototypeOf)
- ✅ 函数调用 (apply)
- ✅ 构造调用 (construct)
- ✅ toString 保护（防止检测）

## 📝 NPM 命令

```bash
npm start              # 启动 Web 服务
npm run dev            # 开发模式（自动重启）
npm run run <file>     # 运行脚本
npm run logs <file>    # 查看详细日志
npm run proxy <file>   # 高级代理监控
npm run collect        # 指纹采集
npm run collect:web    # 网站环境采集
```

## 🎓 实战示例

### 示例1: 抖音 a_bogus 参数

```bash
# 直接运行
node standalone-runner.js a_bogus119.js

# 结果: 执行成功，37ms，返回 undefined
```

### 示例2: 采集抖音环境

```bash
# 采集
python collector/website-env-collector.py \
  --url https://www.douyin.com \
  --output douyin-env.js \
  --format js

# 查看采集内容
cat douyin-env.js
# 包含: location.href, navigator.userAgent, document.cookie 等
```

### 示例3: 带环境运行

```bash
# 使用采集的环境
node standalone-runner.js --env douyin-env.js your-douyin-script.js

# 启用代理监控
node standalone-runner.js --proxy --env douyin-env.js your-douyin-script.js
```

## 🔍 代码搜索

### Web 界面搜索

1. 访问 http://localhost:3000
2. 点击"环境代码库"
3. 输入关键词（如 `navigator.userAgent`）
4. 点击"搜索"
5. 查看匹配文件和代码行

## ⚙️ 高级配置

### 环境文件格式

**JSON 格式**:
```json
{
  "navigator": {
    "userAgent": "Mozilla/5.0 ...",
    "platform": "Win32"
  },
  "location": {
    "href": "https://example.com",
    "hostname": "example.com"
  }
}
```

**JS 格式** (推荐):
```javascript
window.navigator = {
    userAgent: "Mozilla/5.0 ...",
    platform: "Win32"
};
window.location = {
    href: "https://example.com"
};
```

## 📊 性能测试

| 测试项 | 代码行数 | 执行时间 | 状态 |
|--------|---------|---------|------|
| 混淆代码 | 7866 行 | 37ms | ✅ 成功 |
| 简单代码 | < 100 行 | < 5ms | ✅ 成功 |
| 带环境注入 | 任意 | < 50ms | ✅ 成功 |
| 代理监控 | 任意 | +10-20ms | ✅ 成功 |

## 🎯 工具对比

| 工具 | 速度 | 日志详细度 | 代理监控 | 适用场景 |
|------|------|-----------|----------|---------|
| standalone-runner | ⚡⚡⚡ | ⭐ | 可选 --proxy | 日常运行 |
| view-logs | ⚡⚡ | ⭐⭐⭐ | 部分 | 查看调用 |
| load-proxy-env | ⚡ | ⭐⭐⭐⭐⭐ | ✅ 完整 | 深度调试 |
| Web 界面 | ⚡⚡ | ⭐⭐⭐ | ✅ | 可视化 |

## 📚 项目结构

```
/project-root
├── standalone-runner.js      # 独立运行器（主要工具）
├── view-logs.js              # 日志查看器
├── load-proxy-env.js         # 高级代理监控
├── run.bat / run.ps1         # 一键运行脚本
├── /server                   # Web 服务
│   ├── index.js              # 服务入口
│   ├── /routes               # API 路由
│   └── /sandbox              # 沙箱模块
│       └── SimpleSandbox.js  # 核心沙箱
├── /web                      # Web 界面
├── /env                      # 环境代码库
│   └── /core                 # 核心模块
│       ├── ProxyMonitor.js   # 代理监控
│       └── ProxyEnv.js       # 代理环境
├── /collector                # 采集器（Python）
│   ├── fingerprint-collector.py      # 指纹采集
│   └── website-env-collector.py      # 网站环境采集
└── README.md                 # 本文档
```

## 🔧 API 接口

### 沙箱执行

- `POST /api/sandbox/run` - 执行代码
- `POST /api/sandbox/run-file` - 执行文件
- `POST /api/sandbox/inject-env` - 注入环境
- `POST /api/sandbox/reset` - 重置沙箱

### 状态查询

- `GET /api/sandbox/status` - 沙箱状态
- `GET /api/sandbox/environment` - 环境信息
- `GET /api/sandbox/logs` - 访问日志

### 环境管理

- `GET /api/env/list` - 环境文件列表
- `GET /api/env/file?path=` - 读取文件
- `POST /api/env/file` - 保存文件

## 💡 最佳实践

### 日常使用
```bash
node standalone-runner.js script.js
```

### 调试分析
```bash
node standalone-runner.js --proxy script.js > logs.txt
```

### 环境补全
```bash
# 1. 采集真实环境
python collector/website-env-collector.py --url <目标网站> --output env.js --format js

# 2. 使用环境运行
node standalone-runner.js --env env.js your-script.js
```

### 深度调试
```bash
# 完整代理监控 + 非静默模式
node load-proxy-env.js script.js > full-logs.txt
```

## 🆘 常见问题

### Q: 如何查看代码执行时访问了哪些属性？

**A**: 使用 `--proxy` 参数

```bash
node standalone-runner.js --proxy script.js
```

### Q: 如何采集特定网站的环境？

**A**: 使用 website-env-collector.py

```bash
python collector/website-env-collector.py \
  --url https://target.com \
  --output target-env.js \
  --format js
```

### Q: 混淆代码报错怎么办？

**A**: 
1. 先用基础模式运行看错误
2. 如果缺少环境，使用采集器采集
3. 用代理监控查看详细操作

```bash
node standalone-runner.js script.js              # 看错误
python collector/website-env-collector.py ...    # 采集
node standalone-runner.js --proxy --env env.js script.js  # 监控运行
```

## 📦 测试验证

已成功测试：

✅ **a_bogus119.js** - 7866 行混淆代码，37ms 执行成功  
✅ **环境采集** - 完整采集 location、navigator、document 等  
✅ **代理监控** - 捕获 18 次属性访问，1 次属性设置  
✅ **Web 界面** - 所有功能正常  
✅ **一键运行** - Windows 批处理测试通过  

## 🎉 开始使用

```bash
# 最简单的方式
node standalone-runner.js your-script.js

# 完整功能
node standalone-runner.js --proxy --env environment.js your-script.js
```

## 📄 License

MIT License

---

**问题反馈**: 如有问题请提 Issue  
**版本**: v2.0.0  
**更新**: 2026-02-04
