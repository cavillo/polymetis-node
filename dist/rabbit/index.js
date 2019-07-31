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
        this.queueName = conf.exchange;
        this.exchangeName = conf.exchange;
        this.queueName = conf.queue || '';
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
            const q = yield channel.assertQueue(queueName, { exclusive: true });
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
                const channel = yield this.connect();
                if (!channel)
                    return;
                yield channel.assertExchange(this.exchangeName, 'topic', { durable: false });
                const correlationId = this.generateUuid();
                const q = yield channel.assertQueue(`${correlationId}.${procName}`, { exclusive: true });
                const timeoutId = setTimeout(() => {
                    this.logger.error('RPC timeout...');
                    return reject('timeout');
                }, timeout);
                yield channel.consume(q.queue, (msg) => {
                    if (msg.properties.correlationId === correlationId) {
                        const content = JSON.parse(msg.content.toString());
                        timers_1.clearTimeout(timeoutId);
                        return resolve(content);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmFiYml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLDBDQUE0QjtBQUc1QixtQ0FBc0M7QUFFdEMsTUFBcUIsYUFBYTtJQVFoQyxZQUFzQixJQUF5QixFQUFZLE1BQWM7UUFBbkQsU0FBSSxHQUFKLElBQUksQ0FBcUI7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBUGpFLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBUXpCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxRQUFRLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVZLElBQUk7O1lBQ2YsSUFDSyxDQUFDLElBQUksQ0FBQyxJQUFJO21CQUNWLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO21CQUNmLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO21CQUNmLENBQUMsSUFBSSxDQUFDLElBQUksQ0FB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QU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0Y7QUFoTEQsZ0NBZ0xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFtcXBsaWIgZnJvbSAnYW1xcGxpYic7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBSYWJiaXRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vdXRpbHMvU2VydmljZUNvbmYnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuLi91dGlscy9Mb2dnZXInO1xuaW1wb3J0IHsgY2xlYXJUaW1lb3V0IH0gZnJvbSAndGltZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFiYml0U2VydmljZSB7XG4gIHByaXZhdGUgUlBDX1RJTUVPVVQgPSA1MDAwO1xuICBwcml2YXRlIGNvbm5lY3Rpb24/OiBhbXFwbGliLkNvbm5lY3Rpb247XG4gIHByaXZhdGUgY2hhbm5lbD86IGFtcXBsaWIuQ2hhbm5lbDtcbiAgcHJpdmF0ZSB1cmw6IHN0cmluZztcbiAgcHJpdmF0ZSBxdWV1ZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBleGNoYW5nZU5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY29uZjogUmFiYml0Q29uZmlndXJhdGlvbiwgcHJvdGVjdGVkIGxvZ2dlcjogTG9nZ2VyKSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBjb25mLnVzZXJuYW1lO1xuICAgIGNvbnN0IHBhc3N3b3JkID0gY29uZi5wYXNzd29yZDtcbiAgICBjb25zdCBob3N0ID0gY29uZi5ob3N0O1xuICAgIGNvbnN0IHBvcnQgPSBjb25mLnBvcnQ7XG5cbiAgICB0aGlzLnF1ZXVlTmFtZSA9IGNvbmYuZXhjaGFuZ2U7XG4gICAgdGhpcy5leGNoYW5nZU5hbWUgPSBjb25mLmV4Y2hhbmdlO1xuICAgIHRoaXMucXVldWVOYW1lID0gY29uZi5xdWV1ZSB8fCAnJztcbiAgICB0aGlzLnVybCA9IGBhbXFwOi8vJHt1c2VybmFtZX06JHtwYXNzd29yZH1AJHtob3N0fToke3BvcnR9YDtcbiAgfVxuXG4gIHB1YmxpYyBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmNvbm5lY3Rpb24pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgaWYgKFxuICAgICAgICAgIXRoaXMuY29uZlxuICAgICAgfHwgIXRoaXMuY29uZi5ob3N0XG4gICAgICB8fCAhdGhpcy5jb25mLnBvcnRcbiAgICAgIHx8ICF0aGlzLmNvbmYudXNlcm5hbWVcbiAgICAgIHx8ICF0aGlzLmNvbmYucGFzc3dvcmRcbiAgICAgIHx8ICF0aGlzLmNvbmYuZXhjaGFuZ2VcbiAgICAgIHx8ICF0aGlzLmNvbmYucXVldWVcbiAgICApIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1JhYmJpdE1ROiBObyBwYXJhbWV0ZXJzIGZvciBpbml0aWFsaXphdGlvbi4gU2tpcGluZy4uLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gICAgaWYgKCFjaGFubmVsKSB0aHJvdyBuZXcgRXJyb3IoJ1JhYmJpdCBmYWlsZWQnKTtcblxuICAgIHRoaXMubG9nZ2VyLmluZm8oJ1JhYmJpdCBjb25uZWN0aW9uIGluaXRpYWxpemVkLi4uJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhbm5lbCgpOiBQcm9taXNlPGFtcXBsaWIuQ2hhbm5lbD4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBvbihyb3V0aW5nS2V5OiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIHF1ZXVlTmFtZTogc3RyaW5nID0gJycpIHtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKHF1ZXVlTmFtZSwgeyBleGNsdXNpdmU6IHRydWUgfSk7XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmJpbmRRdWV1ZShxLnF1ZXVlLCB0aGlzLmV4Y2hhbmdlTmFtZSwgcm91dGluZ0tleSk7XG4gICAgYXdhaXQgY2hhbm5lbC5wcmVmZXRjaCgxKTtcblxuICAgIHJldHVybiBjaGFubmVsLmNvbnN1bWUocS5xdWV1ZSwgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrKSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZW1pdChyb3V0aW5nS2V5OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICBhd2FpdCBjaGFubmVsLmFzc2VydEV4Y2hhbmdlKHRoaXMuZXhjaGFuZ2VOYW1lLCAndG9waWMnLCB7IGR1cmFibGU6IGZhbHNlIH0pO1xuXG4gICAgYXdhaXQgY2hhbm5lbC5wdWJsaXNoKHRoaXMuZXhjaGFuZ2VOYW1lLCByb3V0aW5nS2V5LCBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShkYXRhKSkpO1xuICB9XG5cbiAgLypcbiAgICBSUENcbiAgKi9cbiAgcHVibGljIGFzeW5jIGNhbGxQcm9jZWR1cmUocHJvY05hbWU6IHN0cmluZywgZGF0YTogYW55LCB0aW1lb3V0OiBudW1iZXIgPSB0aGlzLlJQQ19USU1FT1VUKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gICAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICAgIGF3YWl0IGNoYW5uZWwuYXNzZXJ0RXhjaGFuZ2UodGhpcy5leGNoYW5nZU5hbWUsICd0b3BpYycsIHsgZHVyYWJsZTogZmFsc2UgfSk7XG5cbiAgICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPSB0aGlzLmdlbmVyYXRlVXVpZCgpO1xuXG4gICAgICBjb25zdCBxID0gYXdhaXQgY2hhbm5lbC5hc3NlcnRRdWV1ZShgJHtjb3JyZWxhdGlvbklkfS4ke3Byb2NOYW1lfWAsIHsgZXhjbHVzaXZlOiB0cnVlIH0pO1xuXG4gICAgICBjb25zdCB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ1JQQyB0aW1lb3V0Li4uJyk7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdCgndGltZW91dCcpO1xuICAgICAgICB9LFxuICAgICAgICB0aW1lb3V0LFxuICAgICAgKTtcblxuICAgICAgYXdhaXQgY2hhbm5lbC5jb25zdW1lKFxuICAgICAgICBxLnF1ZXVlLFxuICAgICAgICAobXNnOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAobXNnLnByb3BlcnRpZXMuY29ycmVsYXRpb25JZCA9PT0gY29ycmVsYXRpb25JZCkge1xuICAgICAgICAgICAgY29uc3QgY29udGVudCA9IEpTT04ucGFyc2UobXNnLmNvbnRlbnQudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGNvbnRlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgeyBub0FjazogdHJ1ZSB9LFxuICAgICAgKTtcblxuICAgICAgYXdhaXQgY2hhbm5lbC5zZW5kVG9RdWV1ZShcbiAgICAgICAgYHJwY19xdWV1ZS4ke3Byb2NOYW1lfWAsXG4gICAgICAgIEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGRhdGEpKSxcbiAgICAgICAge1xuICAgICAgICAgIGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgcmVwbHlUbzogcS5xdWV1ZSxcbiAgICAgICAgfSxcbiAgICAgICk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIC8qXG4gICAgUlBDXG4gICovXG4gIHB1YmxpYyBhc3luYyByZWdpc3RlclByb2NlZHVyZShwcm9jTmFtZTogc3RyaW5nLCBjYWxsYmFjazogYW55KSB7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICBjb25zdCBxdWV1ZU5hbWUgPSBgcnBjX3F1ZXVlLiR7cHJvY05hbWV9YDtcbiAgICBjb25zdCBxID0gYXdhaXQgY2hhbm5lbC5hc3NlcnRRdWV1ZShxdWV1ZU5hbWUsIHsgZHVyYWJsZTogZmFsc2UgfSk7XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmJpbmRRdWV1ZShxLnF1ZXVlLCB0aGlzLmV4Y2hhbmdlTmFtZSwgcHJvY05hbWUpO1xuICAgIGF3YWl0IGNoYW5uZWwucHJlZmV0Y2goMSk7XG5cbiAgICByZXR1cm4gY2hhbm5lbC5jb25zdW1lKHEucXVldWUsIHRoaXMucnBjQ2FsbGJhY2suYmluZCh0aGlzLCBjaGFubmVsLCBjYWxsYmFjaykpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjb25uZWN0KCk6IFByb21pc2U8YW1xcGxpYi5DaGFubmVsPiB7XG4gICAgaWYgKCF0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGF3YWl0IGFtcXBsaWIuY29ubmVjdCh0aGlzLnVybCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5jaGFubmVsKSB7XG4gICAgICB0aGlzLmNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY3JlYXRlQ2hhbm5lbCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNoYW5uZWw7XG4gIH1cblxuICAvKlxuICAgIFJQQ1xuICAqL1xuICBwcml2YXRlIGFzeW5jIHJwY0NhbGxiYWNrKGNoYW5uZWw6IGFtcXBsaWIuQ2hhbm5lbCwgY2FsbGJhY2s6IEZ1bmN0aW9uLCBtZXNzYWdlOiBhbnkpIHtcbiAgICBjb25zdCByZXR2YWwgPSB7fTtcbiAgICBtZXNzYWdlLmNvbnRlbnQgPSBKU09OLnBhcnNlKG1lc3NhZ2UuY29udGVudC50b1N0cmluZygpKTtcbiAgICB0cnkge1xuICAgICAgXy5zZXQocmV0dmFsLCAnZGF0YScsIGF3YWl0IGNhbGxiYWNrKG1lc3NhZ2UpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ0Vycm9yIGluIHJwY0NhbGxiYWNrJywgZXJyb3IpO1xuICAgICAgXy5zZXQocmV0dmFsLCAnZXJyb3InLCBlcnJvcik7XG4gICAgfVxuXG4gICAgY2hhbm5lbC5zZW5kVG9RdWV1ZShcbiAgICAgIG1lc3NhZ2UucHJvcGVydGllcy5yZXBseVRvLFxuICAgICAgQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkocmV0dmFsKSksIHtcbiAgICAgICAgY29ycmVsYXRpb25JZDogbWVzc2FnZS5wcm9wZXJ0aWVzLmNvcnJlbGF0aW9uSWQsXG4gICAgICB9KTtcbiAgICBjaGFubmVsLmFjayhtZXNzYWdlKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbGJhY2soY2hhbm5lbDogYW1xcGxpYi5DaGFubmVsLCBjYWxsYmFjazogRnVuY3Rpb24sIG1lc3NhZ2U6IGFueSkge1xuICAgIG1lc3NhZ2UuY29udGVudCA9IEpTT04ucGFyc2UobWVzc2FnZS5jb250ZW50LnRvU3RyaW5nKCkpO1xuICAgIGNhbGxiYWNrKG1lc3NhZ2UpO1xuICAgIGNoYW5uZWwuYWNrKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZVV1aWQoKSB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSArXG4gICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkgK1xuICAgICAgTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICB9XG59XG4iXX0=