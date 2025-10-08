const { ConfigService } = require('@nestjs/config');

const getDatabaseConfig = (configService) => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'qinguoqinchen123'),
  database: configService.get('DB_NAME', 'qinguoqinchen_ai'),
  entities: [__dirname + '/../**/*.entity{.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
  logging: configService.get('NODE_ENV') === 'development',
});

module.exports = { getDatabaseConfig };
