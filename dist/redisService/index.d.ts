/// <reference types="node" />
import * as events from 'events';
import * as redis from 'redis';
import { Configuration } from '../ServiceBase';
import Logger from '../utils/Logger';
export declare type redisExpireCallback = (pattern: string) => void;
export default class RedisClientBase extends events.EventEmitter {
    protected conf: Configuration;
    protected logger: Logger;
    protected redisClient: redis.RedisClient;
    constructor(conf: Configuration, logger: Logger);
    init(): Promise<void>;
    get(key: string): Promise<any>;
    keys(pattern: string): Promise<any>;
    mget(keys: string[]): Promise<any>;
    del(key: string): Promise<any>;
    set(key: string, value: any): Promise<any>;
    scan(...args: any[]): Promise<any>;
    scanAll(pattern: string): Promise<string[]>;
    getByPattern(pattern: string): Promise<any>;
    quit(): any;
    expire(pattern: string, seconds: number, cb: redisExpireCallback): any;
    getStorageKey(key: string): string;
    protected onRedisRetry(options: Object): number;
    protected onError(...args: any[]): any;
    protected onConnect(...args: any[]): any;
    protected onReconnecting(...args: any[]): any;
    protected onReady(...args: any[]): any;
    protected onEnd(...args: any[]): any;
    protected onWarning(...args: any[]): any;
    protected log(data: any): void;
}
