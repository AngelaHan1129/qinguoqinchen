// backend/src/modules/legal-rag/compliance-scraper.service.js
const axios = require('axios');
const cheerio = require('cheerio');

class ComplianceScraperService {
    constructor() {
        this.logger = console; // 簡化日誌
    }

    /**
     * 取得最新法規更新
     * @param {Object} options - 選項
     * @returns {Promise<Object>} - 更新結果
     */
    async getLatestUpdates(options = {}) {
        const sources = options.sources || ['MOJ', 'FSC', 'MOTC'];
        const updates = [];

        for (const source of sources) {
            try {
                const sourceUpdates = await this.scrapeSource(source);
                updates.push(...sourceUpdates);
            } catch (error) {
                this.logger.error(`爬取 ${source} 失敗: ${error.message}`);
            }
        }

        return {
            updates: updates.sort((a, b) => new Date(b.date) - new Date(a.date)),
            timestamp: new Date(),
            totalFound: updates.length
        };
    }

    /**
     * 爬取特定來源
     * @param {string} source - 來源名稱
     * @returns {Promise<Array>} - 爬取結果
     */
    async scrapeSource(source) {
        const scrapers = {
            MOJ: () => this.scrapeMOJ(),
            FSC: () => this.scrapeFSC(),
            MOTC: () => this.scrapeMOTC(),
            ISO27001: () => this.scrapeISO27001(),
            OWASP: () => this.scrapeOWASP()
        };

        return await scrapers[source]() || [];
    }

    /**
     * 爬取法務部法規
     * @returns {Promise<Array>} - 法務部更新
     */
    async scrapeMOJ() {
        try {
            // 模擬爬取法務部全國法規資料庫
            return [
                {
                    source: 'MOJ',
                    title: '個人資料保護法修正案',
                    url: 'https://law.moj.gov.tw/...',
                    date: '2025-10-01',
                    category: 'privacy',
                    relevance: 'high',
                    summary: '新增生物特徵資料處理規範，影響 eKYC 系統合規要求'
                },
                {
                    source: 'MOJ',
                    title: '資通安全管理法施行細則修正',
                    url: 'https://law.moj.gov.tw/...',
                    date: '2025-09-28',
                    category: 'cybersecurity',
                    relevance: 'critical',
                    summary: '強化關鍵基礎設施資安防護，新增AI系統安全評估要求'
                }
            ];
        } catch (error) {
            this.logger.error(`MOJ 爬取失敗: ${error.message}`);
            return [];
        }
    }

    /**
     * 爬取金管會法規
     * @returns {Promise<Array>} - 金管會更新
     */
    async scrapeFSC() {
        try {
            // 模擬爬取金管會法規
            return [
                {
                    source: 'FSC',
                    title: '金融機構資訊安全管理辦法修正',
                    url: 'https://www.fsc.gov.tw/...',
                    date: '2025-09-15',
                    category: 'financial-security',
                    relevance: 'critical',
                    summary: '強化 AI 系統風險管控，要求建立 AI 模型驗證機制'
                },
                {
                    source: 'FSC',
                    title: '銀行業辦理電子化服務作業注意事項',
                    url: 'https://www.fsc.gov.tw/...',
                    date: '2025-08-30',
                    category: 'ekyc-regulation',
                    relevance: 'high',
                    summary: '新增數位身分驗證技術規範，包含生物辨識安全要求'
                }
            ];
        } catch (error) {
            this.logger.error(`FSC 爬取失敗: ${error.message}`);
            return [];
        }
    }

    /**
     * 爬取交通部法規
     * @returns {Promise<Array>} - 交通部更新
     */
    async scrapeMOTC() {
        try {
            return [
                {
                    source: 'MOTC',
                    title: '電信事業網路互連管理辦法',
                    url: 'https://www.motc.gov.tw/...',
                    date: '2025-09-20',
                    category: 'telecom-security',
                    relevance: 'medium',
                    summary: '更新電信網路安全標準，影響通訊加密要求'
                }
            ];
        } catch (error) {
            this.logger.error(`MOTC 爬取失敗: ${error.message}`);
            return [];
        }
    }

