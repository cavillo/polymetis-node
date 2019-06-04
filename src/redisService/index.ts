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
  public client: redis.RedisClient;

  constructor(protected conf: Configuration, protected logger: Logger) {
    // call the super first
    super();
  }

  public async init() {
    if (
      !this.conf
      || !this.conf.redis
      || !this.conf.redis.host
      || !this.conf.redis.port
    ) {
      this.logger.warn('Redis: No parameters for initialization. Skiping...');
      return;
    }

    // extend the redisOptions with our own retry strategy
    const redisConf = this.conf.redis;
    _.extend(redisConf, {
      retryStrategy: this.onRedisRetry.bind(this),
    });

    // setup our new redis client
    this.client = redis.createClient(redisConf);

    // bind a ton of events to the redis client to listen in on everything happening
    this.client.addListener('error', this.onError.bind(this));
    this.client.addListener('connect', this.onConnect.bind(this));
    this.client.addListener('reconnecting', this.onReconnecting.bind(this));
    this.client.addListener('ready', this.onReady.bind(this));
    this.client.addListener('end', this.onEnd.bind(this));
    this.client.addListener('warning', this.onWarning.bind(this));

    this.logger.ok('Redis Initialized...');

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
    let retval = data;
    if (!_.isObject(data)) {
      retval = {
        message: data,
      };
    }

    this.logger.log(JSON.stringify(retval));
  }
}
