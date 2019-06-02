import * as _ from 'lodash';
import { config as configureEnvironmentVariables } from 'dotenv';
// require our environment variables
configureEnvironmentVariables();

export interface ServiceConfiguration {
  environment: string;
  service: string;
  port: number;
}
export interface ApiConfiguration {
  port: number;
}
export interface RedisConfiguration {
  host: string;
  port: number;
}
export interface RabbitConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
  exchange: string;
  queue: string;
}
export interface MongoConfiguration {
  auth: {
    user: string;
    password: string;
  };
  url: string;
  port: number;
  dbName: string;
}
export interface PostgresConfiguration {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}
export interface Configuration {
  baseDir: string;
  service: ServiceConfiguration;
  rabbit: RabbitConfiguration;
  mongo: MongoConfiguration;
  api: ApiConfiguration;
  redis: RedisConfiguration;
  postgres: PostgresConfiguration;
}

export const serviceConf: ServiceConfiguration = {
  environment: _.get(process.env, 'ENVIRONMENT', 'local'),
  service: _.get(process.env, 'SERVICE', 'service'),
  port: _.toNumber(_.get(process.env, 'PORT', 8000)),
};
export const apiConf: ApiConfiguration = {
  port: serviceConf.port,
};
export const redisConf: RedisConfiguration = {
  host: _.get(process.env, 'REDIS_HOST', 'localhost'),
  port: _.toNumber(_.get(process.env, 'REDIS_PORT', 6379)),
};
export const rabbitConf: RabbitConfiguration = {
  username: _.get(process.env, 'RABBITMQ_USERNAME', 'service'),
  password: _.get(process.env, 'RABBITMQ_PASSWORD', 'service'),
  host: _.get(process.env, 'RABBITMQ_HOST', 'localhost'),
  port: _.toNumber(_.get(process.env, 'RABBITMQ_PORT', 5432)),
  exchange: serviceConf.environment,
  queue: serviceConf.service,
};
export const mongoConf: MongoConfiguration = {
  auth: {
    user: _.get(process.env, 'MONGO_USERNAME', 'service'),
    password: _.get(process.env, 'MONGO_PASSWORD', 'service'),
  },
  url: _.get(process.env, 'MONGO_URL', 'localhost'),
  port: _.toNumber(_.get(process.env, 'MONGO_PORT', 27017)),
  dbName: _.get(process.env, 'MONGO_DATABASE', `${serviceConf.environment}_${serviceConf.service}`),
};
export const postgresConf: PostgresConfiguration = {
  host: _.get(process.env, 'POSTGRES_HOST', 'service'),
  port: _.toNumber(_.get(process.env, 'POSTGRES_PORT', 5432)),
  user: _.get(process.env, 'POSTGRES_USERNAME', 'service'),
  password: _.get(process.env, 'POSTGRES_PASSWORD', 'service'),
  database: _.get(process.env, 'POSTGRES_DATABASE', 'service'),
  ssl: _.toLower(_.get(process.env, 'POSTGRES_SSL', 'true')) === 'true',
};
export const configuration: Configuration = {
  baseDir: __dirname,
  service: serviceConf,
  rabbit: rabbitConf,
  mongo: mongoConf,
  api: apiConf,
  redis: redisConf,
  postgres: postgresConf,
};
