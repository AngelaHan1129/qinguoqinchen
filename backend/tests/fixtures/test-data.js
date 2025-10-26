// tests/fixtures/test-data.js
const testData = {
    ragQueries: [
        { query: 'GDPR合規要求', expectedResults: 5 },
        { query: '資料隱私政策', expectedResults: 3 },
        { query: 'AI倫理準則', expectedResults: 7 }
    ],

    aiTestCases: [
        { type: 'deepfake', confidence: 0.85 },
        { type: 'document_forge', confidence: 0.92 },
        { type: 'identity_theft', confidence: 0.78 }
    ]
};

module.exports = { testData };
