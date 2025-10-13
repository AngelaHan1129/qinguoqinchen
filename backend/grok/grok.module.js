const { Module } = require('@nestjs/common');
const { GrokController } = require('./grok.controller');
const { GrokService } = require('./grok.service');

@Module({
  imports: [],
  controllers: [GrokController],
  providers: [GrokService],
  exports: [GrokService]
})
class GrokModule {}

module.exports = { GrokModule };
