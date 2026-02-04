#!/usr/bin/env node
/**
 * 独立的沙箱脚本运行器
 * 可以直接在命令行中使用
 * 
 * 用法:
 *   node standalone-runner.js script.js
 *   node standalone-runner.js --code "console.log('Hello')"
 *   node standalone-runner.js --env env.json script.js
 */

import vm from 'vm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 解析命令行参数
const args = process.argv.slice(2);
let scriptFile = null;
let codeString = null;
let envFile = null;
let timeout = 60000;
let enableProxy = false;
let quietMode = false;

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--code' && i + 1 < args.length) {
        codeString = args[++i];
    } else if (arg === '--env' && i + 1 < args.length) {
        envFile = args[++i];
    } else if (arg === '--timeout' && i + 1 < args.length) {
        timeout = parseInt(args[++i]);
    } else if (arg === '--proxy' || arg === '-p') {
        enableProxy = true;
    } else if (arg === '--quiet' || arg === '-q') {
        quietMode = true;
    } else if (arg === '--help' || arg === '-h') {
        console.log(`
沙箱脚本运行器

用法:
  node standalone-runner.js [选项] <脚本文件>
  node standalone-runner.js --code "<JS代码>"

选项:
  --code <代码>       直接执行代码字符串
  --env <文件>        加载环境文件（JSON或JS）
  --proxy, -p        启用高级代理监控（记录所有属性访问）
  --quiet, -q        静默模式（减少日志输出）
  --timeout <毫秒>    设置超时时间（默认60000ms）
  --help, -h         显示帮助信息

示例:
  node standalone-runner.js test.js
  node standalone-runner.js --proxy test.js                    # 启用代理监控
  node standalone-runner.js --code "console.log('Hello World')"
  node standalone-runner.js --env environment.json script.js
  node standalone-runner.js --proxy --env env.js script.js    # 环境+代理
        `);
        process.exit(0);
    } else if (!scriptFile && !codeString) {
        scriptFile = arg;
    }
}

// 创建沙箱
if (!quietMode) {
    console.log(`🚀 启动沙箱环境... ${enableProxy ? '(代理监控已启用)' : ''}\n`);
}

// 创建沙箱上下文
const sandbox = {
    console: {
        log: (...args) => {
            if (!quietMode) console.log('[Sandbox]', ...args);
            sandbox.__output__.push(['log', ...args]);
        },
        error: (...args) => {
            console.error('[Sandbox]', ...args);
            sandbox.__output__.push(['error', ...args]);
        },
        warn: (...args) => {
            if (!quietMode) console.warn('[Sandbox]', ...args);
            sandbox.__output__.push(['warn', ...args]);
        },
        info: (...args) => {
            if (!quietMode) console.info('[Sandbox]', ...args);
            sandbox.__output__.push(['info', ...args]);
        }
    },
    setTimeout: (fn, delay) => 0,
    setInterval: (fn, delay) => 0,
    clearTimeout: (id) => {},
    clearInterval: (id) => {},
    // Base64 编解码
    atob: (str) => Buffer.from(str, 'base64').toString('binary'),
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    // XMLHttpRequest 基础实现
    XMLHttpRequest: class XMLHttpRequest {
        constructor() {
            this.bdmsInvokeList = [];
        }
        open() {}
        send() {}
        setRequestHeader() {}
    },
    __output__: []
};

// 添加全局引用
sandbox.window = sandbox;
sandbox.global = sandbox;
sandbox.globalThis = sandbox;
sandbox.self = sandbox;

// 创建 VM 上下文
const context = vm.createContext(sandbox);

// 如果启用代理监控，加载 ProxyMonitor
if (enableProxy) {
    const proxyMonitorPath = path.join(__dirname, 'env/core/ProxyMonitor.js');
    const proxyEnvPath = path.join(__dirname, 'env/core/ProxyEnv.js');
    
    if (fs.existsSync(proxyMonitorPath)) {
        const proxyCode = fs.readFileSync(proxyMonitorPath, 'utf-8');
        vm.runInContext(proxyCode, context);
        if (!quietMode) console.log('✓ 代理监控已加载');
    }
    
    if (fs.existsSync(proxyEnvPath)) {
        const envCode = fs.readFileSync(proxyEnvPath, 'utf-8');
        vm.runInContext(envCode, context);
        if (!quietMode) console.log('✓ 代理环境已加载\n');
    }
}

