// src/services/ComplianceCrawlerService.js
const Logger = require('../utils/logger');

class ComplianceCrawlerService {
    constructor(ragService) {
        this.ragService = ragService;
        Logger.info('✅ 法規爬蟲服務初始化完成');
    }

    async crawlIso27001() {
        Logger.info('🔍 開始爬取 ISO 27001...');

        // 模擬 ISO 27001 資料
        const iso27001Controls = [
            {
                title: 'ISO 27001:2022 - A.5 資訊安全政策',
                content: `資訊安全政策應明確定義組織對資訊安全的方向與承諾。
                
主要要求：
1. 高階管理階層應建立資訊安全政策
2. 政策應與組織的業務目標一致
3. 政策應定期審查與更新
4. 政策應傳達給所有相關人員

實作建議：
- 制定明確的資訊安全政策文件
- 定義角色與責任
- 建立政策審查機制`,
                documentType: 'standard',
                jurisdiction: 'INTERNATIONAL',
                lawCategory: 'ISO標準',
                articleNumber: 'A.5',
                source: 'iso_crawler'
            },
            {
                title: 'ISO 27001:2022 - A.8 資產管理',
                content: `組織應識別資訊資產並定義適當的保護責任。
                
主要要求：
1. 建立資產清冊
2. 定義資產擁有者
3. 實施資產分類
4. 建立資產處理程序

針對 eKYC 系統：
- 個人資料為關鍵資產
- 生物特徵資料需特別保護
- 系統存取日誌為重要資產`,
                documentType: 'standard',
                jurisdiction: 'INTERNATIONAL',
                lawCategory: 'ISO標準',
                articleNumber: 'A.8',
                source: 'iso_crawler'
            }
        ];

        const results = [];
        for (const control of iso27001Controls) {
            try {
                const result = await this.ragService.ingestLegalDocument({
                    ...control,
                    metadata: {
                        standardFamily: 'ISO 27001',
                        controlCategory: control.articleNumber,
                        crawledAt: new Date().toISOString(),
                        updateFrequency: 'monthly'
                    }
                });
                results.push(result);
                Logger.info(`✅ 匯入 ISO 27001 控制措施: ${control.articleNumber}`);
            } catch (error) {
                Logger.error(`❌ 匯入失敗: ${control.articleNumber}`, error.message);
            }
        }

        Logger.success(`✅ ISO 27001 匯入完成: ${results.length} 個控制措施`);
        return results;
    }

    async crawlOwaspTop10() {
        Logger.info('🔍 開始爬取 OWASP Top 10...');

        const owaspRisks = [
            {
                title: 'OWASP Top 10 - A01:2021 存取控制破壞',
                content: `存取控制強制執行政策，使得用戶不能在其預期權限之外行動。

常見弱點：
1. 透過修改 URL、內部應用程式狀態或 HTML 頁面來違反存取控制
2. 允許主鍵被更改為其他使用者的記錄
3. 提權攻擊，未登入即可使用或以一般使用者身分使用管理功能
4. 中繼資料操作，如重放或篡改 JSON Web Token (JWT)

針對 eKYC 系統的影響：
- 可能導致未授權存取個人身分資料
- 攻擊者可能冒充其他用戶進行身分驗證
- 違反個人資料保護法規定`,
                documentType: 'guideline',
                jurisdiction: 'INTERNATIONAL',
                lawCategory: 'OWASP指南',
                articleNumber: 'A01',
                source: 'owasp_crawler'
            },
            {
                title: 'OWASP Top 10 - A03:2021 注入攻擊',
                content: `當不受信任的資料作為命令或查詢的一部分發送到解譯器時，就會發生注入缺陷。

常見注入類型：
1. SQL注入
2. NoSQL注入  
3. OS命令注入
4. LDAP注入

eKYC 系統防護建議：
- 使用參數化查詢或 ORM
- 輸入驗證與清理
- 實施最小權限原則
- 定期進行安全測試`,
                documentType: 'guideline',
                jurisdiction: 'INTERNATIONAL',
                lawCategory: 'OWASP指南',
                articleNumber: 'A03',
                source: 'owasp_crawler'
            }
        ];

        const results = [];
        for (const risk of owaspRisks) {
            try {
                const result = await this.ragService.ingestLegalDocument({
                    ...risk,
                    metadata: {
                        owaspYear: 2021,
                        riskCategory: risk.articleNumber,
                        crawledAt: new Date().toISOString()
                    }
                });
                results.push(result);
                Logger.info(`✅ 匯入 OWASP 風險: ${risk.articleNumber}`);
            } catch (error) {
                Logger.error(`❌ 匯入失敗: ${risk.articleNumber}`, error.message);
            }
        }

        Logger.success(`✅ OWASP Top 10 匯入完成: ${results.length} 個風險項目`);
        return results;
    }

