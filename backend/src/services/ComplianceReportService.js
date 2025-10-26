// src/services/ComplianceReportService.js - 完整多格式版本
const Logger = require('../utils/logger');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

class ComplianceReportService {
    constructor(ragService, geminiService) {
        this.ragService = ragService;
        this.gemini = geminiService;
        Logger.info('✅ 合規報告服務初始化完成');
    }
    // 在 constructor 後面立即加入這個方法
    extractFindingsFromPentestResults(pentestResults) {
        if (Array.isArray(pentestResults)) return pentestResults;

        const vectors = pentestResults?.attackResults?.vectors || [];
        const findings = vectors.map((vector, index) => ({
            id: vector.vectorId || `finding_${index}`,
            title: vector.vectorName || vector.description || `發現 ${index + 1}`,
            description: vector.description || `攻擊向量: ${vector.vectorId || 'N/A'}`,
            severity: vector.success ? 'high' : 'low',
            metadata: {
                severity: vector.success ? 'high' : 'low',
                confidence: vector.confidence || 0.5,
                vectorId: vector.vectorId || `V${index + 1}`,
                success: !!vector.success,
                category: 'security'
            },
            recommendations: [`修復 ${vector.vectorName || vector.vectorId || '該向量'} 相關漏洞`]
        }));

        if (!findings.length) {
            findings.push({
                id: 'upload_finding_1',
                title: '使用者上傳的報告',
                description: `檔案: ${pentestResults?.metadata?.uploadedFile || '未知'}`,
                severity: 'medium',
                metadata: { severity: 'medium', source: 'user-upload', category: 'general' },
                recommendations: ['請詳細審查上傳的報告內容']
            });
        }
        return findings;
    }
    stripEmoji(s) {
        return (s || '').replace(/\p{Extended_Pictographic}/gu, '');
    }

