const { Module } = require('@nestjs/common');
const { ConfigModule } = require('@nestjs/config');
const { AppController } = require('./app.controller');
const { AppService } = require('./app.service');

const AppModuleClass = class {
  constructor() {}
};

const AppModule = Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})(AppModuleClass);

module.exports = { AppModule };
