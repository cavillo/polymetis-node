/// <reference types="express" />
import Rabbit from './rabbit';
import Logger from './utils/Logger';
import { Express, TrustedEndpoints } from './utils/API';
import { EventHandlerBase, TaskHandlerBase, RPCHandlerBase, RouteHandlerBase } from './base';
import { Configuration } from './utils/ServiceConf';
export interface ServiceResources {
    configuration: Configuration;
    rabbit: Rabbit;
    logger: Logger;
}
export interface ServiceOptions {
    configuration?: Configuration;
    loggerCallback?: Function | null;
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
    constructor(opts?: ServiceOptions);
    init(): Promise<void>;
    initTasks(): Promise<void>;
    initEvents(): Promise<void>;
    initRPCs(): Promise<void>;
    initAPIRoutes(): Promise<void>;
    initAPI(): Promise<void>;
    loadEvent(handler: EventHandlerBase): Promise<void>;
    loadTask(handler: TaskHandlerBase): Promise<void>;
    loadRPC(handler: RPCHandlerBase): Promise<void>;
    loadRoute(handler: RouteHandlerBase, method: TrustedEndpoints): Promise<void>;
}
