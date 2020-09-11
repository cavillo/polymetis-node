import * as _ from 'lodash';
import { config as configureEnvironmentVariables } from 'dotenv';
// require our environment variables
configureEnvironmentVariables();

interface ServiceConfiguration {
  environment?: string;
  service?: string;
  loggerMode?: number;
}
interface ApiConfiguration {
  port?: number;
  baseRoute?: string;
}
interface RPCConfiguration {
  port?: number;
  baseRoute?: string;
}
interface RabbitConfiguration {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
}
interface Configuration {
  baseDir: string;
  service: ServiceConfiguration;
  rabbit: RabbitConfiguration;
  api: ApiConfiguration;
  rpc: RPCConfiguration;
}

const serviceConf: ServiceConfiguration = {
  environment: _.get(process.env, 'ENVIRONMENT'),
  service: _.get(process.env, 'SERVICE'),
  loggerMode: _.toNumber(_.get(process.env, 'LOGGER_MODE')),
};
const apiConf: ApiConfiguration = {
  port: _.toNumber(_.get(process.env, 'API_PORT')),
  baseRoute: _.get(process.env, 'API_BASE_ROUTE'),
};
const rpcConf: RPCConfiguration = {
  port: _.toNumber(_.get(process.env, 'RPC_PORT')),
  baseRoute: _.get(process.env, 'RPC_BASE_ROUTE'),
};
const rabbitConf: RabbitConfiguration = {
  username: _.get(process.env, 'RABBITMQ_USERNAME'),
  password: _.get(process.env, 'RABBITMQ_PASSWORD'),
  host: _.get(process.env, 'RABBITMQ_HOST'),
  port: _.toNumber(_.get(process.env, 'RABBITMQ_PORT')),
};
const configuration: Configuration = {
  baseDir: __dirname,
  service: serviceConf,
  rabbit: rabbitConf,
  api: apiConf,
  rpc: rpcConf,
};

export {
  ServiceConfiguration,
  ApiConfiguration,
  RabbitConfiguration,
  Configuration,
  serviceConf,
  apiConf,
  rpcConf,
  rabbitConf,
  configuration,
};