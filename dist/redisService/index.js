"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// external dependencies
const events = __importStar(require("events"));
const _ = __importStar(require("lodash"));
const redis = __importStar(require("redis"));
// constants
const RECONNECT_TIME = 1000;
// class
class RedisClientBase extends events.EventEmitter {
    constructor(conf, logger) {
        // call the super first
        super();
        this.conf = conf;
        this.logger = logger;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conf
                || !this.conf.redis
                || !this.conf.redis.host
                || !this.conf.redis.port) {
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
        });
    }
    onRedisRetry(options) {
        return RECONNECT_TIME;
    }
    onError(...args) {
        args.unshift('error');
        return this.emit.apply(this, args);
    }
    onConnect(...args) {
        args.unshift('connected');
        return this.emit.apply(this, args);
    }
    onReconnecting(...args) {
        args.unshift('reconnecting');
        return this.emit.apply(this, args);
    }
    onReady(...args) {
        args.unshift('ready');
        return this.emit.apply(this, args);
    }
    onEnd(...args) {
        args.unshift('disconnected');
        return this.emit.apply(this, args);
    }
    onWarning(...args) {
        args.unshift('warning');
        return this.emit.apply(this, args);
    }
    log(data) {
        let retval = data;
        if (!_.isObject(data)) {
            retval = {
                message: data,
            };
        }
        this.logger.log(JSON.stringify(retval));
    }
}
exports.default = RedisClientBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVkaXNTZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0JBQXdCO0FBQ3hCLCtDQUFpQztBQUNqQywwQ0FBNEI7QUFDNUIsNkNBQStCO0FBTS9CLFlBQVk7QUFDWixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFJNUIsUUFBUTtBQUNSLE1BQXFCLGVBQWdCLFNBQVEsTUFBTSxDQUFDLFlBQVk7SUFHOUQsWUFBc0IsSUFBbUIsRUFBWSxNQUFjO1FBQ2pFLHVCQUF1QjtRQUN2QixLQUFLLEVBQUUsQ0FBQztRQUZZLFNBQUksR0FBSixJQUFJLENBQWU7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBR25FLENBQUM7SUFFWSxJQUFJOztZQUNmLElBQ0UsQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDUCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSzttQkFDaEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO21CQUNyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFDeEI7Z0JBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQztnQkFDeEUsT0FBTzthQUNSO1lBRUQsc0RBQXNEO1lBQ3RELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUNsQixhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzVDLENBQUMsQ0FBQztZQUVILDZCQUE2QjtZQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFNUMsZ0ZBQWdG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O0FBcEZELGtDQW9GQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGV4dGVybmFsIGRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyByZWRpcyBmcm9tICdyZWRpcyc7XG5cbi8vIGludGVybmFsIGRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL1NlcnZpY2VCYXNlJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRpbHMvTG9nZ2VyJztcblxuLy8gY29uc3RhbnRzXG5jb25zdCBSRUNPTk5FQ1RfVElNRSA9IDEwMDA7XG5cbmV4cG9ydCB0eXBlIHJlZGlzRXhwaXJlQ2FsbGJhY2sgPSAocGF0dGVybjogc3RyaW5nKSA9PiB2b2lkO1xuXG4vLyBjbGFzc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVkaXNDbGllbnRCYXNlIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIHB1YmxpYyBjbGllbnQ6IHJlZGlzLlJlZGlzQ2xpZW50O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25mOiBDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICAvLyBjYWxsIHRoZSBzdXBlciBmaXJzdFxuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5jb25mXG4gICAgICB8fCAhdGhpcy5jb25mLnJlZGlzXG4gICAgICB8fCAhdGhpcy5jb25mLnJlZGlzLmhvc3RcbiAgICAgIHx8ICF0aGlzLmNvbmYucmVkaXMucG9ydFxuICAgICkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignUmVkaXM6IE5vIHBhcmFtZXRlcnMgZm9yIGluaXRpYWxpemF0aW9uLiBTa2lwaW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZXh0ZW5kIHRoZSByZWRpc09wdGlvbnMgd2l0aCBvdXIgb3duIHJldHJ5IHN0cmF0ZWd5XG4gICAgY29uc3QgcmVkaXNDb25mID0gdGhpcy5jb25mLnJlZGlzO1xuICAgIF8uZXh0ZW5kKHJlZGlzQ29uZiwge1xuICAgICAgcmV0cnlTdHJhdGVneTogdGhpcy5vblJlZGlzUmV0cnkuYmluZCh0aGlzKSxcbiAgICB9KTtcblxuICAgIC8vIHNldHVwIG91ciBuZXcgcmVkaXMgY2xpZW50XG4gICAgdGhpcy5jbGllbnQgPSByZWRpcy5jcmVhdGVDbGllbnQocmVkaXNDb25mKTtcblxuICAgIC8vIGJpbmQgYSB0b24gb2YgZXZlbnRzIHRvIHRoZSByZWRpcyBjbGllbnQgdG8gbGlzdGVuIGluIG9uIGV2ZXJ5dGhpbmcgaGFwcGVuaW5nXG4gICAgdGhpcy5jbGllbnQuYWRkTGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2xpZW50LmFkZExpc3RlbmVyKCdjb25uZWN0JywgdGhpcy5vbkNvbm5lY3QuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jbGllbnQuYWRkTGlzdGVuZXIoJ3JlY29ubmVjdGluZycsIHRoaXMub25SZWNvbm5lY3RpbmcuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jbGllbnQuYWRkTGlzdGVuZXIoJ3JlYWR5JywgdGhpcy5vblJlYWR5LmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2xpZW50LmFkZExpc3RlbmVyKCdlbmQnLCB0aGlzLm9uRW5kLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2xpZW50LmFkZExpc3RlbmVyKCd3YXJuaW5nJywgdGhpcy5vbldhcm5pbmcuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmxvZ2dlci5vaygnUmVkaXMgSW5pdGlhbGl6ZWQuLi4nKTtcblxuICB9XG5cbiAgcHJvdGVjdGVkIG9uUmVkaXNSZXRyeShvcHRpb25zOiBPYmplY3QpOiBudW1iZXIge1xuICAgIHJldHVybiBSRUNPTk5FQ1RfVElNRTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkVycm9yKC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ2Vycm9yJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNvbm5lY3QoLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgIGFyZ3MudW5zaGlmdCgnY29ubmVjdGVkJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblJlY29ubmVjdGluZyguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCdyZWNvbm5lY3RpbmcnKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uUmVhZHkoLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgIGFyZ3MudW5zaGlmdCgncmVhZHknKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uRW5kKC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ2Rpc2Nvbm5lY3RlZCcpO1xuICAgIHJldHVybiB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25XYXJuaW5nKC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ3dhcm5pbmcnKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGxvZyhkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgcmV0dmFsID0gZGF0YTtcbiAgICBpZiAoIV8uaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHJldHZhbCA9IHtcbiAgICAgICAgbWVzc2FnZTogZGF0YSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIubG9nKEpTT04uc3RyaW5naWZ5KHJldHZhbCkpO1xuICB9XG59XG4iXX0=