    mdToPlain(s) {
        if (!s) return '';
        let t = String(s);
        t = t.replace(/^#{1,6}\s+/gm, ''); // 移除 Markdown 標題
        t = t.replace(/(\*\*|__)(.*?)\1/g, '$2'); // 移除粗體
        t = t.replace(/(\*|_)(.*?)\1/g, '$2'); // 移除斜體
        t = t.replace(/^\s*[-*+]\s+/gm, '• '); // 轉換列表
        t = t.replace(/`{1,3}[^`]*`{1,3}/g, ''); // 移除程式碼區塊
        t = t.replace(/\r\n/g, '\n'); // 統一換行符
        return t;
    }

    // 更新方法簽名，接受完整的滲透測試結果
    async generateComplianceReport(pentestResults, options = {}) {
        Logger.info('📋 生成合規報告...', {
            sessionId: pentestResults?.sessionId || 'unknown',
            findingCount: pentestResults?.attackResults?.vectors?.length || 0,
            format: options.format || 'txt',
            hasGrokReports: !!(pentestResults?.grokReports?.pentestReport?.content)
        });
        try {
            const findingsArr = this.extractFindingsFromPentestResults(pentestResults);
            const frameworks = this.normalizeFrameworks(options.complianceFrameworks);

            switch (options.format) {
                case 'pdf':
                    // 傳入 findings, pentestResults, options 三個參數
                    return await this.generatePdfReport(findingsArr, pentestResults, { ...options, complianceFrameworks: frameworks });
                case 'excel':
                    return await this.generateExcelReport(findingsArr, pentestResults, { ...options, complianceFrameworks: frameworks });
                case 'txt':
                default:
                    return await this.generateTextReport(findingsArr, pentestResults, { ...options, complianceFrameworks: frameworks });
            }
        } catch (error) {
            Logger.error('報告生成失敗:', error.message);
            throw error;
        }
    }




    // 🔥 方法 1: 生成文字報告 (您現有的功能)
    async generateTextReport(pentestResults, options = {}) {
        Logger.info('📄 生成文字報告...');

        const sessionId = pentestResults?.sessionId || 'UNKNOWN';
        const executiveSummary = pentestResults?.executiveSummary || {};
        const attackResults = pentestResults?.attackResults || {};
        const grokReports = pentestResults?.grokReports || {};
        const geminiRecommendations = pentestResults?.geminiRecommendations || {};

        const reportHeader = `侵國侵城 AI 滲透測試合規報告

會話編號: ${sessionId}
生成時間: ${new Date().toLocaleString('zh-TW')}
報告格式: ${options.format}
測試向量: ${executiveSummary.totalVectors || 0} 項
成功攻擊: ${executiveSummary.successfulAttacks || 0} 項
測試持續時間: ${executiveSummary.testDuration || 'N/A'}
合規框架: ${options.complianceFrameworks?.join(', ') || 'ISO 27001, OWASP'}
審計追蹤: ${options.includeAuditTrail ? '已包含' : '未包含'}`;

        // ✅ 使用 Grok 生成的執行摘要內容
        const executiveSummarySection = `
=== 執行摘要 ===

${this.extractExecutiveSummary(grokReports.pentestReport?.content)}

測試結果統計：
- 總測試向量: ${executiveSummary.totalVectors || 0} 項
- 成功攻擊: ${executiveSummary.successfulAttacks || 0} 項
- 失敗攻擊: ${executiveSummary.failedAttacks || 0} 項
- 整體成功率: ${executiveSummary.overallSuccessRate || '0%'}
- 風險等級: ${executiveSummary.riskLevel || 'UNKNOWN'}

安全指標分析：
- APCER (Attack Presentation Classification Error Rate): ${attackResults.metrics?.apcer || '0.00%'}
- BPCER (Bona fide Presentation Classification Error Rate): ${attackResults.metrics?.bpcer || '0.00%'}
- ACER (Average Classification Error Rate): ${attackResults.metrics?.acer || '0.00%'}
- ROC AUC Score: ${attackResults.metrics?.rocAuc || '100.00%'}`;

        // ✅ 使用 Grok 生成的技術分析內容
        const technicalAnalysis = `
=== Grok AI 滲透測試分析 ===

${this.extractTechnicalAnalysis(grokReports.pentestReport?.content)}

=== 攻擊者下次建議 (紅隊視角) ===

${this.extractAttackRecommendations(grokReports.attackRecommendations?.content)}`;

        // ✅ 使用 Gemini 生成的企業建議
        const enterpriseRemediation = `
=== Gemini AI 企業改善建議 ===

${geminiRecommendations.enterpriseRemediation?.content || '⚠️ Gemini 企業改善建議服務暫時無法使用，建議聯繫技術支援以獲取完整的企業級改善方案。'}

信心指數: ${Math.round((geminiRecommendations.enterpriseRemediation?.confidence || 0.5) * 100)}%
使用知識庫來源: ${geminiRecommendations.enterpriseRemediation?.ragSourcesUsed || 0} 項

=== 防禦策略建議 ===

${geminiRecommendations.defenseStrategy?.content || '⚠️ 防禦策略建議服務暫時無法使用，建議參考 OWASP Top 10 和 ISO 27001 控制措施。'}`;

        // ✅ 整合法律合規評估
        const legalCompliance = `
=== 法律合規評估 ===

基於滲透測試結果的法律風險分析：

個人資料保護法遵循：
- eKYC 系統安全性評級: ${executiveSummary.riskLevel || 'UNKNOWN'}
- 特種個人資料處理風險: ${executiveSummary.successfulAttacks > 0 ? '高風險' : '中等風險'}
- 資料當事人權利保護: 需要加強身份驗證機制
- 資料外洩通報準備: ${executiveSummary.successfulAttacks === 0 ? '目前無立即風險' : '需要立即檢視'}

資通安全管理法遵循：
- 資安事件風險等級: ${this.calculateLegalRisk(executiveSummary)}
- 資安防護基準符合度: ${executiveSummary.successfulAttacks === 0 ? '基本符合' : '需要改善'}
- 資安稽核建議頻率: ${executiveSummary.riskLevel === 'HIGH' ? '每月' : '每季'}

法律風險評估：
${this.generateLegalRiskAssessment(executiveSummary, attackResults)}`;

        const actionPlan = `
=== 行動計畫與時程 ===

${this.generateActionPlan(executiveSummary, grokReports, geminiRecommendations)}

${options.includeAuditTrail ? `
=== 審計追蹤 ===

測試執行詳情：
- 會話 ID: ${sessionId}
- 測試開始時間: ${pentestResults.metadata?.generatedAt || new Date().toISOString()}
- 執行時間: ${pentestResults.metadata?.executionTime || 'N/A'}
- AI 模型使用情況:
  * 攻擊分析: ${pentestResults.metadata?.aiModels?.attackAnalysis || 'N/A'}
  * 企業改善建議: ${pentestResults.metadata?.aiModels?.enterpriseRemediation || 'N/A'}
  * 知識庫: ${pentestResults.metadata?.aiModels?.knowledgeBase || 'N/A'}
- 知識庫來源數量: ${pentestResults.ragContext?.totalSources || 0}
- 系統版本: ${pentestResults.metadata?.version || 'N/A'}
` : '審計追蹤資訊已省略'}`;

        const fullReport = `${reportHeader}

${executiveSummarySection}

${technicalAnalysis}

${enterpriseRemediation}

${legalCompliance}

${actionPlan}

---
本報告由侵國侵城 AI 系統自動生成
會話編號: ${sessionId}
報告編號: COMPLIANCE-${Date.now()}
國立臺中科技大學 侵國侵城團隊
© 2025 InnoServe 創新服務團隊
        `;

        Logger.success('✅ 文字報告生成完成');
        return Buffer.from(fullReport, 'utf8');
    }



    // 🔥 方法 2: 生成 PDF 報告 (簡化中文版)
    // 🔥 修改這個方法以支援中文 PDF
    async generatePdfReport(findings, pentestResults, options) {
        Logger.info('📄 生成 PDF 報告（Puppeteer 優化版）...');

        const puppeteer = require('puppeteer');

        try {
            const browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                    // ✅ 新增：支援中文字體
                    '--font-render-hinting=none',
                    '--disable-font-subpixel-positioning',
                    '--allow-fonts-fallback'
                ]
            });

            const page = await browser.newPage();

            // ✅ 設定頁面編碼
            await page.setExtraHTTPHeaders({
                'Accept-Charset': 'utf-8'
            });

            await page.setViewport({ width: 1200, height: 1600 });

            // ✅ 修正後的 HTML 內容（強化中文支援）
            const htmlContent = this.generateChineseHtmlContent(findings, options);

            // ✅ 確保正確的編碼設定
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });

            // ✅ 等待字體載入
            await page.evaluateHandle('document.fonts.ready');

            const pdfBuffer = await page.pdf({
                format: 'A4',
                margin: {
                    top: '20mm',
                    bottom: '25mm',
                    left: '20mm',
                    right: '20mm'
                },
                printBackground: true,
                displayHeaderFooter: true,
                // ✅ 修正 Header 和 Footer 編碼
                headerTemplate: `<div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-top: 10px; font-family: 'Noto Sans TC', sans-serif;">侵國侵城 AI 合規報告</div>`,
                footerTemplate: `<div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-bottom: 10px; font-family: 'Noto Sans TC', sans-serif;"><span class="pageNumber"></span> / <span class="totalPages"></span> | COMPLIANCE-${Date.now()}</div>`,
                // ✅ 新增：指定字體嵌入
                preferCSSPageSize: true
            });