// 加载环境文件
if (envFile) {
    console.log(`📦 加载环境文件: ${envFile}`);
    try {
        const envPath = path.resolve(envFile);
        if (fs.existsSync(envPath)) {
            const envCode = fs.readFileSync(envPath, 'utf-8');
            
            if (envFile.endsWith('.json')) {
                const envData = JSON.parse(envCode);
                Object.assign(sandbox.window, envData);
            } else {
                vm.runInContext(envCode, context, { timeout });
            }
            console.log('✓ 环境加载成功\n');
        } else {
            console.error(`✗ 环境文件不存在: ${envPath}`);
            process.exit(1);
        }
    } catch (e) {
        console.error(`✗ 加载环境失败: ${e.message}`);
        process.exit(1);
    }
}

// 获取要执行的代码
let code = codeString;

if (!code && scriptFile) {
    const scriptPath = path.resolve(scriptFile);
    if (!fs.existsSync(scriptPath)) {
        console.error(`✗ 脚本文件不存在: ${scriptPath}`);
        process.exit(1);
    }
    console.log(`📜 执行脚本: ${scriptFile}\n`);
    code = fs.readFileSync(scriptPath, 'utf-8');
} else if (code) {
    console.log(`📝 执行代码...\n`);
}

if (!code) {
    console.error('✗ 请提供脚本文件或使用 --code 指定代码');
    console.log('使用 --help 查看帮助信息');
    process.exit(1);
}

// 执行代码
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('执行结果:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const startTime = Date.now();
let result;
let error = null;

// 日志收集
const accessLog = [];
const callLog = [];

// 注入日志收集器
sandbox.__logAccess__ = (path, type) => {
    accessLog.push({ path, type, time: Date.now() - startTime });
};
sandbox.__logCall__ = (path, argTypes) => {
    callLog.push({ path, argTypes, time: Date.now() - startTime });
};

try {
    // 清空输出
    sandbox.__output__ = [];
    
    // 执行代码
    result = vm.runInContext(code, context, {
        timeout: timeout,
        displayErrors: true
    });
    
    // 获取控制台输出
    const output = sandbox.__output__;
    
    // 显示控制台输出
    if (output && output.length > 0) {
        console.log('📋 控制台输出:');
        output.forEach(([type, ...args]) => {
            const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : type === 'info' ? 'ℹ️' : '  ';
            console.log(`${prefix} ${args.join(' ')}`);
        });
        console.log();
    }
    
    // 显示返回值
    if (result !== undefined) {
        console.log('📤 返回值:');
        if (typeof result === 'object') {
            try {
                console.log(JSON.stringify(result, null, 2));
            } catch (e) {
                console.log(result);
            }
        } else {
            console.log(result);
        }
        console.log();
    }
    
    // 显示日志统计（如果有）
    if (accessLog.length > 0 || callLog.length > 0) {
        console.log('📊 执行统计:');
        console.log(`   属性访问: ${accessLog.length} 次`);
        console.log(`   方法调用: ${callLog.length} 次`);
        
        // 显示前5个访问
        if (accessLog.length > 0) {
            console.log('\n   最近访问的属性:');
            accessLog.slice(0, 5).forEach(log => {
                console.log(`   - ${log.path} (${log.type}) @${log.time}ms`);
            });
        }
        
        // 显示前5个调用
        if (callLog.length > 0) {
            console.log('\n   最近调用的方法:');
            callLog.slice(0, 5).forEach(log => {
                console.log(`   - ${log.path} @${log.time}ms`);
            });
        }
        console.log();
    }
    
} catch (e) {
    error = e;
    console.error('❌ 执行错误:');
    console.error(e.message);
    if (e.stack) {
        console.error('\n堆栈跟踪:');
        console.error(e.stack);
    }
}

// 统计信息
const duration = Date.now() - startTime;

// 如果启用了代理监控，显示统计
if (enableProxy) {
    try {
        const stats = vm.runInContext('__ProxyMonitor__.getStats()', context);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 代理监控统计:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   执行时间: ${duration}ms`);
        console.log(`   状态: ${error ? '❌ 失败' : '✅ 成功'}`);
        console.log(`   属性访问 (get): ${stats.get} 次`);
        console.log(`   属性设置 (set): ${stats.set} 次`);
        console.log(`   函数调用 (apply): ${stats.call} 次`);
        console.log(`   构造调用 (construct): ${stats.construct} 次`);
        console.log(`   总操作数: ${stats.total} 次`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (e) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`执行时间: ${duration}ms`);
        console.log(`状态: ${error ? '❌ 失败' : '✅ 成功'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
} else {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`执行时间: ${duration}ms`);
    console.log(`状态: ${error ? '❌ 失败' : '✅ 成功'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

process.exit(error ? 1 : 0);
