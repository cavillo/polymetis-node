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
        // extend the redisOptions with our own retry strategy
        const redisConf = conf.redis;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVkaXNTZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0JBQXdCO0FBQ3hCLCtDQUFpQztBQUNqQywwQ0FBNEI7QUFDNUIsNkNBQStCO0FBTS9CLFlBQVk7QUFDWixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFJNUIsUUFBUTtBQUNSLE1BQXFCLGVBQWdCLFNBQVEsTUFBTSxDQUFDLFlBQVk7SUFHOUQsWUFBc0IsSUFBbUIsRUFBWSxNQUFjO1FBQ2pFLHVCQUF1QjtRQUN2QixLQUFLLEVBQUUsQ0FBQztRQUZZLFNBQUksR0FBSixJQUFJLENBQWU7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSWpFLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhCLHNEQUFzRDtRQUN0RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ2xCLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDNUMsQ0FBQyxDQUFDO1FBRUgsNkJBQTZCO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqRCxnRkFBZ0Y7UUFDaEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFdBQVcs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QUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFUyxPQUFPLENBQUMsR0FBRyxJQUFXO1FBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVTLEtBQUssQ0FBQyxHQUFHLElBQVc7UUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRVMsU0FBUyxDQUFDLEdBQUcsSUFBVztRQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFUyxHQUFHLENBQUMsSUFBUztRQUNyQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsTUFBTSxHQUFHO2dCQUNQLE9BQU8sRUFBRSxJQUFJO2FBQ2QsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FDRjtBQS9NRCxrQ0ErTUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdldmVudHMnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcmVkaXMgZnJvbSAncmVkaXMnO1xuXG4vLyBpbnRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9TZXJ2aWNlQmFzZSc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL3V0aWxzL0xvZ2dlcic7XG5cbi8vIGNvbnN0YW50c1xuY29uc3QgUkVDT05ORUNUX1RJTUUgPSAxMDAwO1xuXG5leHBvcnQgdHlwZSByZWRpc0V4cGlyZUNhbGxiYWNrID0gKHBhdHRlcm46IHN0cmluZykgPT4gdm9pZDtcblxuLy8gY2xhc3NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZGlzQ2xpZW50QmFzZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBwcm90ZWN0ZWQgcmVkaXNDbGllbnQ6IHJlZGlzLlJlZGlzQ2xpZW50O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25mOiBDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICAvLyBjYWxsIHRoZSBzdXBlciBmaXJzdFxuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBtYXggbGlzdGVuZXJzIGxpbWl0XG4gICAgdGhpcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cbiAgICAvLyBleHRlbmQgdGhlIHJlZGlzT3B0aW9ucyB3aXRoIG91ciBvd24gcmV0cnkgc3RyYXRlZ3lcbiAgICBjb25zdCByZWRpc0NvbmYgPSBjb25mLnJlZGlzO1xuICAgIF8uZXh0ZW5kKHJlZGlzQ29uZiwge1xuICAgICAgcmV0cnlTdHJhdGVneTogdGhpcy5vblJlZGlzUmV0cnkuYmluZCh0aGlzKSxcbiAgICB9KTtcblxuICAgIC8vIHNldHVwIG91ciBuZXcgcmVkaXMgY2xpZW50XG4gICAgdGhpcy5yZWRpc0NsaWVudCA9IHJlZGlzLmNyZWF0ZUNsaWVudChyZWRpc0NvbmYpO1xuXG4gICAgLy8gYmluZCBhIHRvbiBvZiBldmVudHMgdG8gdGhlIHJlZGlzIGNsaWVudCB0byBsaXN0ZW4gaW4gb24gZXZlcnl0aGluZyBoYXBwZW5pbmdcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdlcnJvcicsIHRoaXMub25FcnJvci5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdjb25uZWN0JywgdGhpcy5vbkNvbm5lY3QuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5yZWRpc0NsaWVudC5hZGRMaXN0ZW5lcigncmVjb25uZWN0aW5nJywgdGhpcy5vblJlY29ubmVjdGluZy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdyZWFkeScsIHRoaXMub25SZWFkeS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdlbmQnLCB0aGlzLm9uRW5kLmJpbmQodGhpcykpO1xuICAgIHRoaXMucmVkaXNDbGllbnQuYWRkTGlzdGVuZXIoJ3dhcm5pbmcnLCB0aGlzLm9uV2FybmluZy5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMubG9nZ2VyLm9rKCdSZWRpcyBJbml0aWFsaXplZC4uLicpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldChrZXk6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZWRpc0NsaWVudC5nZXQoa2V5LCAoZXJyb3I6IEVycm9yLCByZXBseTogYW55KSA9PiB7XG4gICAgICAgIGlmIChCb29sZWFuKGVycm9yKSkge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXR2YWwgPSBKU09OLnBhcnNlKHJlcGx5KTtcblxuICAgICAgICAgIHJlc29sdmUocmV0dmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGtleXMocGF0dGVybjogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlZGlzQ2xpZW50LmtleXMocGF0dGVybiwgKGVycm9yLCByZXBseSkgPT4ge1xuICAgICAgICBpZiAoQm9vbGVhbihlcnJvcikpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUocmVwbHkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbWdldChrZXlzOiBzdHJpbmdbXSk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKCFCb29sZWFuKGtleXMubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZWRpc0NsaWVudC5tZ2V0KGtleXMsIChlcnJvciwgcmVwbHkpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2gocmVwbHksICh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0W2tleXNbaW5kZXhdXSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5c1tpbmRleF1dID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkZWwoa2V5OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVkaXNDbGllbnQuZGVsKGtleSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChCb29sZWFuKGVycm9yKSkge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTxhbnk+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVkaXNDbGllbnQuc2V0KGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpLCAoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICAgIGlmIChCb29sZWFuKGVycm9yKSkge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2NhbiguLi5hcmdzOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgYXJncy5wdXNoKChlcnJvciwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlZGlzQ2xpZW50LnNjYW4uYXBwbHkodGhpcy5yZWRpc0NsaWVudCwgYXJncyk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2NhbkFsbChwYXR0ZXJuOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgbGV0IGZvdW5kS2V5cyA9IFtdO1xuICAgIGxldCBtYXRjaGVzID0gYXdhaXQgdGhpcy5zY2FuKCcwJywgJ21hdGNoJywgcGF0dGVybik7XG5cbiAgICB3aGlsZSAoXy5nZXQ8c3RyaW5nPihtYXRjaGVzLCAnWzBdJywgJycpICE9PSAnMCcpIHtcbiAgICAgIGZvdW5kS2V5cyA9IGZvdW5kS2V5cy5jb25jYXQoXy5nZXQobWF0Y2hlcywgJ1sxXScsIFtdKSk7XG4gICAgICBtYXRjaGVzID0gYXdhaXQgdGhpcy5zY2FuKF8uZ2V0KG1hdGNoZXMsICdbMF0nLCAnMCcpLCAnbWF0Y2gnLCBwYXR0ZXJuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmRLZXlzLmNvbmNhdChfLmdldChtYXRjaGVzLCAnWzFdJywgW10pKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRCeVBhdHRlcm4ocGF0dGVybjogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBrZXlzID0gYXdhaXQgdGhpcy5zY2FuQWxsKHBhdHRlcm4pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMubWdldChrZXlzKTtcbiAgfVxuXG4gIHB1YmxpYyBxdWl0KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucmVkaXNDbGllbnQucXVpdCgpO1xuICB9XG5cbiAgcHVibGljIGV4cGlyZShwYXR0ZXJuOiBzdHJpbmcsIHNlY29uZHM6IG51bWJlciwgY2I6IHJlZGlzRXhwaXJlQ2FsbGJhY2spOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnJlZGlzQ2xpZW50LmV4cGlyZShwYXR0ZXJuLCBzZWNvbmRzLCAobnVtKSA9PiB7XG4gICAgICBjYihwYXR0ZXJuKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdG9yYWdlS2V5KGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5jb25mLnNlcnZpY2UuZW52aXJvbm1lbnR9LiR7dGhpcy5jb25mLnNlcnZpY2Uuc2VydmljZX0uJHtrZXl9YDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblJlZGlzUmV0cnkob3B0aW9uczogT2JqZWN0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gUkVDT05ORUNUX1RJTUU7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25FcnJvciguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCdlcnJvcicpO1xuICAgIHJldHVybiB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Db25uZWN0KC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ2Nvbm5lY3RlZCcpO1xuICAgIHJldHVybiB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25SZWNvbm5lY3RpbmcoLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgIGFyZ3MudW5zaGlmdCgncmVjb25uZWN0aW5nJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblJlYWR5KC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ3JlYWR5Jyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkVuZCguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCdkaXNjb25uZWN0ZWQnKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uV2FybmluZyguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCd3YXJuaW5nJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBsb2coZGF0YTogYW55KTogdm9pZCB7XG4gICAgbGV0IHJldHZhbCA9IGRhdGE7XG4gICAgaWYgKCFfLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICByZXR2YWwgPSB7XG4gICAgICAgIG1lc3NhZ2U6IGRhdGEsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmxvZyhKU09OLnN0cmluZ2lmeShyZXR2YWwpKTtcbiAgfVxufVxuIl19