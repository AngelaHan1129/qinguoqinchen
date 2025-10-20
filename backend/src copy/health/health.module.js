// src/health/health.module.js
const { Module } = require('@nestjs/common');
const { HealthController } = require('./health.controller');
const { HealthService } = require('./health.service');

class HealthModule {}

Reflect.defineMetadata('controllers', [HealthController], HealthModule);
Reflect.defineMetadata('providers', [HealthService], HealthModule);

module.exports = { HealthModule };
