// src/health/health.service.js
class HealthService {
  constructor() {
    console.log('🩺 HealthService 初始化完成');
  }

  getSystemHealth() {
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      system: '侵國侵城 AI 系統',
      uptime: `${Math.floor(process.uptime())}秒`,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        percentage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
      },
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
      services: {
        nestjs: 'operational',
        express: 'operational',
        neo4j: 'pending',
        postgres: 'pending'
      }
    };
  }
}

module.exports = { HealthService };