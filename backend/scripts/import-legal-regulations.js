// backend/scripts/import-legal-regulations.js
const { LegalVectorManager } = require('../src/services/legal-vector-manager.js');

async function importDefaultRegulations() {
    const vectorManager = new LegalVectorManager();

    const regulations = [
        {
            title: '個人資料保護法',
            content: `第1條 為規範個人資料之蒐集、處理及利用，以避免人格權受侵害，並促進個人資料之合理利用，特制定本法。

第6條 有關醫療、基因、性生活、健康檢查及犯罪前科之個人資料，不得蒐集、處理或利用。但有下列情形之一者，不在此限：
一、法律明文規定。
二、公務機關執行法定職務或非公務機關履行法定義務必要範圍內，且事前或事後有適當安全維護措施。
三、當事人自行公開或其他已合法公開之個人資料。
四、公務機關或學術研究機構基於醫療、衛生或犯罪預防之目的，為統計或學術研究而有必要，且資料經過提供者處理後或蒐集者依其揭露方式無從識別特定之當事人。
五、為協助公務機關執行法定職務或非公務機關履行法定義務必要範圍內，且事前或事後有適當安全維護措施。
六、經當事人書面同意。
七、與當事人有契約或類似契約之關係，且已採取適當之安全措施。

第47條 意圖營利，違反第六條第一項規定，足生損害於他人者，處五年以下有期徒刑，得併科新臺幣一百萬元以下罰金。`,
            source: 'MOJ',
            document_type: 'law',
            jurisdiction: 'Taiwan',
            metadata: {
                lawType: 'civil',
                industryScope: ['all'],
                complianceLevel: 'mandatory',
                tags: ['個資保護', '生物特徵', 'eKYC'],
                penalties: {
                    criminal: '5年以下有期徒刑',
                    fine: '100萬元以下罰金'
                }
            }
        },
        {
            title: '資通安全管理法',
            content: `第14條 關鍵基礎設施提供者發現資通安全事件時，應立即採取應變措施及調查鑑識，並於事件發現後七十二小時內通報主管機關。

第22條 違反第十四條第一項規定，未於規定時間內通報者，處新臺幣三十萬元以上一百五十萬元以下罰鍰。`,
            source: 'MOJ',
            document_type: 'law',
            jurisdiction: 'Taiwan',
            metadata: {
                lawType: 'administrative',
                industryScope: ['critical-infrastructure'],
                complianceLevel: 'mandatory',
                tags: ['資通安全', '事件通報'],
                penalties: {
                    fine: '30-150萬元罰鍰'
                }
            }
        },
        {
            title: '金融機構資訊安全管理辦法',
            content: `第14條 金融機構發生資訊安全事件時，應立即查明及控制損害範圍，並於事件發生後二十四小時內，向主管機關申報。

第27條 違反第十四條規定者，處新臺幣二十萬元以上一百萬元以下罰鍰。`,
            source: 'FSC',
            document_type: 'regulation',
            jurisdiction: 'Taiwan',
            metadata: {
                lawType: 'administrative',
                industryScope: ['finance'],
                complianceLevel: 'mandatory',
                tags: ['金融資安', '事件通報'],
                penalties: {
                    fine: '20-100萬元罰鍰'
                }
            }
        }
    ];

    console.log('📚 開始匯入預設法規資料...');
    const result = await vectorManager.ingestLegalDocumentsWithVectorization(regulations);

    console.log('✅ 法規資料匯入完成！');
    console.log(`總計: ${result.total}, 成功: ${result.successful}, 失敗: ${result.failed}`);

    return result;
}

if (require.main === module) {
    importDefaultRegulations()
        .then(result => {
            console.log('匯入結果:', result);
            process.exit(0);
        })
        .catch(error => {
            console.error('匯入失敗:', error);
            process.exit(1);
        });
}

module.exports = { importDefaultRegulations };
