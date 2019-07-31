/// <reference types="express" />
import Rabbit from './rabbit';
import Logger from './utils/Logger';
import { Express } from './utils/API';
import { Configuration } from './utils/ServiceConf';
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
