"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
const _ = __importStar(require("lodash"));
const timers_1 = require("timers");
class RabbitService {
    constructor(conf, logger) {
        this.conf = conf;
        this.logger = logger;
        this.RPC_TIMEOUT = 5000;
        const username = conf.username;
        const password = conf.password;
        const host = conf.host;
        const port = conf.port;
        this.exchangeName = conf.exchange;
        this.url = `amqp://${username}:${password}@${host}:${port}`;
    }
    isConnected() {
        return Boolean(this.connection);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conf
                || !this.conf.host
                || !this.conf.port
                || !this.conf.username
                || !this.conf.password
                || !this.conf.exchange
                || !this.conf.queue) {
                this.logger.warn('RabbitMQ: No parameters for initialization. Skiping...');
                return;
            }
            const channel = yield this.connect();
            if (!channel)
                throw new Error('Rabbit failed');
            this.logger.info('Rabbit connection initialized...');
        });
    }
    getChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.connect();
        });
    }
    on(routingKey, callback, queueName = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!_.isFunction(callback)) {
                return;
            }
            const channel = yield this.connect();
            if (!channel)
                return;
            const q = yield channel.assertQueue(queueName);
            yield channel.assertExchange(this.exchangeName, 'topic', { durable: false });
            yield channel.bindQueue(q.queue, this.exchangeName, routingKey);
            yield channel.prefetch(1);
            return channel.consume(q.queue, this.callback.bind(this, channel, callback));
        });
    }
    emit(routingKey, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.connect();
            if (!channel)
                return;
            yield channel.assertExchange(this.exchangeName, 'topic', { durable: false });
            yield channel.publish(this.exchangeName, routingKey, Buffer.from(JSON.stringify(data)));
        });
    }
    /*
      RPC
    */
    callProcedure(procName, data, timeout = this.RPC_TIMEOUT) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const correlationId = this.generateUuid();
                const channel = yield this.connect();
                if (!channel) {
                    const payload = {
                        transactionId: correlationId,
                        error: 'RabbitMQ Connection error',
                        status: 'error',
                    };
                    return reject(payload);
                }
                yield channel.assertExchange(this.exchangeName, 'topic', { durable: false });
                const q = yield channel.assertQueue(`${correlationId}.${procName}`, { exclusive: true });
                const timeoutId = setTimeout(() => {
                    this.logger.error('RPC timeout...');
                    const payload = {
                        transactionId: correlationId,
                        error: 'RPC Timeout',
                        status: 'timeout',
                    };
                    return reject(payload);
                }, timeout);
                yield channel.consume(q.queue, (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        timers_1.clearTimeout(timeoutId);
                        try {
                            const content = JSON.parse(msg.content.toString());
                            const payload = {
                                transactionId: correlationId,
                                error: _.get(content, 'error', null),
                                status: _.get(content, 'result', null) === 'error' ? 'error' : 'ok',
                                data: _.get(content, 'data', null),
                            };
                            return resolve(payload);
                        }
                        catch (error) {
                            const payload = {
                                transactionId: correlationId,
                                status: 'timeout',
                                error: _.toString(error),
                            };
                            return reject(payload);
                        }
                    }
                }, { noAck: true });
                yield channel.sendToQueue(`rpc_queue.${procName}`, Buffer.from(JSON.stringify(data)), {
                    correlationId,
                    replyTo: q.queue,
                });
            }));
        });
    }
    /*
      RPC
    */
    registerProcedure(procName, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!_.isFunction(callback)) {
                return;
            }
            const channel = yield this.connect();
            if (!channel)
                return;
            const queueName = `rpc_queue.${procName}`;
            const q = yield channel.assertQueue(queueName, { durable: false });
            yield channel.assertExchange(this.exchangeName, 'topic', { durable: false });
            yield channel.bindQueue(q.queue, this.exchangeName, procName);
            yield channel.prefetch(1);
            return channel.consume(q.queue, this.rpcCallback.bind(this, channel, callback));
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connection) {
                this.connection = yield amqplib_1.default.connect(this.url);
            }
            if (!this.channel) {
                this.channel = yield this.connection.createChannel();
            }
            return this.channel;
        });
    }
    /*
      RPC
    */
    rpcCallback(channel, callback, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const retval = {};
            message.content = JSON.parse(message.content.toString());
            try {
                _.set(retval, 'data', yield callback(message));
            }
            catch (error) {
                this.logger.error('Error in rpcCallback', error);
                _.set(retval, 'error', error);
            }
            channel.sendToQueue(message.properties.replyTo, Buffer.from(JSON.stringify(retval)), {
                correlationId: message.properties.correlationId,
            });
            channel.ack(message);
        });
    }
    callback(channel, callback, message) {
        message.content = JSON.parse(message.content.toString());
        callback(message);
        channel.ack(message);
    }
    generateUuid() {
        return Math.random().toString() +
            Math.random().toString() +
            Math.random().toString();
    }
}
exports.default = RabbitService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmFiYml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLDBDQUE0QjtBQUc1QixtQ0FBc0M7QUFTdEMsTUFBcUIsYUFBYTtJQU9oQyxZQUFzQixJQUF5QixFQUFZLE1BQWM7UUFBbkQsU0FBSSxHQUFKLElBQUksQ0FBcUI7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBTmpFLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBT3pCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxRQUFRLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVZLElBQUk7O1lBQ2YsSUFDSyxDQUFDLElBQUksQ0FBQyxJQUFJO21CQUNWLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO21CQUNmLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO21CQUNmLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRO21CQUNuQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTttQkFDbkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVE7bUJBQ25CLENBQUMsSUFBSSxDQUFD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QU8sS0FBSyxFQUFFO2dCQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDL0I7WUFFRCxPQUFPLENBQUMsV0FBVyxDQUNqQixPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7Z0JBQ25DLGFBQWEsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWE7YUFDaEQsQ0FBQyxDQUFDO1lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixDQUFDO0tBQUE7SUFFTyxRQUFRLENBQUMsT0FBd0IsRUFBRSxRQUFrQixFQUFFLE9BQVk7UUFDekUsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN6RCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRU8sWUFBWTtRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBNU1ELGdDQTRNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhbXFwbGliIGZyb20gJ2FtcXBsaWInO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUmFiYml0Q29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRpbHMvTG9nZ2VyJztcbmltcG9ydCB7IGNsZWFyVGltZW91dCB9IGZyb20gJ3RpbWVycyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUlBDUmVzcG9uc2VQYXlsb2FkIHtcbiAgdHJhbnNhY3Rpb25JZDogc3RyaW5nO1xuICBkYXRhPzogYW55IHwgbnVsbDtcbiAgZXJyb3I/OiBzdHJpbmcgfCBudWxsO1xuICBzdGF0dXM6ICdvaycgfCAnZXJyb3InIHwgJ3RpbWVvdXQnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWJiaXRTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBSUENfVElNRU9VVCA9IDUwMDA7XG4gIHByaXZhdGUgY29ubmVjdGlvbj86IGFtcXBsaWIuQ29ubmVjdGlvbjtcbiAgcHJpdmF0ZSBjaGFubmVsPzogYW1xcGxpYi5DaGFubmVsO1xuICBwcml2YXRlIHVybDogc3RyaW5nO1xuICBwcml2YXRlIGV4Y2hhbmdlTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25mOiBSYWJiaXRDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGNvbmYudXNlcm5hbWU7XG4gICAgY29uc3QgcGFzc3dvcmQgPSBjb25mLnBhc3N3b3JkO1xuICAgIGNvbnN0IGhvc3QgPSBjb25mLmhvc3Q7XG4gICAgY29uc3QgcG9ydCA9IGNvbmYucG9ydDtcblxuICAgIHRoaXMuZXhjaGFuZ2VOYW1lID0gY29uZi5leGNoYW5nZTtcbiAgICB0aGlzLnVybCA9IGBhbXFwOi8vJHt1c2VybmFtZX06JHtwYXNzd29yZH1AJHtob3N0fToke3BvcnR9YDtcbiAgfVxuXG4gIHB1YmxpYyBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmNvbm5lY3Rpb24pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgaWYgKFxuICAgICAgICAgIXRoaXMuY29uZlxuICAgICAgfHwgIXRoaXMuY29uZi5ob3N0XG4gICAgICB8fCAhdGhpcy5jb25mLnBvcnRcbiAgICAgIHx8ICF0aGlzLmNvbmYudXNlcm5hbWVcbiAgICAgIHx8ICF0aGlzLmNvbmYucGFzc3dvcmRcbiAgICAgIHx8ICF0aGlzLmNvbmYuZXhjaGFuZ2VcbiAgICAgIHx8ICF0aGlzLmNvbmYucXVldWVcbiAgICApIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1JhYmJpdE1ROiBObyBwYXJhbWV0ZXJzIGZvciBpbml0aWFsaXphdGlvbi4gU2tpcGluZy4uLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gICAgaWYgKCFjaGFubmVsKSB0aHJvdyBuZXcgRXJyb3IoJ1JhYmJpdCBmYWlsZWQnKTtcblxuICAgIHRoaXMubG9nZ2VyLmluZm8oJ1JhYmJpdCBjb25uZWN0aW9uIGluaXRpYWxpemVkLi4uJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhbm5lbCgpOiBQcm9taXNlPGFtcXBsaWIuQ2hhbm5lbD4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBvbihyb3V0aW5nS2V5OiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIHF1ZXVlTmFtZTogc3RyaW5nID0gJycpIHtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKHF1ZXVlTmFtZSk7XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmJpbmRRdWV1ZShxLnF1ZXVlLCB0aGlzLmV4Y2hhbmdlTmFtZSwgcm91dGluZ0tleSk7XG4gICAgYXdhaXQgY2hhbm5lbC5wcmVmZXRjaCgxKTtcblxuICAgIHJldHVybiBjaGFubmVsLmNvbnN1bWUocS5xdWV1ZSwgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrKSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZW1pdChyb3V0aW5nS2V5OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICBhd2FpdCBjaGFubmVsLmFzc2VydEV4Y2hhbmdlKHRoaXMuZXhjaGFuZ2VOYW1lLCAndG9waWMnLCB7IGR1cmFibGU6IGZhbHNlIH0pO1xuXG4gICAgYXdhaXQgY2hhbm5lbC5wdWJsaXNoKHRoaXMuZXhjaGFuZ2VOYW1lLCByb3V0aW5nS2V5LCBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShkYXRhKSkpO1xuICB9XG5cbiAgLypcbiAgICBSUENcbiAgKi9cbiAgcHVibGljIGFzeW5jIGNhbGxQcm9jZWR1cmUocHJvY05hbWU6IHN0cmluZywgZGF0YTogYW55LCB0aW1lb3V0OiBudW1iZXIgPSB0aGlzLlJQQ19USU1FT1VUKTogUHJvbWlzZTxSUENSZXNwb25zZVBheWxvYWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY29ycmVsYXRpb25JZCA9IHRoaXMuZ2VuZXJhdGVVdWlkKCk7XG5cbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgICBjb25zdCBwYXlsb2FkOiBSUENSZXNwb25zZVBheWxvYWQgPSB7XG4gICAgICAgICAgdHJhbnNhY3Rpb25JZDogY29ycmVsYXRpb25JZCxcbiAgICAgICAgICBlcnJvcjogJ1JhYmJpdE1RIENvbm5lY3Rpb24gZXJyb3InLFxuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVqZWN0KHBheWxvYWQpO1xuICAgICAgfVxuICAgICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcblxuICAgICAgY29uc3QgcSA9IGF3YWl0IGNoYW5uZWwuYXNzZXJ0UXVldWUoYCR7Y29ycmVsYXRpb25JZH0uJHtwcm9jTmFtZX1gLCB7IGV4Y2x1c2l2ZTogdHJ1ZSB9KTtcblxuICAgICAgY29uc3QgdGltZW91dElkID0gc2V0VGltZW91dChcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdSUEMgdGltZW91dC4uLicpO1xuICAgICAgICAgIGNvbnN0IHBheWxvYWQ6IFJQQ1Jlc3BvbnNlUGF5bG9hZCA9IHtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uSWQ6IGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgICBlcnJvcjogJ1JQQyBUaW1lb3V0JyxcbiAgICAgICAgICAgIHN0YXR1czogJ3RpbWVvdXQnLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gcmVqZWN0KHBheWxvYWQpO1xuICAgICAgICB9LFxuICAgICAgICB0aW1lb3V0LFxuICAgICAgKTtcblxuICAgICAgYXdhaXQgY2hhbm5lbC5jb25zdW1lKFxuICAgICAgICBxLnF1ZXVlLFxuICAgICAgICAobXNnOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAobXNnLnByb3BlcnRpZXMuY29ycmVsYXRpb25JZCA9PT0gY29ycmVsYXRpb25JZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnBhcnNlKG1zZy5jb250ZW50LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICAgIGNvbnN0IHBheWxvYWQ6IFJQQ1Jlc3BvbnNlUGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbklkOiBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgICAgICAgIGVycm9yOiBfLmdldChjb250ZW50LCAnZXJyb3InLCBudWxsKSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IF8uZ2V0KGNvbnRlbnQsICdyZXN1bHQnLCBudWxsKSA9PT0gJ2Vycm9yJyA/ICdlcnJvcicgOiAnb2snLFxuICAgICAgICAgICAgICAgIGRhdGE6IF8uZ2V0KGNvbnRlbnQsICdkYXRhJywgbnVsbCksXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zdCBwYXlsb2FkOiBSUENSZXNwb25zZVBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25JZDogY29ycmVsYXRpb25JZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICd0aW1lb3V0JyxcbiAgICAgICAgICAgICAgICBlcnJvcjogXy50b1N0cmluZyhlcnJvciksXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHsgbm9BY2s6IHRydWUgfSxcbiAgICAgICk7XG5cbiAgICAgIGF3YWl0IGNoYW5uZWwuc2VuZFRvUXVldWUoXG4gICAgICAgIGBycGNfcXVldWUuJHtwcm9jTmFtZX1gLFxuICAgICAgICBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShkYXRhKSksXG4gICAgICAgIHtcbiAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgIHJlcGx5VG86IHEucXVldWUsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLypcbiAgICBSUENcbiAgKi9cbiAgcHVibGljIGFzeW5jIHJlZ2lzdGVyUHJvY2VkdXJlKHByb2NOYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpIHtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHF1ZXVlTmFtZSA9IGBycGNfcXVldWUuJHtwcm9jTmFtZX1gO1xuICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKHF1ZXVlTmFtZSwgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmFzc2VydEV4Y2hhbmdlKHRoaXMuZXhjaGFuZ2VOYW1lLCAndG9waWMnLCB7IGR1cmFibGU6IGZhbHNlIH0pO1xuICAgIGF3YWl0IGNoYW5uZWwuYmluZFF1ZXVlKHEucXVldWUsIHRoaXMuZXhjaGFuZ2VOYW1lLCBwcm9jTmFtZSk7XG4gICAgYXdhaXQgY2hhbm5lbC5wcmVmZXRjaCgxKTtcblxuICAgIHJldHVybiBjaGFubmVsLmNvbnN1bWUocS5xdWV1ZSwgdGhpcy5ycGNDYWxsYmFjay5iaW5kKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxhbXFwbGliLkNoYW5uZWw+IHtcbiAgICBpZiAoIXRoaXMuY29ubmVjdGlvbikge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgYW1xcGxpYi5jb25uZWN0KHRoaXMudXJsKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNoYW5uZWwpIHtcbiAgICAgIHRoaXMuY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jcmVhdGVDaGFubmVsKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbDtcbiAgfVxuXG4gIC8qXG4gICAgUlBDXG4gICovXG4gIHByaXZhdGUgYXN5bmMgcnBjQ2FsbGJhY2soY2hhbm5lbDogYW1xcGxpYi5DaGFubmVsLCBjYWxsYmFjazogRnVuY3Rpb24sIG1lc3NhZ2U6IGFueSkge1xuICAgIGNvbnN0IHJldHZhbCA9IHt9O1xuICAgIG1lc3NhZ2UuY29udGVudCA9IEpTT04ucGFyc2UobWVzc2FnZS5jb250ZW50LnRvU3RyaW5nKCkpO1xuICAgIHRyeSB7XG4gICAgICBfLnNldChyZXR2YWwsICdkYXRhJywgYXdhaXQgY2FsbGJhY2sobWVzc2FnZSkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcignRXJyb3IgaW4gcnBjQ2FsbGJhY2snLCBlcnJvcik7XG4gICAgICBfLnNldChyZXR2YWwsICdlcnJvcicsIGVycm9yKTtcbiAgICB9XG5cbiAgICBjaGFubmVsLnNlbmRUb1F1ZXVlKFxuICAgICAgbWVzc2FnZS5wcm9wZXJ0aWVzLnJlcGx5VG8sXG4gICAgICBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShyZXR2YWwpKSwge1xuICAgICAgICBjb3JyZWxhdGlvbklkOiBtZXNzYWdlLnByb3BlcnRpZXMuY29ycmVsYXRpb25JZCxcbiAgICAgIH0pO1xuICAgIGNoYW5uZWwuYWNrKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsYmFjayhjaGFubmVsOiBhbXFwbGliLkNoYW5uZWwsIGNhbGxiYWNrOiBGdW5jdGlvbiwgbWVzc2FnZTogYW55KSB7XG4gICAgbWVzc2FnZS5jb250ZW50ID0gSlNPTi5wYXJzZShtZXNzYWdlLmNvbnRlbnQudG9TdHJpbmcoKSk7XG4gICAgY2FsbGJhY2sobWVzc2FnZSk7XG4gICAgY2hhbm5lbC5hY2sobWVzc2FnZSk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlVXVpZCgpIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygpICtcbiAgICAgIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSArXG4gICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiJdfQ==