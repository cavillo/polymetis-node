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
        // get rid of the max listeners limit
        this.setMaxListeners(0);
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
            this.redisClient = redis.createClient(redisConf);
            // bind a ton of events to the redis client to listen in on everything happening
            this.redisClient.addListener('error', this.onError.bind(this));
            this.redisClient.addListener('connect', this.onConnect.bind(this));
            this.redisClient.addListener('reconnecting', this.onReconnecting.bind(this));
            this.redisClient.addListener('ready', this.onReady.bind(this));
            this.redisClient.addListener('end', this.onEnd.bind(this));
            this.redisClient.addListener('warning', this.onWarning.bind(this));
            this.logger.ok('Redis Initialized...');
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.redisClient.get(key, (error, reply) => {
                    if (Boolean(error)) {
                        reject(error);
                        return;
                    }
                    try {
                        const retval = JSON.parse(reply);
                        resolve(retval);
                    }
                    catch (error) {
                        resolve();
                    }
                });
            });
        });
    }
    keys(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.redisClient.keys(pattern, (error, reply) => {
                    if (Boolean(error)) {
                        reject(error);
                        return;
                    }
                    resolve(reply);
                });
            });
        });
    }
    mget(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Boolean(keys.length)) {
                return Promise.resolve({});
            }
            return new Promise((resolve, reject) => {
                this.redisClient.mget(keys, (error, reply) => {
                    const result = {};
                    if (Boolean(error)) {
                        reject(error);
                        return;
                    }
                    _.each(reply, (value, index) => {
                        try {
                            result[keys[index]] = JSON.parse(value);
                        }
                        catch (error) {
                            result[keys[index]] = value;
                        }
                    });
                    resolve(result);
                });
            });
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.redisClient.del(key, (error) => {
                    if (Boolean(error)) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.redisClient.set(key, JSON.stringify(value), (error) => {
                    if (Boolean(error)) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    scan(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                args.push((error, reply) => {
                    if (Boolean(error)) {
                        reject(error);
                        return;
                    }
                    resolve(reply);
                });
                this.redisClient.scan.apply(this.redisClient, args);
            });
        });
    }
    scanAll(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            let foundKeys = [];
            let matches = yield this.scan('0', 'match', pattern);
            while (_.get(matches, '[0]', '') !== '0') {
                foundKeys = foundKeys.concat(_.get(matches, '[1]', []));
                matches = yield this.scan(_.get(matches, '[0]', '0'), 'match', pattern);
            }
            return foundKeys.concat(_.get(matches, '[1]', []));
        });
    }
    getByPattern(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield this.scanAll(pattern);
            return yield this.mget(keys);
        });
    }
    quit() {
        return this.redisClient.quit();
    }
    expire(pattern, seconds, cb) {
        return this.redisClient.expire(pattern, seconds, (num) => {
            cb(pattern);
        });
    }
    getStorageKey(key) {
        return `${this.conf.service.environment}.${this.conf.service.service}.${key}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVkaXNTZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0JBQXdCO0FBQ3hCLCtDQUFpQztBQUNqQywwQ0FBNEI7QUFDNUIsNkNBQStCO0FBTS9CLFlBQVk7QUFDWixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFJNUIsUUFBUTtBQUNSLE1BQXFCLGVBQWdCLFNBQVEsTUFBTSxDQUFDLFlBQVk7SUFHOUQsWUFBc0IsSUFBbUIsRUFBWSxNQUFjO1FBQ2pFLHVCQUF1QjtRQUN2QixLQUFLLEVBQUUsQ0FBQztRQUZZLFNBQUksR0FBSixJQUFJLENBQWU7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSWpFLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFWSxJQUFJOztZQUNmLElBQ0UsQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDUCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSzttQkFDaEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO21CQUNyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFDeEI7Z0JBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQztnQkFDeEUsT0FBTzthQUNSO1lBRUQsc0RBQXNEO1lBQ3RELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUNsQixhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzVDLENBQUMsQ0FBQztZQUVILDZCQUE2QjtZQUM3QixJQUFJLENBQUMsV0FB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Q0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQTVORCxrQ0E0TkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdldmVudHMnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcmVkaXMgZnJvbSAncmVkaXMnO1xuXG4vLyBpbnRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9TZXJ2aWNlQmFzZSc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL3V0aWxzL0xvZ2dlcic7XG5cbi8vIGNvbnN0YW50c1xuY29uc3QgUkVDT05ORUNUX1RJTUUgPSAxMDAwO1xuXG5leHBvcnQgdHlwZSByZWRpc0V4cGlyZUNhbGxiYWNrID0gKHBhdHRlcm46IHN0cmluZykgPT4gdm9pZDtcblxuLy8gY2xhc3NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZGlzQ2xpZW50QmFzZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBwcm90ZWN0ZWQgcmVkaXNDbGllbnQ6IHJlZGlzLlJlZGlzQ2xpZW50O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25mOiBDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICAvLyBjYWxsIHRoZSBzdXBlciBmaXJzdFxuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBtYXggbGlzdGVuZXJzIGxpbWl0XG4gICAgdGhpcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBpZiAoXG4gICAgICAhdGhpcy5jb25mXG4gICAgICB8fCAhdGhpcy5jb25mLnJlZGlzXG4gICAgICB8fCAhdGhpcy5jb25mLnJlZGlzLmhvc3RcbiAgICAgIHx8ICF0aGlzLmNvbmYucmVkaXMucG9ydFxuICAgICkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignUmVkaXM6IE5vIHBhcmFtZXRlcnMgZm9yIGluaXRpYWxpemF0aW9uLiBTa2lwaW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZXh0ZW5kIHRoZSByZWRpc09wdGlvbnMgd2l0aCBvdXIgb3duIHJldHJ5IHN0cmF0ZWd5XG4gICAgY29uc3QgcmVkaXNDb25mID0gdGhpcy5jb25mLnJlZGlzO1xuICAgIF8uZXh0ZW5kKHJlZGlzQ29uZiwge1xuICAgICAgcmV0cnlTdHJhdGVneTogdGhpcy5vblJlZGlzUmV0cnkuYmluZCh0aGlzKSxcbiAgICB9KTtcblxuICAgIC8vIHNldHVwIG91ciBuZXcgcmVkaXMgY2xpZW50XG4gICAgdGhpcy5yZWRpc0NsaWVudCA9IHJlZGlzLmNyZWF0ZUNsaWVudChyZWRpc0NvbmYpO1xuXG4gICAgLy8gYmluZCBhIHRvbiBvZiBldmVudHMgdG8gdGhlIHJlZGlzIGNsaWVudCB0byBsaXN0ZW4gaW4gb24gZXZlcnl0aGluZyBoYXBwZW5pbmdcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdlcnJvcicsIHRoaXMub25FcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdjb25uZWN0JywgdGhpcy5vbkNvbm5lY3QuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5yZWRpc0NsaWVudC5hZGRMaXN0ZW5lcigncmVjb25uZWN0aW5nJywgdGhpcy5vblJlY29ubmVjdGluZy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdyZWFkeScsIHRoaXMub25SZWFkeS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdlbmQnLCB0aGlzLm9uRW5kLmJpbmQodGhpcykpO1xuICAgIHRoaXMucmVkaXNDbGllbnQuYWRkTGlzdGVuZXIoJ3dhcm5pbmcnLCB0aGlzLm9uV2FybmluZy5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMubG9nZ2VyLm9rKCdSZWRpcyBJbml0aWFsaXplZC4uLicpO1xuXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0KGtleTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlZGlzQ2xpZW50LmdldChrZXksIChlcnJvcjogRXJyb3IsIHJlcGx5OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJldHZhbCA9IEpTT04ucGFyc2UocmVwbHkpO1xuXG4gICAgICAgICAgcmVzb2x2ZShyZXR2YWwpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMga2V5cyhwYXR0ZXJuOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVkaXNDbGllbnQua2V5cyhwYXR0ZXJuLCAoZXJyb3IsIHJlcGx5KSA9PiB7XG4gICAgICAgIGlmIChCb29sZWFuKGVycm9yKSkge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZShyZXBseSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBtZ2V0KGtleXM6IHN0cmluZ1tdKTogUHJvbWlzZTxhbnk+IHtcbiAgICBpZiAoIUJvb2xlYW4oa2V5cy5sZW5ndGgpKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlZGlzQ2xpZW50Lm1nZXQoa2V5cywgKGVycm9yLCByZXBseSkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAgICAgICBpZiAoQm9vbGVhbihlcnJvcikpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZWFjaChyZXBseSwgKHZhbHVlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXN1bHRba2V5c1tpbmRleF1dID0gSlNPTi5wYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXlzW2luZGV4XV0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlbChrZXk6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZWRpc0NsaWVudC5kZWwoa2V5LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBQcm9taXNlPGFueT4ge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZWRpc0NsaWVudC5zZXQoa2V5LCBKU09OLnN0cmluZ2lmeSh2YWx1ZSksIChlcnJvcjogRXJyb3IpID0+IHtcbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzY2FuKC4uLmFyZ3M6IGFueVtdKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBhcmdzLnB1c2goKGVycm9yLCByZXBseSkgPT4ge1xuICAgICAgICBpZiAoQm9vbGVhbihlcnJvcikpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUocmVwbHkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVkaXNDbGllbnQuc2Nhbi5hcHBseSh0aGlzLnJlZGlzQ2xpZW50LCBhcmdzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzY2FuQWxsKHBhdHRlcm46IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBsZXQgZm91bmRLZXlzID0gW107XG4gICAgbGV0IG1hdGNoZXMgPSBhd2FpdCB0aGlzLnNjYW4oJzAnLCAnbWF0Y2gnLCBwYXR0ZXJuKTtcblxuICAgIHdoaWxlIChfLmdldDxzdHJpbmc+KG1hdGNoZXMsICdbMF0nLCAnJykgIT09ICcwJykge1xuICAgICAgZm91bmRLZXlzID0gZm91bmRLZXlzLmNvbmNhdChfLmdldChtYXRjaGVzLCAnWzFdJywgW10pKTtcbiAgICAgIG1hdGNoZXMgPSBhd2FpdCB0aGlzLnNjYW4oXy5nZXQobWF0Y2hlcywgJ1swXScsICcwJyksICdtYXRjaCcsIHBhdHRlcm4pO1xuICAgIH1cblxuICAgIHJldHVybiBmb3VuZEtleXMuY29uY2F0KF8uZ2V0KG1hdGNoZXMsICdbMV0nLCBbXSkpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldEJ5UGF0dGVybihwYXR0ZXJuOiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IGtleXMgPSBhd2FpdCB0aGlzLnNjYW5BbGwocGF0dGVybik7XG5cbiAgICByZXR1cm4gYXdhaXQgdGhpcy5tZ2V0KGtleXMpO1xuICB9XG5cbiAgcHVibGljIHF1aXQoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5yZWRpc0NsaWVudC5xdWl0KCk7XG4gIH1cblxuICBwdWJsaWMgZXhwaXJlKHBhdHRlcm46IHN0cmluZywgc2Vjb25kczogbnVtYmVyLCBjYjogcmVkaXNFeHBpcmVDYWxsYmFjayk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucmVkaXNDbGllbnQuZXhwaXJlKHBhdHRlcm4sIHNlY29uZHMsIChudW0pID0+IHtcbiAgICAgIGNiKHBhdHRlcm4pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldFN0b3JhZ2VLZXkoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLmNvbmYuc2VydmljZS5lbnZpcm9ubWVudH0uJHt0aGlzLmNvbmYuc2VydmljZS5zZXJ2aWNlfS4ke2tleX1gO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uUmVkaXNSZXRyeShvcHRpb25zOiBPYmplY3QpOiBudW1iZXIge1xuICAgIHJldHVybiBSRUNPTk5FQ1RfVElNRTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkVycm9yKC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ2Vycm9yJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkNvbm5lY3QoLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgIGFyZ3MudW5zaGlmdCgnY29ubmVjdGVkJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblJlY29ubmVjdGluZyguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCdyZWNvbm5lY3RpbmcnKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uUmVhZHkoLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgIGFyZ3MudW5zaGlmdCgncmVhZHknKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uRW5kKC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ2Rpc2Nvbm5lY3RlZCcpO1xuICAgIHJldHVybiB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25XYXJuaW5nKC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ3dhcm5pbmcnKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGxvZyhkYXRhOiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgcmV0dmFsID0gZGF0YTtcbiAgICBpZiAoIV8uaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgIHJldHZhbCA9IHtcbiAgICAgICAgbWVzc2FnZTogZGF0YSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIubG9nKEpTT04uc3RyaW5naWZ5KHJldHZhbCkpO1xuICB9XG59XG4iXX0=