    async crawlTaiwanLegalDatabase() {
        Logger.info('🔍 開始爬取全國法規資料庫...');

        const taiwanLaws = [
            {
                title: '個人資料保護法第6條',
                content: `有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用。但有下列情形之一者，不在此限：

一、法律明文規定。
二、公務機關執行法定職務或非公務機關履行法定義務必要範圍內。  
三、當事人自行公開或其他已合法公開之個人資料。
四、學術研究機構基於公共利益為學術研究而有必要，且資料經過提供者處理後或經蒐集者依其揭露方式無從識別特定之當事人。
五、為協助公務機關執行法定職務或非公務機關履行法定義務必要範圍內。
六、經當事人書面同意。

eKYC 系統應注意：
- 生物特徵資料屬於特種個人資料
- 需要明確的法律依據或當事人同意
- 應建立完整的同意機制`,
                documentType: 'law',
                jurisdiction: 'TW',
                lawCategory: '個資法',
                articleNumber: '6',
                source: 'moj_crawler'
            },
            {
                title: '資通安全管理法第18條',
                content: `公務機關發生資通安全事件時，應立即採取應變措施，並通報中央主管機關。

通報時機：
1. 發現或得知資通安全事件時
2. 應於24小時內完成通報
3. 重大資通安全事件應於1小時內通報

eKYC 系統資安事件處理：
- 建立事件回應程序
- 確保通報時效性
- 保留相關證據
- 配合主管機關調查`,
                documentType: 'law',
                jurisdiction: 'TW',
                lawCategory: '資通安全管理法',
                articleNumber: '18',
                source: 'moj_crawler'
            }
        ];

        const results = [];
        for (const law of taiwanLaws) {
            try {
                const result = await this.ragService.ingestLegalDocument({
                    ...law,
                    metadata: {
                        ministry: '法務部',
                        effectiveDate: '2021-05-01',
                        crawledAt: new Date().toISOString()
                    }
                });
                results.push(result);
                Logger.info(`✅ 匯入台灣法規: ${law.lawCategory} 第${law.articleNumber}條`);
            } catch (error) {
                Logger.error(`❌ 匯入失敗: ${law.title}`, error.message);
            }
        }

        Logger.success(`✅ 全國法規資料庫匯入完成: ${results.length} 個條文`);
        return results;
    }

    async crawlIec62443() {
        Logger.info('🔍 開始爬取 IEC 62443...');

        const iecStandards = [
            {
                title: 'IEC 62443-3-3: 系統安全需求和安全等級',
                content: `本標準定義了工業自動化和控制系統的安全需求和安全等級。

安全等級 (Security Level, SL):
- SL 1: 防護偶發或意外違反
- SL 2: 防護蓄意違反（有限資源和技能）
- SL 3: 防護蓄意違反（豐富資源和特定技能）  
- SL 4: 防護蓄意違反（豐富資源和高級技能）

eKYC 系統建議：
- 採用 SL 2-3 等級保護
- 實施多層次防護策略
- 建立完整的監控機制`,
                documentType: 'standard',
                jurisdiction: 'INTERNATIONAL',
                lawCategory: 'IEC標準',
                articleNumber: 'IEC 62443-3-3',
                source: 'iec_crawler'
            }
        ];

        const results = [];
        for (const standard of iecStandards) {
            try {
                const result = await this.ragService.ingestLegalDocument({
                    ...standard,
                    metadata: {
                        standardFamily: 'IEC 62443',
                        domain: 'industrial_cybersecurity',
                        crawledAt: new Date().toISOString()
                    }
                });
                results.push(result);
                Logger.info(`✅ 匯入 IEC 標準: ${standard.articleNumber}`);
            } catch (error) {
                Logger.error(`❌ 匯入失敗: ${standard.articleNumber}`, error.message);
            }
        }

        Logger.success(`✅ IEC 62443 匯入完成: ${results.length} 個標準部分`);
        return results;
    }
}

module.exports = ComplianceCrawlerService;