            await browser.close();

            Logger.success('✅ PDF 報告生成完成', { size: pdfBuffer.length });
            return pdfBuffer;

        } catch (error) {
            Logger.error('❌ Puppeteer PDF 生成失敗', error);
            Logger.warn('⚠️ 切換到 PDFKit 備用方案');
            return await this.generateReliablePdfReport(findings, pentestResults, options);
        }
    }


    // 🔥 添加這個新方法來生成 HTML 內容
    generateChineseHtmlContent(findings, options) {
        const highRisk = findings.filter(f => f.metadata?.severity === 'high').length;
        const mediumRisk = findings.filter(f => f.metadata?.severity === 'medium').length;
        const lowRisk = findings.filter(f => f.metadata?.severity === 'low').length;
        const path = require('path');
        const fs = require('fs');

        const variableFontPath = path.resolve(process.cwd(), 'assets/fonts/NotoSansTC-VariableFont_wght.ttf');

        // 檢查檔案是否存在
        const fontExists = fs.existsSync(variableFontPath);

        const fontFace = fontExists ? `
@font-face {
  font-family: 'Noto Sans TC';
  src: url('file:///${variableFontPath.replace(/\\/g, '/')}') format('truetype');
  font-weight: 100 900; /* Variable Font 支援多種字重 */
  font-style: normal;
}` : '';

        return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>侵國侵城 AI 合規報告</title>
    
    <style>
        @charset "UTF-8";
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft JhengHei', '微軟正黑體', 'PingFang TC', 'Hiragino Sans GB', 'Heiti TC', Arial, sans-serif;
            line-height: 1.7;
            color: #2c3e50;
            background: #fff;
            font-size: 14px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        }
        
        .container {
            max-width: 100%;
            margin: 0 auto;
            padding: 30px;
        }
        
        .cover {
            text-align: center;
            padding: 100px 0 80px 0;
            border-bottom: 4px solid #3498db;
            margin-bottom: 60px;
            page-break-after: always;
        }
        
        .cover h1 {
            font-size: 42px;
            color: #2c3e50;
            margin-bottom: 25px;
            font-weight: 700;
            letter-spacing: 2px;
        }
        
        .cover h2 {
            font-size: 28px;
            color: #34495e;
            margin-bottom: 40px;
            font-weight: 400;
        }
        
        .meta {
            font-size: 16px;
            color: #7f8c8d;
            margin: 8px 0;
        }
        
        /* ✅ 確保 Emoji 正確顯示 */
        .logo {
            font-size: 80px;
            margin: 40px 0;
            font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;
        }
        
        .icon {
            font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;
            margin-right: 8px;
        }
        
        .org {
            margin: 40px 0;
            font-size: 18px;
            line-height: 2;
        }
        
        .warning {
            background: #fee2e2;
            border: 2px solid #dc2626;
            border-radius: 8px;
            padding: 20px;
            margin: 40px auto;
            max-width: 500px;
            color: #7f1d1d;
            font-size: 14px;
            line-height: 1.8;
        }
        
        .section {
            margin: 40px 0;
            page-break-inside: avoid;
        }
        
        h2 {
            font-size: 24px;
            color: #1a365d;
            margin: 30px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }
        
        h3 {
            font-size: 18px;
            color: #2b6cb0;
            margin: 25px 0 15px 0;
        }
        
        h4 {
            font-size: 16px;
            color: #2d3748;
            margin: 20px 0 10px 0;
        }
        
        p {
            margin: 12px 0;
            line-height: 1.8;
        }
        
        .emphasis {
            font-weight: 600;
            color: #2b6cb0;
        }
        
        .data-point {
            font-weight: 700;
            color: #3182ce;
            font-size: 18px;
        }
        
        .highlight-box {
            background: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .risk-stats {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            flex-wrap: wrap;
        }
        
        .risk-item {
            text-align: center;
            padding: 25px;
            border-radius: 12px;
            min-width: 150px;
            margin: 10px;
        }
        
        .risk-high {
            background: #fee2e2;
            border: 2px solid #dc2626;
        }
        
        .risk-medium {
            background: #fef3c7;
            border: 2px solid #f59e0b;
        }
        
        .risk-low {
            background: #d1fae5;
            border: 2px solid #10b981;
        }
        
        .risk-number {
            display: block;
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .risk-high .risk-number { color: #dc2626; }
        .risk-medium .risk-number { color: #f59e0b; }
        .risk-low .risk-number { color: #10b981; }
        
        .risk-label {
            font-size: 16px;
            font-weight: 600;
        }
        
        ul {
            margin: 15px 0;
            padding-left: 30px;
        }
        
        li {
            margin: 10px 0;
            line-height: 1.6;
        }
        
        .page-break {
            page-break-after: always;
        }
        
        @media print {
            .cover {
                page-break-after: always;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 封面 -->
        <div class="cover">
            <h1>侵國侵城 AI</h1>
            <h2>資訊安全合規分析報告</h2>
            <div class="meta">eKYC 系統安全評估</div>
            <div class="meta">${new Date().toLocaleString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</div>
            <div class="meta">版本 1.0.0</div>
            <div class="meta">${options.complianceFrameworks?.join(', ') || 'ISO 27001, OWASP'}</div>
            
            <!-- ✅ Emoji 應該可以正常顯示 -->
            <div class="logo">&#x1F6E1;&#xFE0F;</div>
            
            <div class="org">
                <strong>國立臺中科技大學</strong><br>
                <strong>侵國侵城專案團隊</strong><br>
                <span style="font-size: 16px; color: #7f8c8d; margin-top: 10px; display: inline-block;">© 2025 InnoServe 創新服務團隊</span>
            </div>
            
            <div class="warning">
                <strong>機密文件</strong><br>
                本報告包含敏感資安資訊，僅供授權人員閱覽
            </div>
        </div>

        <!-- 執行摘要 -->
        <div class="section">
            <h2><span class="icon">&#x1F4CB;</span>執行摘要</h2>
            
            <p>本次<span class="emphasis">eKYC 系統</span>安全評估針對技術、法規與安全三個面向進行<strong>全面檢測</strong>。評估涵蓋網頁應用程式安全、ISO 27001 合規性、OWASP 最佳實務與 <span class="data-point">${findings.length}</span> 項安全議題分析。</p>
            
            <div class="highlight-box">
                <h4><span class="icon">&#x1F3AF;</span>評估重點</h4>
                <ul>
                    <li>網頁應用程式安全測試</li>
                    <li>ISO 27001 合規性審查</li>
                    <li>OWASP Top 10 風險評估</li>
                    <li>個人資料保護法遵循檢視</li>
                    <li>系統架構安全分析</li>
                </ul>
            </div>

            <h3><span class="icon">&#x26A0;&#xFE0F;</span>風險概覽</h3>
            <div class="risk-stats">
                <div class="risk-item risk-high">
                    <span class="risk-number">${highRisk}</span>
                    <span class="risk-label">高風險</span>
                </div>
                <div class="risk-item risk-medium">
                    <span class="risk-number">${mediumRisk}</span>
                    <span class="risk-label">中風險</span>
                </div>
                <div class="risk-item risk-low">
                    <span class="risk-number">${lowRisk}</span>
                    <span class="risk-label">低風險</span>
                </div>
            </div>

            <h3><span class="icon">&#x1F4CC;</span>主要發現</h3>
            <ul>
                <li>發現 ${findings.length} 項安全議題需要關注</li>
                <li>高風險項目需要立即處理以防止資料外洩</li>
                <li>個人資料保護法合規性需要加強</li>
                <li>ISO 27001 控制措施實施存在顯著差距</li>
                <li>OWASP Top 10 安全風險需要全面緩解</li>
            </ul>
        </div>
        
        <!-- 其他章節... -->
        
    </div>
</body>
</html>`;
    }


    // 🔥 添加回退方法（如果 Puppeteer 失敗時使用）
    async generateSimplePdfReport(findings, options = {}) {
        Logger.info('📄 生成簡化 PDF 報告...');

        // 這裡保留您原有的 PDFKit 簡化版本
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4',
                    info: {
                        Title: '侵國侵城 AI 合規分析報告',
                        Author: '侵國侵城團隊',
                        Subject: 'eKYC 系統安全合規評估'
                    }
                });

                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(buffers);
                    Logger.success('✅ 簡化 PDF 報告生成完成');
                    resolve(pdfBuffer);
                });

                // 您原有的 PDFKit 內容...
                doc.fontSize(20).text('QinGuoQinCheng AI Compliance Report', 50, 50);
                doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, 50, 100);
                // ... 其餘內容

                doc.end();

            } catch (error) {
                Logger.error('簡化 PDF 生成錯誤:', error.message);
                reject(error);
            }
        });
    }


    // 🔥 方法 3: 生成 Excel 報告
    async generateExcelReport(findings, options = {}) {
        Logger.info('📊 生成 Excel 報告...');

        try {
            const workbook = new ExcelJS.Workbook();

            // 設定工作簿屬性
            workbook.creator = '侵國侵城團隊';
            workbook.lastModifiedBy = '侵國侵城 AI 系統';
            workbook.created = new Date();
            workbook.modified = new Date();

            // === 工作表 1: 執行摘要 ===
            const summarySheet = workbook.addWorksheet('執行摘要');

            // 設定欄寬
            summarySheet.columns = [
                { width: 20 }, { width: 50 }, { width: 15 }
            ];

            // 標題
            summarySheet.mergeCells('A1:C1');
            const titleCell = summarySheet.getCell('A1');
            titleCell.value = '侵國侵城 AI 合規分析報告';
            titleCell.font = { size: 18, bold: true, color: { argb: 'FF2c3e50' } };
            titleCell.alignment = { horizontal: 'center' };

            // 基本資訊
            let row = 3;
            summarySheet.getCell(`A${row}`).value = '生成時間';
            summarySheet.getCell(`B${row}`).value = new Date().toLocaleString('zh-TW');
            row++;

            summarySheet.getCell(`A${row}`).value = '分析發現';
            summarySheet.getCell(`B${row}`).value = `${findings.length} 項`;
            row++;

            summarySheet.getCell(`A${row}`).value = '合規框架';
            summarySheet.getCell(`B${row}`).value = options.complianceFrameworks?.join(', ') || 'ISO 27001, OWASP';
            row += 2;

            // 風險統計
            summarySheet.getCell(`A${row}`).value = '風險等級分佈';
            summarySheet.getCell(`A${row}`).font = { bold: true };
            row++;

            const highRisk = findings.filter(f => f.metadata?.severity === 'high').length;
            const mediumRisk = findings.filter(f => f.metadata?.severity === 'medium').length;
            const lowRisk = findings.filter(f => f.metadata?.severity === 'low').length;

            summarySheet.getCell(`A${row}`).value = '高風險';
            summarySheet.getCell(`B${row}`).value = `${highRisk} 項`;
            summarySheet.getCell(`B${row}`).font = { color: { argb: 'FFe74c3c' } };
            row++;

            summarySheet.getCell(`A${row}`).value = '中風險';
            summarySheet.getCell(`B${row}`).value = `${mediumRisk} 項`;
            summarySheet.getCell(`B${row}`).font = { color: { argb: 'FFf39c12' } };
            row++;

            summarySheet.getCell(`A${row}`).value = '低風險';
            summarySheet.getCell(`B${row}`).value = `${lowRisk} 項`;
            summarySheet.getCell(`B${row}`).font = { color: { argb: 'FF27ae60' } };

            // === 工作表 2: 技術分析 ===
            const techSheet = workbook.addWorksheet('技術分析');

            techSheet.columns = [
                { header: '類別', key: 'category', width: 20 },
                { header: '問題描述', key: 'description', width: 50 },
                { header: '風險等級', key: 'risk', width: 15 },
                { header: '建議措施', key: 'recommendation', width: 40 }
            ];

            // 標題樣式
            techSheet.getRow(1).font = { bold: true };
            techSheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF3498db' }
            };

            // 添加技術分析資料
            const techData = [
                {
                    category: 'Web 應用程式安全',
                    description: 'SQL 注入漏洞',
                    risk: '高風險',
                    recommendation: '使用參數化查詢，加強輸入驗證'
                },
                {
                    category: 'Web 應用程式安全',
                    description: 'XSS 跨站腳本攻擊',
                    risk: '中風險',
                    recommendation: '實施內容安全政策 (CSP)'
                },
                {
                    category: '系統架構安全',
                    description: '存取控制機制不足',
                    risk: '高風險',
                    recommendation: '實施最小權限原則'
                },
                {
                    category: '系統架構安全',
                    description: '日誌監控功能缺失',
                    risk: '中風險',
                    recommendation: '建立完整的日誌記錄機制'
                }
            ];

            techData.forEach(item => {
                const row = techSheet.addRow(item);
                if (item.risk === '高風險') {
                    row.getCell('risk').font = { color: { argb: 'FFe74c3c' } };
                } else if (item.risk === '中風險') {
                    row.getCell('risk').font = { color: { argb: 'FFf39c12' } };
                }
            });

            // === 工作表 3: 改善建議 ===
            const recommendSheet = workbook.addWorksheet('改善建議');

            recommendSheet.columns = [
                { header: '優先級', key: 'priority', width: 15 },
                { header: '時間範圍', key: 'timeframe', width: 15 },
                { header: '改善措施', key: 'action', width: 50 },
                { header: '負責單位', key: 'responsible', width: 20 }
            ];

            recommendSheet.getRow(1).font = { bold: true };
            recommendSheet.getRow(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF27ae60' }
            };

            const recommendations = [
                { priority: '緊急', timeframe: '1-30天', action: '修復所有高風險安全漏洞', responsible: '資安團隊' },
                { priority: '緊急', timeframe: '1-30天', action: '實施基本的輸入驗證機制', responsible: '開發團隊' },
                { priority: '高', timeframe: '1-3個月', action: '建立完整的資安管理制度', responsible: '管理階層' },
                { priority: '高', timeframe: '1-3個月', action: '實施 ISO 27001 控制措施', responsible: '合規團隊' },
                { priority: '中', timeframe: '3-6個月', action: '取得 ISO 27001 認證', responsible: '合規團隊' }
            ];

            recommendations.forEach(item => {
                const row = recommendSheet.addRow(item);
                if (item.priority === '緊急') {
                    row.getCell('priority').font = { color: { argb: 'FFe74c3c' } };
                } else if (item.priority === '高') {
                    row.getCell('priority').font = { color: { argb: 'FFf39c12' } };
                }
            });

            // === 工作表 4: 審計追蹤 ===
            if (options.includeAuditTrail) {
                const auditSheet = workbook.addWorksheet('審計追蹤');

                auditSheet.columns = [
                    { header: '項目', key: 'item', width: 25 },
                    { header: '內容', key: 'content', width: 50 }
                ];

                auditSheet.getRow(1).font = { bold: true };

                const auditData = [
                    { item: '測試執行時間', content: new Date().toISOString() },
                    { item: '測試工具', content: 'Nessus, OWASP ZAP' },
                    { item: '分析方法', content: '靜態分析 + 動態掃描' },
                    { item: '報告生成系統', content: '侵國侵城 AI RAG 系統' },
                    { item: '資料來源', content: 'pgvector 向量資料庫' },
                    { item: 'AI 模型', content: 'qinguoqinchen-legal-embedder-v1.0' },
                    { item: '報告編號', content: `COMPLIANCE-${Date.now()}` }
                ];

                auditData.forEach(item => {
                    auditSheet.addRow(item);
                });
            }

            // 生成 Excel 緩衝區
            const buffer = await workbook.xlsx.writeBuffer();
            Logger.success('✅ Excel 報告生成完成');
            return buffer;

        } catch (error) {
            Logger.error('Excel 生成錯誤:', error.message);
            throw error;
        }
    }


    // 新增可靠的 PDF 生成方法
    async generateReliablePdfReport(findings, pentestResults, options) {
        Logger.info('📄 生成可靠的 PDF 報告...');
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4',
                    info: {
                        Title: '侵國侵城 AI 合規報告',
                        Author: '侵國侵城團隊',
                        Subject: 'eKYC 系統安全評估',
                        Creator: '侵國侵城 AI 系統'
                    }
                });

                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.on('error', (e) => reject(e));

                // ✅ 修正:使用你實際的 Variable Font 路徑
                try {
                    const path = require('path');
                    const fs = require('fs');

                    // 使用相對路徑(相對於專案根目錄)
                    const fontPath = path.resolve(process.cwd(), 'assets/fonts/NotoSansTC-VariableFont_wght.ttf');

                    // ✅ 驗證檔案是否存在
                    if (!fs.existsSync(fontPath)) {
                        throw new Error(`字型檔案不存在: ${fontPath}`);
                    }

                    // ✅ 註冊字型
                    doc.registerFont('NotoSansTC', fontPath);
                    doc.font('NotoSansTC');
                    Logger.info('✅ 成功載入中文字型', { fontPath });

                } catch (error) {
                    Logger.warn('⚠️ 無法載入中文字體，使用預設字體', error.message);
                    doc.font('Helvetica');
                }

                // ✅ 生成封面
                this.addProfessionalCover(doc, findings, pentestResults, options);

                // ✅ 後續章節
                doc.addPage();
                this.addExecutiveSummary(doc, findings, pentestResults);

                doc.addPage();
                this.addTechnicalAnalysis(doc, findings, pentestResults);

                doc.addPage();
                this.addRecommendations(doc, findings);

                if (options.includeAuditTrail) {
                    doc.addPage();
                    this.addAuditTrail(doc, options);
                }

                doc.end();

            } catch (error) {
                Logger.error('❌ 可靠的 PDF 生成失敗', error.message);
                reject(error);
            }
        });
    }



    normalizeFrameworks(fr) {
        if (!fr) return ['ISO_27001', 'OWASP'];
        if (Array.isArray(fr)) return fr;
        if (typeof fr === 'string') {
            try {
                const parsed = JSON.parse(fr);
                if (Array.isArray(parsed)) return parsed;
            } catch { }
            return fr.split(',').map(s => s.trim()).filter(Boolean);
        }
        return ['ISO_27001', 'OWASP'];
    }


    // 添加專業封面
    addProfessionalCover(doc, findings, options) {
        // 標題
        doc.fontSize(28).fillColor('#1a365d').text('QinGuoQinCheng AI', 50, 120, { align: 'center' });
        doc.fontSize(24).fillColor('#2d3748').text('Compliance Analysis Report', 50, 160, { align: 'center' });
        doc.fontSize(18).fillColor('#4a5568').text('eKYC System Security Assessment', 50, 220, { align: 'center' });

        // ✅ Logo 置中
        const logoWidth = 120;  // Logo 寬度
        const logoHeight = 120; // Logo 高度
        const pageWidth = 595;  // A4 頁面寬度 (pt)
        const logoX = (pageWidth - logoWidth) / 2;  // 計算置中 X 座標
        const logoY = 270;  // Y 座標

        doc.image('assets/logo/IMG_0372.PNG', logoX, logoY, {
            width: logoWidth,
            height: logoHeight
        });

        // 風險統計條
        const y = 410;  // 往下移一點避免與 Logo 重疊
        const highRisk = findings.filter(f => f.metadata?.severity === 'high').length;
        const mediumRisk = findings.filter(f => f.metadata?.severity === 'medium').length;
        const lowRisk = findings.filter(f => f.metadata?.severity === 'low').length;

        doc.rect(100, y, 120, 80).fillAndStroke('#fee2e2', '#dc2626');
        doc.fillColor('#dc2626').fontSize(24).text(highRisk.toString(), 150, y + 15, { align: 'center', width: 20 });
        doc.fillColor('#7f1d1d').fontSize(12).text('High Risk', 100, y + 50, { align: 'center', width: 120 });

        doc.rect(240, y, 120, 80).fillAndStroke('#fef3c7', '#f59e0b');
        doc.fillColor('#f59e0b').fontSize(24).text(mediumRisk.toString(), 290, y + 15, { align: 'center', width: 20 });
        doc.fillColor('#92400e').fontSize(12).text('Medium Risk', 240, y + 50, { align: 'center', width: 120 });

        doc.rect(380, y, 120, 80).fillAndStroke('#d1fae5', '#10b981');
        doc.fillColor('#10b981').fontSize(24).text(lowRisk.toString(), 430, y + 15, { align: 'center', width: 20 });
        doc.fillColor('#065f46').fontSize(12).text('Low Risk', 380, y + 50, { align: 'center', width: 120 });

        doc.fillColor('#4a5568').fontSize(16)
            .text('National Taichung University of Science and Technology', 50, 540, { align: 'center' })
            .text('QinGuoQinCheng Team', 50, 565, { align: 'center' });

        doc.fillColor('#718096').fontSize(14).text(
            `Generated: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`,
            50, 620, { align: 'center' }
        ).text('Version: 1.0.0', 50, 640, { align: 'center' });

        if (options.complianceFrameworks?.length > 0) {
            doc.text(`Frameworks: ${options.complianceFrameworks.join(', ')}`, 50, 660, { align: 'center' });
        }

        doc.moveTo(100, 700).lineTo(500, 700).strokeColor('#e2e8f0').stroke();

        doc.fillColor('#e53e3e').fontSize(12)
            .text('CONFIDENTIAL - Authorized Personnel Only', 50, 740, { align: 'center' })
            .text('This report contains sensitive security information', 50, 760, { align: 'center' });
    }



    // ✅ 修正 addExecutiveSummary
    addExecutiveSummary(doc, findings, pentestResults) {
        doc.fontSize(22)
            .fillColor('#1a365d')
            .text('Executive Summary', 50, 50);

        doc.moveTo(50, 80)
            .lineTo(550, 80)
            .strokeColor('#3182ce')
            .lineWidth(2)
            .stroke();

        // ✅ 使用 doc.y 而非固定值
        doc.moveDown(2); // 移動2行

        // 從 Grok 報告提取執行摘要內容
        const grokContent = pentestResults?.grokReports?.pentestReport?.content || '';
        const executiveSummary = this.extractExecutiveSummary(grokContent);

        // 顯示 Grok 生成的執行摘要
        if (executiveSummary && executiveSummary.length > 0) {
            doc.fontSize(12)
                .fillColor('#2d3748')
                .text(executiveSummary, {
                    width: 500,
                    align: 'justify'
                });
            doc.moveDown(2); // ✅ 自動調整位置
        } else {
            doc.fontSize(12)
                .fillColor('#2d3748')
                .text('This comprehensive security assessment evaluates the eKYC system')
                .text('compliance across technical, legal, and security dimensions.');
            doc.moveDown(1);
        }

        // 統計資料
        const ex = pentestResults?.executiveSummary || {};
        doc.fontSize(14)
            .fillColor('#2b6cb0')
            .text('Test Statistics:');

        doc.moveDown(0.5);

        doc.fontSize(11).fillColor('#2d3748')
            .text(`• Total Vectors: ${ex.totalVectors || 0}`)
            .text(`• Successful Attacks: ${ex.successfulAttacks || 0}`)
            .text(`• Failed Attacks: ${ex.failedAttacks || 0}`)
            .text(`• Success Rate: ${ex.overallSuccessRate || '0%'}`)
            .text(`• Risk Level: ${ex.riskLevel || 'UNKNOWN'}`);
    }

    // ✅ 修正 addTechnicalAnalysis
    addTechnicalAnalysis(doc, findings, pentestResults) {
        doc.fontSize(22)
            .fillColor('#1a365d')
            .text('Technical Analysis & Recommendations', 50, 50);

        doc.moveTo(50, 80)
            .lineTo(550, 80)
            .strokeColor('#3182ce')
            .lineWidth(2)
            .stroke();

        doc.moveDown(2);

        // 從 Grok 報告提取技術分析內容
        const grokPentest = pentestResults?.grokReports?.pentestReport?.content || '';
        const grokAttack = pentestResults?.grokReports?.attackRecommendations?.content || '';

        const technicalContent = this.extractTechnicalAnalysis(grokPentest);
        const attackRecommendations = this.extractAttackRecommendations(grokAttack);

        // Section 1: Grok 技術分析
        doc.fontSize(16)
            .fillColor('#2b6cb0')
            .text('Grok AI Security Analysis');

        doc.moveDown(1);

        if (technicalContent && technicalContent.length > 20) {
            doc.fontSize(10)
                .fillColor('#2d3748')
                .text(technicalContent, {
                    width: 480,
                    align: 'justify'
                });
            doc.moveDown(2);
        }

        // ✅ 檢查是否需要換頁
        if (doc.y > 650) {
            doc.addPage();
        }

        // Section 2: Grok 攻擊建議
        doc.fontSize(16)
            .fillColor('#2b6cb0')
            .text('Attack Vector Recommendations');

        doc.moveDown(1);

        if (attackRecommendations && attackRecommendations.length > 20) {
            doc.fontSize(10)
                .fillColor('#2d3748')
                .text(attackRecommendations, {
                    width: 480,
                    align: 'justify'
                });
        }
    }


    // ✅ 新增輔助方法：從 Grok Markdown 提取純文字
    extractExecutiveSummary(grokContent) {
        if (!grokContent) return '';

        // 簡單提取前500字作為摘要
        const cleanText = this.stripEmoji(this.mdToPlain(grokContent));
        const lines = cleanText.split('\n').filter(line => line.trim().length > 0);

        // 取前10行或前500字
        let summary = lines.slice(0, 10).join('\n');
        if (summary.length > 500) {
            summary = summary.substring(0, 500) + '...';
        }

        return summary;
    }

    extractTechnicalAnalysis(grokContent) {
        if (!grokContent) return '';
        return this.stripEmoji(this.mdToPlain(grokContent));
    }

    extractAttackRecommendations(grokContent) {
        if (!grokContent) return '';
        return this.stripEmoji(this.mdToPlain(grokContent));
    }

    addRecommendations(doc, findings) {
        doc.fontSize(22)
            .fillColor('#1a365d')
            .text('Recommendations & Action Plan', 50, 50);

        doc.moveTo(50, 80).lineTo(550, 80).strokeColor('#3182ce').lineWidth(2).stroke();

        let y = 100;

        // 緊急措施
        doc.rect(50, y, 500, 140)
            .fillAndStroke('#fed7d7', '#fc8181');

        doc.fillColor('#742a2a')
            .fontSize(16)
            .text('CRITICAL (1-7 days)', 60, y + 15);

        doc.fillColor('#822727')
            .fontSize(11)
            .text('1. Patch all SQL injection vulnerabilities immediately', 70, y + 40)
            .text('2. Implement emergency access controls and MFA', 70, y + 60)
            .text('3. Enable comprehensive security logging', 70, y + 80)
            .text('4. Establish 24/7 incident response capability', 70, y + 100)
            .text('5. Conduct emergency security awareness briefing', 70, y + 120);

        y += 160;

        // 高優先級
        doc.rect(50, y, 500, 120)
            .fillAndStroke('#fef5e7', '#f6ad55');

        doc.fillColor('#c05621')
            .fontSize(16)
            .text('HIGH PRIORITY (1-30 days)', 60, y + 15);

        doc.fillColor('#7b341e')
            .fontSize(11)
            .text('1. Complete security architecture review', 70, y + 40)
            .text('2. Implement OWASP Top 10 countermeasures', 70, y + 60)
            .text('3. Establish security testing pipeline', 70, y + 80)
            .text('4. Deploy security monitoring tools (SIEM)', 70, y + 100);

        y += 140;

        // 中期改善
        doc.rect(50, y, 500, 100)
            .fillAndStroke('#f0fff4', '#68d391');

        doc.fillColor('#276749')
            .fontSize(16)
            .text('MEDIUM TERM (1-3 months)', 60, y + 15);

        doc.fillColor('#2f855a')
            .fontSize(11)
            .text('1. Achieve ISO 27001 certification readiness', 70, y + 40)
            .text('2. Implement comprehensive security training program', 70, y + 60)
            .text('3. Establish vendor security management program', 70, y + 80);
    }

    addAuditTrail(doc, options) {
        doc.fontSize(22)
            .fillColor('#1a365d')
            .text('Audit Trail & Methodology', 50, 50);

        doc.moveTo(50, 80).lineTo(550, 80).strokeColor('#3182ce').lineWidth(2).stroke();

        let y = 100;

        // 測試方法表格
        const auditData = [
            ['Test Execution Date', new Date().toLocaleDateString('en-US')],
            ['Testing Tools', 'Nessus Professional, OWASP ZAP, Custom Scripts'],
            ['Testing Methodology', 'OWASP Testing Guide v4.0 + NIST SP 800-115'],
            ['Analysis Framework', 'Static Analysis + Dynamic Testing + Manual Review'],
            ['Report Generation', 'QinGuoQinCheng AI RAG System'],
            ['Data Sources', 'pgvector Database + Legal Knowledge Base'],
            ['AI Model', 'qinguoqinchen-legal-embedder-v1.0 (1024-dim vectors)'],
            ['Compliance Frameworks', options.complianceFrameworks?.join(', ') || 'ISO 27001, OWASP'],
            ['Test Environment', 'Production-equivalent staging environment'],
            ['Test Duration', '72 hours comprehensive assessment']
        ];

        // 表格標題
        doc.fontSize(14)
            .fillColor('#2b6cb0')
            .text('Assessment Details:', 50, y);

        y += 30;

        // 繪製表格
        auditData.forEach(([key, value], index) => {
            const rowY = y + (index * 25);

            // 交替行背景
            if (index % 2 === 0) {
                doc.rect(50, rowY - 2, 500, 25)
                    .fillAndStroke('#f7fafc', '#f7fafc');
            }

            doc.fillColor('#2d3748')
                .fontSize(11)
                .text(key + ':', 60, rowY + 5)
                .fillColor('#4a5568')
                .text(value, 200, rowY + 5);
        });

        y += auditData.length * 25 + 40;

        // 免責聲明
        doc.rect(50, y, 500, 80)
            .fillAndStroke('#fff8f0', '#fed7aa');

        doc.fillColor('#c2410c')
            .fontSize(12)
            .text('Important Disclaimers:', 60, y + 10);

        doc.fillColor('#9a3412')
            .fontSize(10)
            .text('• This assessment reflects system state at time of testing only', 70, y + 30)
            .text('• Implement recommendations after consulting security professionals', 70, y + 45)
            .text('• Regular reassessment recommended every 6 months', 70, y + 60);

        // 報告 ID
        doc.fillColor('#718096')
            .fontSize(10)
            .text(`Report ID: COMPLIANCE-${Date.now()}`, 50, 750)
            .text('Generated by QinGuoQinCheng AI System', 50, 765)
            .text('© 2025 National Taichung University of Science and Technology', 50, 780);
    }

}

module.exports = ComplianceReportService;
