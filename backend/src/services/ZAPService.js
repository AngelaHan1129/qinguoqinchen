// src/services/ZAPService.js
const ZapClient = require('zaproxy');
const Logger = require('../utils/logger');

class ZAPService {
    constructor() {
        this.zapOptions = {
            apiKey: process.env.ZAP_API_KEY || 'your-zap-api-key',
            proxy: {
                host: process.env.ZAP_HOST || '127.0.0.1',
                port: parseInt(process.env.ZAP_PORT) || 8080,
            },
        };
        this.zaproxy = new ZapClient(this.zapOptions);
        this.scanResults = new Map();
    }

    async executeAutomatedPentest(attackVectors, intensity, targetUrl) {
        try {
            Logger.info('🔍 啟動 ZAP 滲透測試', { attackVectors, intensity, targetUrl });

            // 1. Spider 掃描 - 爬取網站結構
            const spiderScanId = await this.startSpiderScan(targetUrl);
            await this.waitForSpiderCompletion(spiderScanId);

            // 2. 主動掃描 - 檢測漏洞
            const activeScanId = await this.startActiveScan(targetUrl, intensity);
            await this.waitForActiveScanCompletion(activeScanId);

            // 3. 獲取掃描結果
            const alerts = await this.zaproxy.core.alerts({
                baseurl: targetUrl
            });

            // 4. 根據攻擊向量過濾結果
            const filteredAlerts = this.filterAlertsByVectors(alerts, attackVectors);

            return {
                success: true,
                scanId: `ZAP-${Date.now()}`,
                targetUrl,
                attackVectors,
                intensity,
                vulnerabilities: this.formatVulnerabilities(filteredAlerts),
                summary: {
                    totalAlerts: filteredAlerts.length,
                    highRisk: filteredAlerts.filter(a => a.risk === 'High').length,
                    mediumRisk: filteredAlerts.filter(a => a.risk === 'Medium').length,
                    lowRisk: filteredAlerts.filter(a => a.risk === 'Low').length,
                },
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            Logger.error('ZAP 掃描失敗', error.message);
            throw error;
        }
    }

    async startSpiderScan(targetUrl) {
        const response = await this.zaproxy.spider.scan({
            url: targetUrl,
            maxChildren: 10,
            recurse: true,
            subtreeonly: true
        });
        return response.scan;
    }

    async waitForSpiderCompletion(scanId) {
        let progress = 0;
        while (progress < 100) {
            const status = await this.zaproxy.spider.status({ scanId });
            progress = parseInt(status.status);
            Logger.info(`Spider 掃描進度: ${progress}%`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    async startActiveScan(targetUrl, intensity) {
        const scanPolicy = this.getIntensityPolicy(intensity);
        const response = await this.zaproxy.ascan.scan({
            url: targetUrl,
            recurse: true,
            inScopeOnly: false,
            scanPolicyName: scanPolicy
        });
        return response.scan;
    }

    async waitForActiveScanCompletion(scanId) {
        let progress = 0;
        while (progress < 100) {
            const status = await this.zaproxy.ascan.status({ scanId });
            progress = parseInt(status.status);
            Logger.info(`主動掃描進度: ${progress}%`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    getIntensityPolicy(intensity) {
        const policies = {
            low: 'Light',
            medium: 'Medium',
            high: 'High'
        };
        return policies[intensity] || 'Medium';
    }

    filterAlertsByVectors(alerts, attackVectors) {
        // 根據你的攻擊向量 (A1-A5) 映射到 ZAP 的漏洞類型
        const vectorMapping = {
            'A1': ['Injection', 'SQL Injection', 'XSS'],  // StyleGAN3 相關
            'A2': ['Authentication', 'Session Management'], // StableDiffusion
            'A3': ['Access Control', 'Authorization'],     // SimSwap
            'A4': ['Security Misconfiguration'],           // DiffusionGAN
            'A5': ['Sensitive Data Exposure']              // DALLE
        };

        return alerts.filter(alert => {
            return attackVectors.some(vector => {
                const categories = vectorMapping[vector] || [];
                return categories.some(cat =>
                    alert.alert.toLowerCase().includes(cat.toLowerCase())
                );
            });
        });
    }

    formatVulnerabilities(alerts) {
        return alerts.map(alert => ({
            id: alert.id,
            name: alert.alert,
            severity: alert.risk,
            confidence: alert.confidence,
            description: alert.description,
            solution: alert.solution,
            reference: alert.reference,
            url: alert.url,
            cweId: alert.cweid,
            wascId: alert.wascid
        }));
    }

    async generateReport(scanId, format = 'json') {
        const formats = {
            html: 'core.htmlreport',
            xml: 'core.xmlreport',
            json: 'core.jsonreport'
        };

        const reportData = await this.zaproxy.core[formats[format]]();
        return reportData;
    }
}

module.exports = ZAPService;
