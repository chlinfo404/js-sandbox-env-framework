/**
 * 沙箱执行路由
 */

import express from 'express';
import { SandboxManager } from '../sandbox/index.js';

const router = express.Router();

// 全局沙箱实例（单例模式）
let sandboxInstance = null;

/**
 * 获取沙箱实例
 */
async function getSandbox() {
    if (!sandboxInstance) {
        sandboxInstance = new SandboxManager();
        await sandboxInstance.init();
        // 自动加载所有环境文件
        await sandboxInstance.loadAllEnvFiles();
    }
    return sandboxInstance;
}

/**
 * 执行JS代码
 * POST /sandbox/run
 * Body: { code: '...', loadEnv: true, timeout: 5000 }
 */
router.post('/run', async (req, res) => {
    const { code, loadEnv = true, timeout = 5000, reset = false } = req.body;
    
    if (!code) {
        return res.status(400).json({
            success: false,
            error: 'Missing code parameter'
        });
    }

    try {
        // 如果需要重置，先销毁旧实例
        if (reset && sandboxInstance) {
            await sandboxInstance.reset();
        }

        const sandbox = await getSandbox();
        
        // 执行代码
        const result = await sandbox.execute(code, { timeout });
        
        res.json({
            success: result.success,
            result: result.result,
            error: result.error,
            stack: result.stack,
            duration: result.duration,
            undefinedPaths: result.undefinedPaths,
            stats: sandbox.getStats()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

/**
 * 注入代码（不执行返回）
 * POST /sandbox/inject
 * Body: { code: '...' }
 */
router.post('/inject', async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({
            success: false,
            error: 'Missing code parameter'
        });
    }

    try {
        const sandbox = await getSandbox();
        const result = await sandbox.inject(code);
        
        res.json({
            success: result.success,
            error: result.error
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 加载环境文件
 * POST /sandbox/load-env
 * Body: { file: 'bom/window.js' } 或 { all: true }
 */
router.post('/load-env', async (req, res) => {
    const { file, all = false } = req.body;
    
    try {
        const sandbox = await getSandbox();
        
        if (all) {
            const results = await sandbox.loadAllEnvFiles();
            res.json({
                success: true,
                results
            });
        } else if (file) {
            const result = await sandbox.loadEnvFile(file);
            res.json(result);
        } else {
            res.status(400).json({
                success: false,
                error: 'Missing file parameter or all flag'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 重置沙箱
 * POST /sandbox/reset
 */
router.post('/reset', async (req, res) => {
    try {
        if (sandboxInstance) {
            await sandboxInstance.reset();
        }
        sandboxInstance = null;
        
        // 重新初始化
        await getSandbox();
        
        res.json({
            success: true,
            message: 'Sandbox reset successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 获取沙箱状态
 * GET /sandbox/status
 */
router.get('/status', async (req, res) => {
    try {
        const sandbox = await getSandbox();
        const stats = sandbox.getStats();
        const logger = sandbox.getLogger();
        
        res.json({
            success: true,
            data: {
                stats,
                loggerStats: logger.getStats()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 获取undefined列表
 * GET /sandbox/undefined
 */
router.get('/undefined', async (req, res) => {
    try {
        const sandbox = await getSandbox();
        const logger = sandbox.getLogger();
        const undefinedList = logger.getUndefinedList();
        
        res.json({
            success: true,
            data: undefinedList,
            total: undefinedList.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 获取所有日志
 * GET /sandbox/logs
 */
router.get('/logs', async (req, res) => {
    const { type, limit = 100 } = req.query;
    
    try {
        const sandbox = await getSandbox();
        const logger = sandbox.getLogger();
        let logs = logger.getAllLogs();
        
        if (type) {
            logs = {
                [type]: logs[type] || []
            };
        }
        
        // 限制返回数量
        Object.keys(logs).forEach(key => {
            if (Array.isArray(logs[key]) && logs[key].length > limit) {
                logs[key] = logs[key].slice(-limit);
            }
        });
        
        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * 清除日志
 * POST /sandbox/logs/clear
 */
router.post('/logs/clear', async (req, res) => {
    try {
        const sandbox = await getSandbox();
        const logger = sandbox.getLogger();
        logger.clear();
        
        res.json({
            success: true,
            message: 'Logs cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
