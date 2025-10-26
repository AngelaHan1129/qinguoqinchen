// tests/setup/start-test-server.js
const TestServer = require('./test-server');

async function startServer() {
    try {
        const server = new TestServer();
        await server.start(3001);

        // 保持伺服器運行
        process.on('SIGTERM', async () => {
            console.log('📡 收到終止信號，正在關閉測試伺服器...');
            await server.stop();
            process.exit(0);
        });

        process.on('SIGINT', async () => {
            console.log('📡 收到中斷信號，正在關閉測試伺服器...');
            await server.stop();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ 測試伺服器啟動失敗:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = startServer;
