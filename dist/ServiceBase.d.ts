import { Express, Request, Response } from 'express';
import { Configuration } from './utils/ServiceConf';
import Rabbit from './rabbit/Rabbit';
import Mongo from './mongo/Mongo';
import Postgres from './postgres';
import Logger from './utils/Logger';
import Redis from './redisService';
export interface ServiceResources {
    configuration: Configuration;
    rabbit: Rabbit;
    logger: Logger;
    mongo: Mongo;
    redis: Redis;
    pg: Postgres;
}
export default class ServiceBase {
    logger: Logger;
    protected resources: ServiceResources;
    protected app: Express;
    protected events: any;
    protected tasks: any;
    protected routes: any;
    constructor(conf?: Configuration | any);
    init(): Promise<void>;
    private loadEvents;
    private loadTasks;
    private loadRoutes;
    private logApiRoute;
}
export { Configuration, Response, Request, Logger, };
