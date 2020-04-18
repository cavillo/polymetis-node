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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmFiYml0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLDBDQUE0QjtBQUc1QixtQ0FBc0M7QUFTdEMsTUFBcUIsYUFBYTtJQU9oQyxZQUFzQixJQUFtQixFQUFZLE1BQWM7UUFBN0MsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUFZLFdBQU0sR0FBTixNQUFNLENBQVE7UUFOM0QsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFPekIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDdEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFOUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLFVBQVUsUUFBUSxJQUFJLFFBQVEsSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFWSxJQUFJOztZQUNmLElBQ0ssQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDVixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7bUJBQ3RCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTttQkFDdEIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO21CQUMxQixDQUFDLElB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bGliIGZyb20gJ2FtcXBsaWInO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRpbHMvTG9nZ2VyJztcbmltcG9ydCB7IGNsZWFyVGltZW91dCB9IGZyb20gJ3RpbWVycyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUlBDUmVzcG9uc2VQYXlsb2FkIHtcbiAgdHJhbnNhY3Rpb25JZDogc3RyaW5nO1xuICBkYXRhPzogYW55IHwgbnVsbDtcbiAgZXJyb3I/OiBzdHJpbmcgfCBudWxsO1xuICBzdGF0dXM6ICdvaycgfCAnZXJyb3InIHwgJ3RpbWVvdXQnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWJiaXRTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBSUENfVElNRU9VVCA9IDUwMDA7XG4gIHByaXZhdGUgY29ubmVjdGlvbj86IGFtcXBsaWIuQ29ubmVjdGlvbjtcbiAgcHJpdmF0ZSBjaGFubmVsPzogYW1xcGxpYi5DaGFubmVsO1xuICBwcml2YXRlIHVybDogc3RyaW5nO1xuICBwcml2YXRlIGV4Y2hhbmdlTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25mOiBDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGNvbmYucmFiYml0LnVzZXJuYW1lO1xuICAgIGNvbnN0IHBhc3N3b3JkID0gY29uZi5yYWJiaXQucGFzc3dvcmQ7XG4gICAgY29uc3QgaG9zdCA9IGNvbmYucmFiYml0Lmhvc3Q7XG4gICAgY29uc3QgcG9ydCA9IGNvbmYucmFiYml0LnBvcnQ7XG5cbiAgICB0aGlzLmV4Y2hhbmdlTmFtZSA9IGNvbmYuc2VydmljZS5lbnZpcm9ubWVudDtcbiAgICB0aGlzLnVybCA9IGBhbXFwOi8vJHt1c2VybmFtZX06JHtwYXNzd29yZH1AJHtob3N0fToke3BvcnR9YDtcbiAgfVxuXG4gIHB1YmxpYyBpc0Nvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLmNvbm5lY3Rpb24pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgaWYgKFxuICAgICAgICAgIXRoaXMuY29uZlxuICAgICAgfHwgIXRoaXMuY29uZi5yYWJiaXQuaG9zdFxuICAgICAgfHwgIXRoaXMuY29uZi5yYWJiaXQucG9ydFxuICAgICAgfHwgIXRoaXMuY29uZi5yYWJiaXQudXNlcm5hbWVcbiAgICAgIHx8ICF0aGlzLmNvbmYucmFiYml0LnBhc3N3b3JkXG4gICAgICB8fCAhdGhpcy5jb25mLnNlcnZpY2UuZW52aXJvbm1lbnRcbiAgICAgIHx8ICF0aGlzLmNvbmYuc2VydmljZS5zZXJ2aWNlXG4gICAgKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKCdSYWJiaXRNUTogTm8gcGFyYW1ldGVycyBmb3IgaW5pdGlhbGl6YXRpb24uIFNraXBpbmcuLi4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgdGhyb3cgbmV3IEVycm9yKCdSYWJiaXQgZmFpbGVkJyk7XG5cbiAgICB0aGlzLmxvZ2dlci5pbmZvKCdSYWJiaXQgY29ubmVjdGlvbiBpbml0aWFsaXplZC4uLicpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYW5uZWwoKTogUHJvbWlzZTxhbXFwbGliLkNoYW5uZWw+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgb24ocm91dGluZ0tleTogc3RyaW5nLCBjYWxsYmFjazogYW55LCBxdWV1ZU5hbWU6IHN0cmluZyA9ICcnKSB7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICBjb25zdCBxID0gYXdhaXQgY2hhbm5lbC5hc3NlcnRRdWV1ZShxdWV1ZU5hbWUpO1xuICAgIGF3YWl0IGNoYW5uZWwuYXNzZXJ0RXhjaGFuZ2UodGhpcy5leGNoYW5nZU5hbWUsICd0b3BpYycsIHsgZHVyYWJsZTogZmFsc2UgfSk7XG4gICAgYXdhaXQgY2hhbm5lbC5iaW5kUXVldWUocS5xdWV1ZSwgdGhpcy5leGNoYW5nZU5hbWUsIHJvdXRpbmdLZXkpO1xuICAgIGF3YWl0IGNoYW5uZWwucHJlZmV0Y2goMSk7XG5cbiAgICByZXR1cm4gY2hhbm5lbC5jb25zdW1lKHEucXVldWUsIHRoaXMuY2FsbGJhY2suYmluZCh0aGlzLCBjaGFubmVsLCBjYWxsYmFjaykpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGVtaXQocm91dGluZ0tleTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gICAgaWYgKCFjaGFubmVsKSByZXR1cm47XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcblxuICAgIGF3YWl0IGNoYW5uZWwucHVibGlzaCh0aGlzLmV4Y2hhbmdlTmFtZSwgcm91dGluZ0tleSwgQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoZGF0YSkpKTtcbiAgfVxuXG4gIC8qXG4gICAgUlBDXG4gICovXG4gIHB1YmxpYyBhc3luYyBjYWxsUHJvY2VkdXJlKHByb2NOYW1lOiBzdHJpbmcsIGRhdGE6IGFueSwgdGltZW91dDogbnVtYmVyID0gdGhpcy5SUENfVElNRU9VVCk6IFByb21pc2U8UlBDUmVzcG9uc2VQYXlsb2FkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IGNvcnJlbGF0aW9uSWQgPSB0aGlzLmdlbmVyYXRlVXVpZCgpO1xuXG4gICAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gICAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgICAgY29uc3QgcGF5bG9hZDogUlBDUmVzcG9uc2VQYXlsb2FkID0ge1xuICAgICAgICAgIHRyYW5zYWN0aW9uSWQ6IGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgZXJyb3I6ICdSYWJiaXRNUSBDb25uZWN0aW9uIGVycm9yJyxcbiAgICAgICAgICBzdGF0dXM6ICdlcnJvcicsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHJlamVjdChwYXlsb2FkKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IGNoYW5uZWwuYXNzZXJ0RXhjaGFuZ2UodGhpcy5leGNoYW5nZU5hbWUsICd0b3BpYycsIHsgZHVyYWJsZTogZmFsc2UgfSk7XG5cbiAgICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKGAke2NvcnJlbGF0aW9uSWR9LiR7cHJvY05hbWV9YCwgeyBleGNsdXNpdmU6IHRydWUgfSk7XG5cbiAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignUlBDIHRpbWVvdXQuLi4nKTtcbiAgICAgICAgICBjb25zdCBwYXlsb2FkOiBSUENSZXNwb25zZVBheWxvYWQgPSB7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbklkOiBjb3JyZWxhdGlvbklkLFxuICAgICAgICAgICAgZXJyb3I6ICdSUEMgVGltZW91dCcsXG4gICAgICAgICAgICBzdGF0dXM6ICd0aW1lb3V0JyxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChwYXlsb2FkKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGltZW91dCxcbiAgICAgICk7XG5cbiAgICAgIGF3YWl0IGNoYW5uZWwuY29uc3VtZShcbiAgICAgICAgcS5xdWV1ZSxcbiAgICAgICAgKG1zZzogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKG1zZy5wcm9wZXJ0aWVzLmNvcnJlbGF0aW9uSWQgPT09IGNvcnJlbGF0aW9uSWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5wYXJzZShtc2cuY29udGVudC50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgICBjb25zdCBwYXlsb2FkOiBSUENSZXNwb25zZVBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgdHJhbnNhY3Rpb25JZDogY29ycmVsYXRpb25JZCxcbiAgICAgICAgICAgICAgICBlcnJvcjogXy5nZXQoY29udGVudCwgJ2Vycm9yJywgbnVsbCksXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBfLmdldChjb250ZW50LCAncmVzdWx0JywgbnVsbCkgPT09ICdlcnJvcicgPyAnZXJyb3InIDogJ29rJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBfLmdldChjb250ZW50LCAnZGF0YScsIG51bGwpLFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgY29uc3QgcGF5bG9hZDogUlBDUmVzcG9uc2VQYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgIHRyYW5zYWN0aW9uSWQ6IGNvcnJlbGF0aW9uSWQsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAndGltZW91dCcsXG4gICAgICAgICAgICAgICAgZXJyb3I6IF8udG9TdHJpbmcoZXJyb3IpLFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIHJldHVybiByZWplY3QocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7IG5vQWNrOiB0cnVlIH0sXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBjaGFubmVsLnNlbmRUb1F1ZXVlKFxuICAgICAgICBgcnBjX3F1ZXVlLiR7cHJvY05hbWV9YCxcbiAgICAgICAgQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoZGF0YSkpLFxuICAgICAgICB7XG4gICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICByZXBseVRvOiBxLnF1ZXVlLFxuICAgICAgICB9LFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qXG4gICAgUlBDXG4gICovXG4gIHB1YmxpYyBhc3luYyByZWdpc3RlclByb2NlZHVyZShwcm9jTmFtZTogc3RyaW5nLCBjYWxsYmFjazogYW55KSB7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICBjb25zdCBxdWV1ZU5hbWUgPSBgcnBjX3F1ZXVlLiR7cHJvY05hbWV9YDtcbiAgICBjb25zdCBxID0gYXdhaXQgY2hhbm5lbC5hc3NlcnRRdWV1ZShxdWV1ZU5hbWUsIHsgZHVyYWJsZTogZmFsc2UgfSk7XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmJpbmRRdWV1ZShxLnF1ZXVlLCB0aGlzLmV4Y2hhbmdlTmFtZSwgcHJvY05hbWUpO1xuICAgIGF3YWl0IGNoYW5uZWwucHJlZmV0Y2goMSk7XG5cbiAgICByZXR1cm4gY2hhbm5lbC5jb25zdW1lKHEucXVldWUsIHRoaXMucnBjQ2FsbGJhY2suYmluZCh0aGlzLCBjaGFubmVsLCBjYWxsYmFjaykpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBjb25uZWN0KCk6IFByb21pc2U8YW1xcGxpYi5DaGFubmVsPiB7XG4gICAgaWYgKCF0aGlzLmNvbm5lY3Rpb24pIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGF3YWl0IGFtcXBsaWIuY29ubmVjdCh0aGlzLnVybCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5jaGFubmVsKSB7XG4gICAgICB0aGlzLmNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uY3JlYXRlQ2hhbm5lbCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNoYW5uZWw7XG4gIH1cblxuICAvKlxuICAgIFJQQ1xuICAqL1xuICBwcml2YXRlIGFzeW5jIHJwY0NhbGxiYWNrKGNoYW5uZWw6IGFtcXBsaWIuQ2hhbm5lbCwgY2FsbGJhY2s6IEZ1bmN0aW9uLCBtZXNzYWdlOiBhbnkpIHtcbiAgICBjb25zdCByZXR2YWwgPSB7fTtcbiAgICBtZXNzYWdlLmNvbnRlbnQgPSBKU09OLnBhcnNlKG1lc3NhZ2UuY29udGVudC50b1N0cmluZygpKTtcbiAgICB0cnkge1xuICAgICAgXy5zZXQocmV0dmFsLCAnZGF0YScsIGF3YWl0IGNhbGxiYWNrKG1lc3NhZ2UpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ0Vycm9yIGluIHJwY0NhbGxiYWNrJywgZXJyb3IpO1xuICAgICAgXy5zZXQocmV0dmFsLCAnZXJyb3InLCBlcnJvcik7XG4gICAgfVxuXG4gICAgY2hhbm5lbC5zZW5kVG9RdWV1ZShcbiAgICAgIG1lc3NhZ2UucHJvcGVydGllcy5yZXBseVRvLFxuICAgICAgQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkocmV0dmFsKSksIHtcbiAgICAgICAgY29ycmVsYXRpb25JZDogbWVzc2FnZS5wcm9wZXJ0aWVzLmNvcnJlbGF0aW9uSWQsXG4gICAgICB9KTtcbiAgICBjaGFubmVsLmFjayhtZXNzYWdlKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbGJhY2soY2hhbm5lbDogYW1xcGxpYi5DaGFubmVsLCBjYWxsYmFjazogRnVuY3Rpb24sIG1lc3NhZ2U6IGFueSkge1xuICAgIG1lc3NhZ2UuY29udGVudCA9IEpTT04ucGFyc2UobWVzc2FnZS5jb250ZW50LnRvU3RyaW5nKCkpO1xuICAgIGNhbGxiYWNrKG1lc3NhZ2UpO1xuICAgIGNoYW5uZWwuYWNrKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZVV1aWQoKSB7XG4gICAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSArXG4gICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkgK1xuICAgICAgTWF0aC5yYW5kb20oKS50b1N0cmluZygpO1xuICB9XG59XG4iXX0=