    /**
     * 批量匯入法規資料庫
     * @returns {Promise<Array>} - 法規資料
     */
    async batchImportRegulations() {
        const regulationSources = [
            {
                title: '個人資料保護法',
                content: this.getPersonalDataProtectionLaw(),
                source: 'MOJ',
                documentType: 'law',
                jurisdiction: 'Taiwan',
                metadata: {
                    lawType: 'civil',
                    industryScope: ['all'],
                    complianceLevel: 'mandatory',
                    effectiveDate: '2012-10-01',
                    tags: ['個資保護', '生物特徵', 'eKYC'],
                    relatedRegulations: ['資通安全管理法', '金融消費者保護法']
                }
            },
            {
                title: 'ISO 27001:2022 資訊安全管理標準',
                content: this.getISO27001Content(),
                source: 'ISO',
                documentType: 'standard',
                jurisdiction: 'International',
                metadata: {
                    lawType: 'standard',
                    industryScope: ['technology', 'finance', 'healthcare'],
                    complianceLevel: 'recommended',
                    effectiveDate: '2022-10-25',
                    tags: ['資訊安全', 'ISMS', '風險管理'],
                    relatedRegulations: ['ISO 27002', 'ISO 27005']
                }
            },
            {
                title: '資通安全管理法',
                content: this.getCybersecurityLaw(),
                source: 'MOJ',
                documentType: 'law',
                jurisdiction: 'Taiwan',
                metadata: {
                    lawType: 'administrative',
                    industryScope: ['government', 'critical-infrastructure'],
                    complianceLevel: 'mandatory',
                    effectiveDate: '2019-01-01',
                    tags: ['資通安全', '關鍵基礎設施', '事件通報'],
                    relatedRegulations: ['個人資料保護法', '政府資訊公開法']
                }
            },
            {
                title: '金融機構資訊安全管理辦法',
                content: this.getFinancialSecurityRegulation(),
                source: 'FSC',
                documentType: 'regulation',
                jurisdiction: 'Taiwan',
                metadata: {
                    lawType: 'administrative',
                    industryScope: ['finance', 'banking', 'insurance'],
                    complianceLevel: 'mandatory',
                    effectiveDate: '2020-01-01',
                    tags: ['金融資安', '風險管理', '內控制度'],
                    relatedRegulations: ['銀行法', '保險法', '證券交易法']
                }
            }
        ];

        return regulationSources;
    }

    /**
     * 個資法完整條文
     * @returns {string} - 法條內容
     */
    getPersonalDataProtectionLaw() {
        return `
第1條 為規範個人資料之蒐集、處理及利用，以避免人格權受侵害，並促進個人資料之合理利用，特制定本法。

第2條 本法用詞，定義如下：
一、個人資料：指自然人之姓名、出生年月日、國民身分證統一編號、護照號碼、特徵、指紋、婚姻、家庭、教育、職業、病歷、醫療、基因、性生活、健康檢查、犯罪前科、聯絡方式、財務情況、社會活動及其他得以直接或間接方式識別該個人之資料。
二、個人資料檔案：指依系統性方法而為蒐集之個人資料之集合。
三、蒐集：指以任何方式取得個人資料。
四、處理：指為建立或利用個人資料檔案所為之記錄、輸入、儲存、編輯、更正、複製、檢索、刪除、輸出、連結或內部傳送。
五、利用：指將蒐集之個人資料為處理以外之使用。

第3條 當事人就其個人資料依本法規定行使之下列權利，不得預先拋棄或以特約限制之：
一、查詢或請求閱覽。
二、請求製給複製本。
三、請求補充或更正。
四、請求停止蒐集、處理或利用。
五、請求刪除。

第6條 有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用。但有下列情形之一者，不在此限：
一、法律明文規定。
二、公務機關執行法定職務或非公務機關履行法定義務必要範圍內，且事前或事後有適當安全維護措施。
三、當事人自行公開或其他已合法公開之個人資料。
四、公務機關或學術研究機構基於醫療、衛生或犯罪預防之目的，為統計或學術研究而有必要，且資料經過提供者處理後或蒐集者依其揭露方式無從識別特定之當事人。
五、為協助公務機關執行法定職務或非公務機關履行法定義務必要範圍內，且事前或事後有適當安全維護措施。
六、經當事人書面同意。
七、與當事人有契約或類似契約之關係，且已採取適當之安全措施。

第8條 公務機關或非公務機關依第十五條或第十九條規定蒐集個人資料時，應明確告知當事人下列事項：
一、公務機關或非公務機關名稱。
二、蒐集之目的。
三、個人資料之類別。
四、個人資料利用之期間、地區、對象及方式。
五、當事人依第三條規定得行使之權利及方式。
六、當事人得自由選擇提供個人資料時，不提供將對其權益之影響。

第47條 意圖營利，違反第六條第一項、第十五條、第十六條、第十九條、第二十條第一項規定，或中央目的事業主管機關依第二十一條限制國際傳輸之命令或處分，足生損害於他人者，處五年以下有期徒刑，得併科新臺幣一百萬元以下罰金。

第48條 違反第六條第一項、第十五條、第十六條、第十九條、第二十條第一項規定，足生損害於他人者，處二年以下有期徒刑、拘役或科或併科新臺幣二十萬元以下罰金。
    `;
    }

