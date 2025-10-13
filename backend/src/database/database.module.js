const { Module } = require('@nestjs/common');
const { TypeOrmModule } = require('@nestjs/typeorm');
const { ConfigModule, ConfigService } = require('@nestjs/config');
const { Document } = require('./entities/document.entity');
const { Chunk } = require('./entities/chunk.entity');
const { TestRun } = require('./entities/test-run.entity');

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService) => ({
                type: 'postgres',
                url: configService.get('DATABASE_URL'),
                entities: [Document, Chunk, TestRun],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV !== 'production',
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Document, Chunk, TestRun]),
    ],
    exports: [TypeOrmModule],
})
class DatabaseModule { }

module.exports = { DatabaseModule };

