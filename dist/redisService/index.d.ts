/// <reference types="node" />
import * as events from 'events';
import * as redis from 'redis';
import { Configuration } from '../ServiceBase';
import Logger from '../utils/Logger';
export declare type redisExpireCallback = (pattern: string) => void;
export default class RedisClientBase extends events.EventEmitter {
    protected conf: Configuration;
    protected logger: Logger;
    client: redis.RedisClient;
    constructor(conf: Configuration, logger: Logger);
    init(): Promise<void>;
    protected onRedisRetry(options: Object): number;
    protected onError(...args: any[]): any;
    protected onConnect(...args: any[]): any;
    protected onReconnecting(...args: any[]): any;
    protected onReady(...args: any[]): any;
    protected onEnd(...args: any[]): any;
    protected onWarning(...args: any[]): any;
    protected log(data: any): void;
}
