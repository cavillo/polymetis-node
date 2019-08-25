import * as _ from 'lodash';
import { config as configureEnvironmentVariables } from 'dotenv';
// require our environment variables
configureEnvironmentVariables();

export interface ServiceConfiguration {
  environment?: string;
  service?: string;
  loggerMode?: number;
}
export interface ApiConfiguration {
  port?: number;
  prefix?: string;
}
export interface RabbitConfiguration {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  exchange?: string;
  queue?: string;
}
export interface Configuration {
  baseDir?: string;
  service?: ServiceConfiguration;
  rabbit?: RabbitConfiguration;
  api?: ApiConfiguration;
}

export const serviceConf: ServiceConfiguration = {
  environment: _.get(process.env, 'ENVIRONMENT'),
  service: _.get(process.env, 'SERVICE'),
  loggerMode: _.toNumber(_.get(process.env, 'LOGGER_MODE')),
};
export const apiConf: ApiConfiguration = {
  port: _.toNumber(_.get(process.env, 'API_PORT')),
  prefix: _.get(process.env, 'API_PREFIX'),
};
export const rabbitConf: RabbitConfiguration = {
  username: _.get(process.env, 'RABBITMQ_USERNAME'),
  password: _.get(process.env, 'RABBITMQ_PASSWORD'),
  host: _.get(process.env, 'RABBITMQ_HOST'),
  port: _.toNumber(_.get(process.env, 'RABBITMQ_PORT')),
  exchange: serviceConf.environment,
  queue: serviceConf.service,
};
export const configuration: Configuration = {
  baseDir: __dirname,
  service: serviceConf,
  rabbit: rabbitConf,
  api: apiConf,
};
