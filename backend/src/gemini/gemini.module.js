const { Module } = require('@nestjs/common');
const { GeminiController } = require('./gemini.controller');
const { GeminiService } = require('./gemini.service');

@Module({
  imports: [],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService], // 讓其他模組可以使用
})
class GeminiModule { }

module.exports = { GeminiModule };
