import Rabbit from './rabbit';
import { Logger } from './utils/logger';
import { Express } from './utils/api';
import { EventHandlerBase, TaskHandlerBase, RPCHandlerBase, RouteHandlerBase } from './handlers';
import { Configuration } from './utils/config';
export interface ServiceResources {
    configuration: Configuration;
    rabbit: Rabbit;
    logger: Logger;
}
export interface ServiceOptions {
    configuration?: Partial<Configuration>;
    loggerCallback?: Function | null;
}
export default class ServiceBase {
    configuration: Configuration;
    resources: ServiceResources;
    logger: Logger;
    apiApp: Express;
    rpcApp: Express;
    protected events: {
        [key: string]: EventHandlerBase;
    };
    protected tasks: {
        [key: string]: TaskHandlerBase;
    };
    protected routes: {
        [key: string]: RouteHandlerBase;
    };
    protected rpcs: {
        [key: string]: RPCHandlerBase;
    };
    constructor(opts?: ServiceOptions);
    init(): Promise<void>;
    initTasks(): Promise<void>;
    initEvents(): Promise<void>;
    initRPCProcedures(): Promise<void>;
    initAPIRoutes(): Promise<void>;
    startAPI(): Promise<void>;
    startRPCs(): Promise<void>;
    initAPI(): Promise<void>;
    initRPCs(): Promise<void>;
    loadEvent(handler: EventHandlerBase): Promise<void>;
    loadTask(handler: TaskHandlerBase): Promise<void>;
    loadRPC(handler: RPCHandlerBase): Promise<void>;
    loadRoute(handler: RouteHandlerBase): Promise<void>;
}
