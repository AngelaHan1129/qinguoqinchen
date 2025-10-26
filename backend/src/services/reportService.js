const defaultVectorMap = require('../constants/vectorMap.js');

async function generatePentestReport({
    vectorIds = [],
    intensity = 'medium',
    targetUrl = '',
    generateReports = false,
    modelInfo = {},
    clientName = '未指定',
    testStartTime = Date.now(),
    testEndTime = Date.now(),
    testUser = 'AI 專家'
}) {
    // 可以改成 deep merge
    const vectorMap = { ...defaultVectorMap, ...modelInfo };

    const results = vectorIds.map(id => ({
        vectorId: id,
        model: vectorMap[id]?.model || id,
        scenario: vectorMap[id]?.scenario || '未知',
        successRate: vectorMap[id]?.successRate || 0,
        success: false,
        confidence: 0.0
    }));

    const dateString = new Date(testStartTime).toLocaleDateString('zh-TW');
    const durationSeconds = Math.floor((testEndTime - testStartTime) / 1000);

    const pentestReportContent = `
# 滲透測試報告
## 報告基本資訊
- **報告日期**：${dateString}
- **測試期間**：${durationSeconds} 秒
- **目標網址**：${targetUrl || '未提供'}
- **測試執行者**：${testUser}
- **客戶/公司**：${clientName}
- **攻擊模型/向量**：${vectorIds.map(id => vectorMap[id]?.model || id).join(', ')}
- **攻擊場景**：${vectorIds.map(id => vectorMap[id]?.scenario || id).join(', ')}
- **模型成功率**：${vectorIds.map(id => `${vectorMap[id]?.model}: ${vectorMap[id]?.successRate || 0}%`).join('，')}

## 測試細節
${results.map(r => `- 向量：${r.vectorId}（模型：${r.model}，場景：${r.scenario}，成功率：${r.successRate}%）`).join('\n')}

- 其他細節依工程設計繼續擴充 ...
`;

    return {
        reportMarkdown: pentestReportContent,
        results
    };
}
module.exports = { generatePentestReport };
