"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
        const username = conf.rabbit.username;
        const password = conf.rabbit.password;
        const host = conf.rabbit.host;
        const port = conf.rabbit.port;
        this.exchangeName = conf.service.environment;
        this.url = `amqp://${username}:${password}@${host}:${port}`;
    }
    isConnected() {
        return Boolean(this.connection);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conf
                || !this.conf.rabbit.host
                || !this.conf.rabbit.port
                || !this.conf.rabbit.username
                || !this.conf.rabbit.password
                || !this.conf.service.environment
                || !this.conf.service.service) {
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
    on(routingKey_1, callback_1) {
        return __awaiter(this, arguments, void 0, function* (routingKey, callback, queueName = '') {
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
    callProcedure(procName_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (procName, data, timeout = this.RPC_TIMEOUT) {
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
                        (0, timers_1.clearTimeout)(timeoutId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmFiYml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBOEI7QUFDOUIsMENBQTRCO0FBQzVCLG1DQUFzQztBQVV0QyxNQUFxQixhQUFhO0lBT2hDLFlBQXNCLElBQW1CLEVBQVksTUFBYztRQUE3QyxTQUFJLEdBQUosSUFBSSxDQUFlO1FBQVksV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQU4zRCxnQkFBVyxHQUFHLElBQUksQ0FBQztRQU96QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUN0QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUU5QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzdDLElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxRQUFRLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVZLElBQUk7O1lBQ2YsSUFDSyxDQUFDLElBQUksQ0FBQyxJQUFJO21CQUNWLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTttQkFDdEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO21CQUN0QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFB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LE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUN4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUNGO0FBNU1ELGdDQTRNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhbXFwbGliIGZyb20gJ2FtcXBsaWInO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgY2xlYXJUaW1lb3V0IH0gZnJvbSAndGltZXJzJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb24sIExvZ2dlciB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBSUENSZXNwb25zZVBheWxvYWQge1xuICB0cmFuc2FjdGlvbklkOiBzdHJpbmc7XG4gIGRhdGE/OiBhbnkgfCBudWxsO1xuICBlcnJvcj86IHN0cmluZyB8IG51bGw7XG4gIHN0YXR1czogJ29rJyB8ICdlcnJvcicgfCAndGltZW91dCc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhYmJpdFNlcnZpY2Uge1xuICBwcml2YXRlIFJQQ19USU1FT1VUID0gNTAwMDtcbiAgcHJpdmF0ZSBjb25uZWN0aW9uPzogYW1xcGxpYi5Db25uZWN0aW9uO1xuICBwcml2YXRlIGNoYW5uZWw/OiBhbXFwbGliLkNoYW5uZWw7XG4gIHByaXZhdGUgdXJsOiBzdHJpbmc7XG4gIHByaXZhdGUgZXhjaGFuZ2VOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNvbmY6IENvbmZpZ3VyYXRpb24sIHByb3RlY3RlZCBsb2dnZXI6IExvZ2dlcikge1xuICAgIGNvbnN0IHVzZXJuYW1lID0gY29uZi5yYWJiaXQudXNlcm5hbWU7XG4gICAgY29uc3QgcGFzc3dvcmQgPSBjb25mLnJhYmJpdC5wYXNzd29yZDtcbiAgICBjb25zdCBob3N0ID0gY29uZi5yYWJiaXQuaG9zdDtcbiAgICBjb25zdCBwb3J0ID0gY29uZi5yYWJiaXQucG9ydDtcblxuICAgIHRoaXMuZXhjaGFuZ2VOYW1lID0gY29uZi5zZXJ2aWNlLmVudmlyb25tZW50O1xuICAgIHRoaXMudXJsID0gYGFtcXA6Ly8ke3VzZXJuYW1lfToke3Bhc3N3b3JkfUAke2hvc3R9OiR7cG9ydH1gO1xuICB9XG5cbiAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuY29ubmVjdGlvbik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBpZiAoXG4gICAgICAgICAhdGhpcy5jb25mXG4gICAgICB8fCAhdGhpcy5jb25mLnJhYmJpdC5ob3N0XG4gICAgICB8fCAhdGhpcy5jb25mLnJhYmJpdC5wb3J0XG4gICAgICB8fCAhdGhpcy5jb25mLnJhYmJpdC51c2VybmFtZVxuICAgICAgfHwgIXRoaXMuY29uZi5yYWJiaXQucGFzc3dvcmRcbiAgICAgIHx8ICF0aGlzLmNvbmYuc2VydmljZS5lbnZpcm9ubWVudFxuICAgICAgfHwgIXRoaXMuY29uZi5zZXJ2aWNlLnNlcnZpY2VcbiAgICApIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1JhYmJpdE1ROiBObyBwYXJhbWV0ZXJzIGZvciBpbml0aWFsaXphdGlvbi4gU2tpcGluZy4uLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gICAgaWYgKCFjaGFubmVsKSB0aHJvdyBuZXcgRXJyb3IoJ1JhYmJpdCBmYWlsZWQnKTtcblxuICAgIHRoaXMubG9nZ2VyLmluZm8oJ1JhYmJpdCBjb25uZWN0aW9uIGluaXRpYWxpemVkLi4uJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Q2hhbm5lbCgpOiBQcm9taXNlPGFtcXBsaWIuQ2hhbm5lbD4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBvbihyb3V0aW5nS2V5OiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIHF1ZXVlTmFtZTogc3RyaW5nID0gJycpIHtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKHF1ZXVlTmFtZSk7XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmJpbmRRdWV1ZShxLnF1ZXVlLCB0aGlzLmV4Y2hhbmdlTmFtZSwgcm91dGluZ0tleSk7XG4gICAgYXdhaXQgY2hhbm5lbC5wcmVmZXRjaCgxKTtcblxuICAgIHJldHVybiBjaGFubmVsLmNvbnN1bWUocS5xdWV1ZSwgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrKSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZW1pdChyb3V0aW5nS2V5OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICBhd2FpdCBjaGFubmVsLmFzc2VydEV4Y2hhbmdlKHRoaXMuZXhjaGFuZ2VOYW1lLCAndG9waWMnLCB7IGR1cmFibGU6IGZhbHNlIH0pO1xuXG4gICAgYXdhaXQgY2hhbm5lbC5wdWJsaXNoKHRoaXMuZXhjaGFuZ2VOYW1lLCByb3V0aW5nS2V5LCBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShkYXRhKSkpO1xuICB9XG5cbiAgLypcbiAgICBSUENcbiAgKi9cbiAgcHVibGljIGFzeW5jIGNhbGxQcm9jZWR1cmUocHJvY05hbWU6IHN0cmluZywgZGF0YTogYW55LCB0aW1lb3V0OiBudW1iZXIgPSB0aGlzLlJQQ19USU1FT1VUKTogUHJvbWlzZTxSUENSZXNwb25zZVBheWxvYWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgY29ycmVsYXRpb25JZCA9IHRoaXMuZ2VuZXJhdGVVdWlkKCk7XG5cbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgICBjb25zdCBwYXlsb2FkOiBSUENSZXNwb25zZVBheWxvYWQgPSB7XG4gICAgICAgICAgdHJhbnNhY3Rpb25JZDogY29ycmVsYXRpb25JZCxcbiAgICAgICAgICBlcnJvcjogJ1JhYmJpdE1RIENvbm5lY3Rpb24gZXJyb3InLFxuICAgICAgICAgIHN0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcmVqZWN0KHBheWxvYWQpO1xuICAgICAgfVxuICAgICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcblxuICAgICAgY29uc3QgcSA9IGF3YWl0IGNoYW5uZWwuYXNzZXJ0UXVldWUoYCR7Y29ycmVsYXRpb25JZH0uJHtwcm9jTmFtZX1gLCB7IGV4Y2x1c2l2ZTogdHJ1ZSB9KTtcblxuICAgICAgY29uc3QgdGltZW91dElkID0gc2V0VGltZW91dChcbiAgICAgICAgKCkgPT4ge1xuICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdSUEMgdGltZW91dC4uLicpO1xuICAgICAgICAgIGNvbnN0IHBheWxvYWQ6IFJQQ1Jlc3BvbnNlUGF5bG9hZCA9IHtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uSWQ6IGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgICBlcnJvcjogJ1JQQyBUaW1lb3V0JyxcbiAgICAgICAgICAgIHN0YXR1czogJ3RpbWVvdXQnLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXR1cm4gcmVqZWN0KHBheWxvYWQpO1xuICAgICAgICB9LFxuICAgICAgICB0aW1lb3V0LFxuICAgICAgKTtcblxuICAgICAgYXdhaXQgY2hhbm5lbC5jb25zdW1lKFxuICAgICAgICBxLnF1ZXVlLFxuICAgICAgICAobXNnOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAobXNnLnByb3BlcnRpZXMuY29ycmVsYXRpb25JZCA9PT0gY29ycmVsYXRpb25JZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRlbnQgPSBKU09OLnBhcnNlKG1zZy5jb250ZW50LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICAgIGNvbnN0IHBheWxvYWQ6IFJQQ1Jlc3BvbnNlUGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICB0cmFuc2FjdGlvbklkOiBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgICAgICAgIGVycm9yOiBfLmdldChjb250ZW50LCAnZXJyb3InLCBudWxsKSxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IF8uZ2V0KGNvbnRlbnQsICdyZXN1bHQnLCBudWxsKSA9PT0gJ2Vycm9yJyA/ICdlcnJvcicgOiAnb2snLFxuICAgICAgICAgICAgICAgIGRhdGE6IF8uZ2V0KGNvbnRlbnQsICdkYXRhJywgbnVsbCksXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zdCBwYXlsb2FkOiBSUENSZXNwb25zZVBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25JZDogY29ycmVsYXRpb25JZCxcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICd0aW1lb3V0JyxcbiAgICAgICAgICAgICAgICBlcnJvcjogXy50b1N0cmluZyhlcnJvciksXG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHsgbm9BY2s6IHRydWUgfSxcbiAgICAgICk7XG5cbiAgICAgIGF3YWl0IGNoYW5uZWwuc2VuZFRvUXVldWUoXG4gICAgICAgIGBycGNfcXVldWUuJHtwcm9jTmFtZX1gLFxuICAgICAgICBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShkYXRhKSksXG4gICAgICAgIHtcbiAgICAgICAgICBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgIHJlcGx5VG86IHEucXVldWUsXG4gICAgICAgIH0sXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLypcbiAgICBSUENcbiAgKi9cbiAgcHVibGljIGFzeW5jIHJlZ2lzdGVyUHJvY2VkdXJlKHByb2NOYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpIHtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHF1ZXVlTmFtZSA9IGBycGNfcXVldWUuJHtwcm9jTmFtZX1gO1xuICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKHF1ZXVlTmFtZSwgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmFzc2VydEV4Y2hhbmdlKHRoaXMuZXhjaGFuZ2VOYW1lLCAndG9waWMnLCB7IGR1cmFibGU6IGZhbHNlIH0pO1xuICAgIGF3YWl0IGNoYW5uZWwuYmluZFF1ZXVlKHEucXVldWUsIHRoaXMuZXhjaGFuZ2VOYW1lLCBwcm9jTmFtZSk7XG4gICAgYXdhaXQgY2hhbm5lbC5wcmVmZXRjaCgxKTtcblxuICAgIHJldHVybiBjaGFubmVsLmNvbnN1bWUocS5xdWV1ZSwgdGhpcy5ycGNDYWxsYmFjay5iaW5kKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxhbXFwbGliLkNoYW5uZWw+IHtcbiAgICBpZiAoIXRoaXMuY29ubmVjdGlvbikge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgYW1xcGxpYi5jb25uZWN0KHRoaXMudXJsKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNoYW5uZWwpIHtcbiAgICAgIHRoaXMuY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jcmVhdGVDaGFubmVsKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbDtcbiAgfVxuXG4gIC8qXG4gICAgUlBDXG4gICovXG4gIHByaXZhdGUgYXN5bmMgcnBjQ2FsbGJhY2soY2hhbm5lbDogYW1xcGxpYi5DaGFubmVsLCBjYWxsYmFjazogRnVuY3Rpb24sIG1lc3NhZ2U6IGFueSkge1xuICAgIGNvbnN0IHJldHZhbCA9IHt9O1xuICAgIG1lc3NhZ2UuY29udGVudCA9IEpTT04ucGFyc2UobWVzc2FnZS5jb250ZW50LnRvU3RyaW5nKCkpO1xuICAgIHRyeSB7XG4gICAgICBfLnNldChyZXR2YWwsICdkYXRhJywgYXdhaXQgY2FsbGJhY2sobWVzc2FnZSkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcignRXJyb3IgaW4gcnBjQ2FsbGJhY2snLCBlcnJvcik7XG4gICAgICBfLnNldChyZXR2YWwsICdlcnJvcicsIGVycm9yKTtcbiAgICB9XG5cbiAgICBjaGFubmVsLnNlbmRUb1F1ZXVlKFxuICAgICAgbWVzc2FnZS5wcm9wZXJ0aWVzLnJlcGx5VG8sXG4gICAgICBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShyZXR2YWwpKSwge1xuICAgICAgICBjb3JyZWxhdGlvbklkOiBtZXNzYWdlLnByb3BlcnRpZXMuY29ycmVsYXRpb25JZCxcbiAgICAgIH0pO1xuICAgIGNoYW5uZWwuYWNrKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsYmFjayhjaGFubmVsOiBhbXFwbGliLkNoYW5uZWwsIGNhbGxiYWNrOiBGdW5jdGlvbiwgbWVzc2FnZTogYW55KSB7XG4gICAgbWVzc2FnZS5jb250ZW50ID0gSlNPTi5wYXJzZShtZXNzYWdlLmNvbnRlbnQudG9TdHJpbmcoKSk7XG4gICAgY2FsbGJhY2sobWVzc2FnZSk7XG4gICAgY2hhbm5lbC5hY2sobWVzc2FnZSk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlVXVpZCgpIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygpICtcbiAgICAgIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSArXG4gICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiJdfQ==