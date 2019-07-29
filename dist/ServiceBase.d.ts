/// <reference types="express" />
import Rabbit from './rabbit';
import Logger from './utils/Logger';
import { Express } from './api';
import { Configuration, ServiceConfiguration, RabbitConfiguration, ApiConfiguration } from './utils/ServiceConf';
export interface ServiceResources {
    configuration: Configuration;
    rabbit: Rabbit;
    logger: Logger;
}
export default class ServiceBase {
    configuration: Configuration;
    logger: Logger;
    app: Express;
    resources: ServiceResources;
    protected events: any;
    protected tasks: any;
    protected routes: any;
    protected rpcs: any;
    constructor(conf?: Configuration);
    init(): Promise<void>;
}
export { Configuration, Express, Logger, ServiceConfiguration, RabbitConfiguration, ApiConfiguration, };
