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
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.redisClient.get(key, (error, reply) => {
                    if (Boolean(error)) {
                        reject(error);
                        return;
                    }
                    try {
                        reply = JSON.parse(reply);
                        resolve(reply);
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
        if (!_.isObject(data)) {
            data = {
                message: data
            };
        }
        this.logger.log(JSON.stringify(data));
    }
}
exports.default = RedisClientBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVkaXNTZXJ2aWNlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0JBQXdCO0FBQ3hCLCtDQUFpQztBQUNqQywwQ0FBNEI7QUFDNUIsNkNBQStCO0FBTS9CLFlBQVk7QUFDWixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFJNUIsUUFBUTtBQUNSLE1BQXFCLGVBQWdCLFNBQVEsTUFBTSxDQUFDLFlBQVk7SUFHOUQsWUFBc0IsSUFBbUIsRUFBWSxNQUFjO1FBQ2pFLHVCQUF1QjtRQUN2QixLQUFLLEVBQUUsQ0FBQztRQUZZLFNBQUksR0FBSixJQUFJLENBQWU7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBSWpFLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhCLHNEQUFzRDtRQUN0RCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ2xCLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDNUMsQ0FBQyxDQUFDO1FBRUgsNkJBQTZCO1FBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqRCxnRkFBZ0Y7UUFDaEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxDQUFDLFdBQVcs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QUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRVMsT0FBTyxDQUFDLEdBQUcsSUFBVztRQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFUyxLQUFLLENBQUMsR0FBRyxJQUFXO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVTLFNBQVMsQ0FBQyxHQUFHLElBQVc7UUFDaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRVMsR0FBRyxDQUFDLElBQVM7UUFDckIsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsSUFBSSxHQUFHO2dCQUNMLE9BQU8sRUFBRSxJQUFJO2FBQ2QsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDRjtBQTlNRCxrQ0E4TUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdldmVudHMnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcmVkaXMgZnJvbSAncmVkaXMnO1xuXG4vLyBpbnRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi9TZXJ2aWNlQmFzZSc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL3V0aWxzL0xvZ2dlcic7XG5cbi8vIGNvbnN0YW50c1xuY29uc3QgUkVDT05ORUNUX1RJTUUgPSAxMDAwO1xuXG5leHBvcnQgdHlwZSByZWRpc0V4cGlyZUNhbGxiYWNrID0gKHBhdHRlcm46IHN0cmluZykgPT4gdm9pZDtcblxuLy8gY2xhc3NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZGlzQ2xpZW50QmFzZSBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xuICBwcm90ZWN0ZWQgcmVkaXNDbGllbnQ6IHJlZGlzLlJlZGlzQ2xpZW50O1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25mOiBDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICAvLyBjYWxsIHRoZSBzdXBlciBmaXJzdFxuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSBtYXggbGlzdGVuZXJzIGxpbWl0XG4gICAgdGhpcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XG5cbiAgICAvLyBleHRlbmQgdGhlIHJlZGlzT3B0aW9ucyB3aXRoIG91ciBvd24gcmV0cnkgc3RyYXRlZ3lcbiAgICBjb25zdCByZWRpc0NvbmYgPSBjb25mLnJlZGlzO1xuICAgIF8uZXh0ZW5kKHJlZGlzQ29uZiwge1xuICAgICAgcmV0cnlTdHJhdGVneTogdGhpcy5vblJlZGlzUmV0cnkuYmluZCh0aGlzKVxuICAgIH0pO1xuXG4gICAgLy8gc2V0dXAgb3VyIG5ldyByZWRpcyBjbGllbnRcbiAgICB0aGlzLnJlZGlzQ2xpZW50ID0gcmVkaXMuY3JlYXRlQ2xpZW50KHJlZGlzQ29uZik7XG5cbiAgICAvLyBiaW5kIGEgdG9uIG9mIGV2ZW50cyB0byB0aGUgcmVkaXMgY2xpZW50IHRvIGxpc3RlbiBpbiBvbiBldmVyeXRoaW5nIGhhcHBlbmluZ1xuICAgIHRoaXMucmVkaXNDbGllbnQuYWRkTGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xuICAgIHRoaXMucmVkaXNDbGllbnQuYWRkTGlzdGVuZXIoJ2Nvbm5lY3QnLCB0aGlzLm9uQ29ubmVjdC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnJlZGlzQ2xpZW50LmFkZExpc3RlbmVyKCdyZWNvbm5lY3RpbmcnLCB0aGlzLm9uUmVjb25uZWN0aW5nLmJpbmQodGhpcykpO1xuICAgIHRoaXMucmVkaXNDbGllbnQuYWRkTGlzdGVuZXIoJ3JlYWR5JywgdGhpcy5vblJlYWR5LmJpbmQodGhpcykpO1xuICAgIHRoaXMucmVkaXNDbGllbnQuYWRkTGlzdGVuZXIoJ2VuZCcsIHRoaXMub25FbmQuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5yZWRpc0NsaWVudC5hZGRMaXN0ZW5lcignd2FybmluZycsIHRoaXMub25XYXJuaW5nLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5sb2dnZXIub2soJ1JlZGlzIEluaXRpYWxpemVkLi4uJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0KGtleTogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlZGlzQ2xpZW50LmdldChrZXksIChlcnJvcjogRXJyb3IsIHJlcGx5OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlcGx5ID0gSlNPTi5wYXJzZShyZXBseSk7XG5cbiAgICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGtleXMocGF0dGVybjogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLnJlZGlzQ2xpZW50LmtleXMocGF0dGVybiwgKGVycm9yLCByZXBseSkgPT4ge1xuICAgICAgICBpZiAoQm9vbGVhbihlcnJvcikpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc29sdmUocmVwbHkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgbWdldChrZXlzOiBzdHJpbmdbXSk6IFByb21pc2U8YW55PiB7XG4gICAgaWYgKCFCb29sZWFuKGtleXMubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZWRpc0NsaWVudC5tZ2V0KGtleXMsIChlcnJvciwgcmVwbHkpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2gocmVwbHksICh2YWx1ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0W2tleXNbaW5kZXhdXSA9IEpTT04ucGFyc2UodmFsdWUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5c1tpbmRleF1dID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBkZWwoa2V5OiBzdHJpbmcpOiBQcm9taXNlPGFueT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVkaXNDbGllbnQuZGVsKGtleSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChCb29sZWFuKGVycm9yKSkge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogUHJvbWlzZTxhbnk+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMucmVkaXNDbGllbnQuc2V0KGtleSwgSlNPTi5zdHJpbmdpZnkodmFsdWUpLCAoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICAgIGlmIChCb29sZWFuKGVycm9yKSkge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2NhbiguLi5hcmdzOiBhbnlbXSk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgYXJncy5wdXNoKChlcnJvciwgcmVwbHkpID0+IHtcbiAgICAgICAgaWYgKEJvb2xlYW4oZXJyb3IpKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKHJlcGx5KTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlZGlzQ2xpZW50LnNjYW4uYXBwbHkodGhpcy5yZWRpc0NsaWVudCwgYXJncyk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2NhbkFsbChwYXR0ZXJuOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgbGV0IGZvdW5kS2V5cyA9IFtdO1xuICAgIGxldCBtYXRjaGVzID0gYXdhaXQgdGhpcy5zY2FuKCcwJywgJ21hdGNoJywgcGF0dGVybik7XG5cbiAgICB3aGlsZSAoXy5nZXQ8c3RyaW5nPihtYXRjaGVzLCAnWzBdJywgJycpICE9PSAnMCcpIHtcbiAgICAgIGZvdW5kS2V5cyA9IGZvdW5kS2V5cy5jb25jYXQoXy5nZXQobWF0Y2hlcywgJ1sxXScsIFtdKSk7XG4gICAgICBtYXRjaGVzID0gYXdhaXQgdGhpcy5zY2FuKF8uZ2V0KG1hdGNoZXMsICdbMF0nLCAnMCcpLCAnbWF0Y2gnLCBwYXR0ZXJuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmRLZXlzLmNvbmNhdChfLmdldChtYXRjaGVzLCAnWzFdJywgW10pKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBnZXRCeVBhdHRlcm4ocGF0dGVybjogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBrZXlzID0gYXdhaXQgdGhpcy5zY2FuQWxsKHBhdHRlcm4pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMubWdldChrZXlzKTtcbiAgfVxuXG4gIHB1YmxpYyBxdWl0KCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMucmVkaXNDbGllbnQucXVpdCgpO1xuICB9XG5cbiAgcHVibGljIGV4cGlyZShwYXR0ZXJuOiBzdHJpbmcsIHNlY29uZHM6IG51bWJlciwgY2I6IHJlZGlzRXhwaXJlQ2FsbGJhY2spOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnJlZGlzQ2xpZW50LmV4cGlyZShwYXR0ZXJuLCBzZWNvbmRzLCAobnVtKSA9PiB7XG4gICAgICBjYihwYXR0ZXJuKTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdG9yYWdlS2V5KGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5jb25mLnNlcnZpY2UuZW52aXJvbm1lbnR9LiR7dGhpcy5jb25mLnNlcnZpY2Uuc2VydmljZX0uJHtrZXl9YDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblJlZGlzUmV0cnkob3B0aW9uczogT2JqZWN0KTogbnVtYmVyIHtcbiAgICByZXR1cm4gUkVDT05ORUNUX1RJTUU7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25FcnJvciguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCdlcnJvcicpO1xuICAgIHJldHVybiB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25Db25uZWN0KC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ2Nvbm5lY3RlZCcpO1xuICAgIHJldHVybiB0aGlzLmVtaXQuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25SZWNvbm5lY3RpbmcoLi4uYXJnczogYW55W10pOiBhbnkge1xuICAgIGFyZ3MudW5zaGlmdCgncmVjb25uZWN0aW5nJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvblJlYWR5KC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBhcmdzLnVuc2hpZnQoJ3JlYWR5Jyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkVuZCguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCdkaXNjb25uZWN0ZWQnKTtcbiAgICByZXR1cm4gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcHJvdGVjdGVkIG9uV2FybmluZyguLi5hcmdzOiBhbnlbXSk6IGFueSB7XG4gICAgYXJncy51bnNoaWZ0KCd3YXJuaW5nJyk7XG4gICAgcmV0dXJuIHRoaXMuZW1pdC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBsb2coZGF0YTogYW55KTogdm9pZCB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICBkYXRhID0ge1xuICAgICAgICBtZXNzYWdlOiBkYXRhXG4gICAgICB9O1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLmxvZyhKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cbn1cbiJdfQ==