// external dependencies
import * as events from 'events';
import * as _ from 'lodash';
import * as redis from 'redis';

// internal dependencies
import { Configuration } from '../ServiceBase';
import Logger from '../utils/Logger';

// constants
const RECONNECT_TIME = 1000;

export type redisExpireCallback = (pattern: string) => void;

// class
export default class RedisClientBase extends events.EventEmitter {
  protected redisClient: redis.RedisClient;

  constructor(protected conf: Configuration, protected logger: Logger) {
    // call the super first
    super();

    // get rid of the max listeners limit
    this.setMaxListeners(0);

    // extend the redisOptions with our own retry strategy
    const redisConf = conf.redis;
    _.extend(redisConf, {
      retryStrategy: this.onRedisRetry.bind(this)
    });

    // setup our new redis client
    this.redisClient = redis.createClient(redisConf);

    // bind a ton of events to the redis client to listen in on everything happening
    this.redisClient.addListener('error', this.onError.bind(this));
    this.redisClient.addListener('connect', this.onConnect.bind(this));
    this.redisClient.addListener('reconnecting', this.onReconnecting.bind(this));
    this.redisClient.addListener('ready', this.onReady.bind(this));
    this.redisClient.addListener('end', this.onEnd.bind(this));
    this.redisClient.addListener('warning', this.onWarning.bind(this));

    this.logger.ok('Redis Initialized...');
  }

  public async get(key: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.redisClient.get(key, (error: Error, reply: any) => {
        if (Boolean(error)) {
          reject(error);
          return;
        }

        try {
          reply = JSON.parse(reply);

          resolve(reply);
        } catch (error) {
          resolve();
        }
      });
    });
  }

  public async keys(pattern: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.redisClient.keys(pattern, (error, reply) => {
        if (Boolean(error)) {
          reject(error);
          return;
        }

        resolve(reply);
      });
    });
  }

  public async mget(keys: string[]): Promise<any> {
    if (!Boolean(keys.length)) {
      return Promise.resolve({});
    }

    return new Promise<any>((resolve, reject) => {
      this.redisClient.mget(keys, (error, reply) => {
        const result = {};

        if (Boolean(error)) {
          reject(error);
          return;
        }

        _.each(reply, (value, index) => {
          try {
            result[keys[index]] = JSON.parse(value);
          } catch (error) {
            result[keys[index]] = value;
          }
        });

        resolve(result);
      });
    });
  }

  public async del(key: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.redisClient.del(key, (error) => {
        if (Boolean(error)) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  public async set(key: string, value: any): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      this.redisClient.set(key, JSON.stringify(value), (error: Error) => {
        if (Boolean(error)) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  public async scan(...args: any[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      args.push((error, reply) => {
        if (Boolean(error)) {
          reject(error);
          return;
        }

        resolve(reply);
      });

      this.redisClient.scan.apply(this.redisClient, args);
    });
  }

  public async scanAll(pattern: string): Promise<string[]> {
    let foundKeys = [];
    let matches = await this.scan('0', 'match', pattern);

    while (_.get<string>(matches, '[0]', '') !== '0') {
      foundKeys = foundKeys.concat(_.get(matches, '[1]', []));
      matches = await this.scan(_.get(matches, '[0]', '0'), 'match', pattern);
    }

    return foundKeys.concat(_.get(matches, '[1]', []));
  }

  public async getByPattern(pattern: string): Promise<any> {
    const keys = await this.scanAll(pattern);

    return await this.mget(keys);
  }

  public quit(): any {
    return this.redisClient.quit();
  }

  public expire(pattern: string, seconds: number, cb: redisExpireCallback): any {
    return this.redisClient.expire(pattern, seconds, (num) => {
      cb(pattern);
    });
  }

  public getStorageKey(key: string): string {
    return `${this.conf.service.environment}.${this.conf.service.service}.${key}`;
  }

  protected onRedisRetry(options: Object): number {
    return RECONNECT_TIME;
  }

  protected onError(...args: any[]): any {
    args.unshift('error');
    return this.emit.apply(this, args);
  }

  protected onConnect(...args: any[]): any {
    args.unshift('connected');
    return this.emit.apply(this, args);
  }

  protected onReconnecting(...args: any[]): any {
    args.unshift('reconnecting');
    return this.emit.apply(this, args);
  }

  protected onReady(...args: any[]): any {
    args.unshift('ready');
    return this.emit.apply(this, args);
  }

  protected onEnd(...args: any[]): any {
    args.unshift('disconnected');
    return this.emit.apply(this, args);
  }

  protected onWarning(...args: any[]): any {
    args.unshift('warning');
    return this.emit.apply(this, args);
  }

  protected log(data: any): void {
    if (!_.isObject(data)) {
      data = {
        message: data
      };
    }

    this.logger.log(JSON.stringify(data));
  }
}