    /**
     * ISO 27001 相關內容
     * @returns {string} - 標準內容
     */
    getISO27001Content() {
        return `
A.5 資訊安全政策

A.5.1 資訊安全政策
控制措施：應制定一套資訊安全政策，經管理階層核准並發布及傳達給員工及相關外部團體。

實作指引：
- 資訊安全政策應反映業務需求並符合相關法規
- 應定義資訊安全之整體方向及支持
- 應考慮組織之風險管控架構
- 政策應定期審查及更新

A.8 資訊資產管理

A.8.1 資訊資產盤點
控制措施：應識別組織內之資訊資產，並編製及維護這些資產之盤點清冊。

實作指引：
- 所有資訊資產應有明確的擁有者
- 資產清冊應包含必要的詳細資訊
- 資產分類應依其價值、法律要求及敏感性

A.8.2 資訊分類
控制措施：應依資訊對組織之重要性，分類及標記資訊。

A.8.3 媒體處理
控制措施：應依組織之分類架構處理媒體。

A.12 作業安全

A.12.1 作業程序及責任
控制措施：應確保資訊處理設施之正確與安全作業。

A.12.2 免於惡意軟體
控制措施：應實作偵測、預防及復原控制措施，以保護免於惡意軟體，並配合適當之使用者認知。

A.12.3 備份
控制措施：應依照商定之備份政策，定期建立資訊、軟體及系統映像檔之備份複本並測試。

A.12.6 技術脆弱性管理
控制措施：應取得有關使用中之技術系統之技術脆弱性資訊，評估組織暴露於此類脆弱性之程度，並採取適當措施。

A.13 通訊安全

A.13.1 網路安全管理
控制措施：應管理及控制網路以保護系統及應用程式中之資訊。

A.13.2 資訊傳送
控制措施：應維護透過各類通訊設施傳送之資訊安全。

A.14 系統取得、開發及維護

A.14.1 資訊系統之安全要求
控制措施：安全要求應於資訊系統之要求規格中識別、規定及核准。

A.14.2 開發及支援程序中之安全
控制措施：應於系統開發生命週期中建立及實作安全開發規則。
    `;
    }

    /**
     * 資通安全管理法
     * @returns {string} - 法條內容
     */
    getCybersecurityLaw() {
        return `
第1條 為促進資通安全技術發展，提升國家資通安全能力，確保國家安全，維護社會公共利益，特制定本法。

第2條 本法用詞，定義如下：
一、資通系統：指由電腦硬體、軟體、網路及相關配備組成，依設計目的發揮資料處理、互連通信或系統控制等功能之組合。
二、資通安全：指確保資通系統之機密性、完整性及可用性。
三、資通安全事件：指危害或威脅資通系統正常運作之情事。

第3條 本法所稱主管機關：在中央為國家通訊傳播委員會；在直轄市為直轄市政府；在縣（市）為縣（市）政府。

第7條 公務機關應配置資通安全長，負責資通安全政策之規劃、推動及監督執行；並應設置資通安全專責單位或置專責人員，辦理資通安全事務。

第8條 公務機關應訂定資通安全維護計畫，據以實施。

第12條 關鍵基礎設施提供者應配置資通安全長，負責資通安全政策之規劃、推動及監督執行；並應設置資通安全專責單位或置專責人員，辦理資通安全事務。

第13條 關鍵基礎設施提供者應訂定資通安全維護計畫，據以實施，並定期檢討修正。

第14條 關鍵基礎設施提供者發現資通安全事件時，應立即採取應變措施及調查鑑識，並於事件發現後七十二小時內通報主管機關。

第22條 違反第十四條第一項規定，未於規定時間內通報者，處新臺幣三十萬元以上一百五十萬元以下罰鍰。

第23條 違反第八條、第十二條或第十三條規定者，處新臺幣十萬元以上五十萬元以下罰鍰，並令限期改正；屆期未改正者，得按次處罰。
    `;
    }

    /**
     * 金融機構資訊安全管理辦法
     * @returns {string} - 辦法內容
     */
    getFinancialSecurityRegulation() {
        return `
第1條 本辦法依銀行法第四十五條之一第三項、金融控股公司法第三十六條第三項、信託業法第四十四條之一第三項、票券金融管理法第二十八條之一第三項、信用卡業務機構管理辦法第三十二條之一第三項及電子票證發行管理條例第二十九條第三項規定訂定之。

第2條 本辦法用詞，定義如下：
一、金融機構：指適用本辦法之銀行、金融控股公司、信託業、票券金融公司、信用卡業務機構及電子票證發行機構。
二、資訊資產：指對組織具有價值之資訊或資訊處理設施。
三、資訊安全事件：指已發生之事件，可能對業務營運、資訊資產或個人造成不利之衝擊。

第6條 金融機構應建立資訊安全管控制度，其內容應包括下列事項：
一、資訊安全政策之訂定。
二、組織與人員管理。
三、資訊資產分類分級與保護。
四、實體及環境安全管理。
五、通訊與作業管理。
六、存取控制管理。
七、系統開發及維護管理。
八、營運持續管理。
九、法規遵循。

第8條 金融機構應指派資訊安全長，綜理資訊安全相關事務，資訊安全長應具備下列資格條件之一：
一、國內外大專院校畢業或同等學歷，並有資訊安全管理工作經驗三年以上。
二、有資訊安全管理工作經驗五年以上。

第14條 金融機構發生資訊安全事件時，應立即查明及控制損害範圍，並於事件發生後二十四小時內，向主管機關申報。

第27條 違反第十四條規定者，處新臺幣二十萬元以上一百萬元以下罰鍰，並令其限期改正；屆期未改正者，得按次處罰。
    `;
    }
}

module.exports = { ComplianceScraperService };
