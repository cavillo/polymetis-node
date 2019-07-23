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
            this.logger.ok('Rabbit Initialized...');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFiYml0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JhYmJpdC9SYWJiaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBOEI7QUFDOUIsMENBQTRCO0FBRzVCLG1DQUFzQztBQUV0QyxNQUFxQixhQUFhO0lBUWhDLFlBQXNCLElBQXlCLEVBQVksTUFBYztRQUFuRCxTQUFJLEdBQUosSUFBSSxDQUFxQjtRQUFZLFdBQU0sR0FBTixNQUFNLENBQVE7UUFQakUsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFRekIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV2QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLFFBQVEsSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzlELENBQUM7SUFFTSxXQUFXO1FBQ2hCLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRVksSUFBSTs7WUFDZixJQUNLLENBQUMsSUFBSSxDQUFDLElBQUk7bUJBQ1YsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7bUJBQ2YsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7bUJBQ2YsQ0FBQyxJQUFJLENBQUMsSUFBSSxD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TUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQWhMRCxnQ0FnTEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYW1xcGxpYiBmcm9tICdhbXFwbGliJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFJhYmJpdENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi91dGlscy9TZXJ2aWNlQ29uZic7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL3V0aWxzL0xvZ2dlcic7XG5pbXBvcnQgeyBjbGVhclRpbWVvdXQgfSBmcm9tICd0aW1lcnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWJiaXRTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBSUENfVElNRU9VVCA9IDUwMDA7XG4gIHByaXZhdGUgY29ubmVjdGlvbj86IGFtcXBsaWIuQ29ubmVjdGlvbjtcbiAgcHJpdmF0ZSBjaGFubmVsPzogYW1xcGxpYi5DaGFubmVsO1xuICBwcml2YXRlIHVybDogc3RyaW5nO1xuICBwcml2YXRlIHF1ZXVlTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIGV4Y2hhbmdlTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25mOiBSYWJiaXRDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHtcbiAgICBjb25zdCB1c2VybmFtZSA9IGNvbmYudXNlcm5hbWU7XG4gICAgY29uc3QgcGFzc3dvcmQgPSBjb25mLnBhc3N3b3JkO1xuICAgIGNvbnN0IGhvc3QgPSBjb25mLmhvc3Q7XG4gICAgY29uc3QgcG9ydCA9IGNvbmYucG9ydDtcblxuICAgIHRoaXMucXVldWVOYW1lID0gY29uZi5leGNoYW5nZTtcbiAgICB0aGlzLmV4Y2hhbmdlTmFtZSA9IGNvbmYuZXhjaGFuZ2U7XG4gICAgdGhpcy5xdWV1ZU5hbWUgPSBjb25mLnF1ZXVlIHx8ICcnO1xuICAgIHRoaXMudXJsID0gYGFtcXA6Ly8ke3VzZXJuYW1lfToke3Bhc3N3b3JkfUAke2hvc3R9OiR7cG9ydH1gO1xuICB9XG5cbiAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuY29ubmVjdGlvbik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBpZiAoXG4gICAgICAgICAhdGhpcy5jb25mXG4gICAgICB8fCAhdGhpcy5jb25mLmhvc3RcbiAgICAgIHx8ICF0aGlzLmNvbmYucG9ydFxuICAgICAgfHwgIXRoaXMuY29uZi51c2VybmFtZVxuICAgICAgfHwgIXRoaXMuY29uZi5wYXNzd29yZFxuICAgICAgfHwgIXRoaXMuY29uZi5leGNoYW5nZVxuICAgICAgfHwgIXRoaXMuY29uZi5xdWV1ZVxuICAgICkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignUmFiYml0TVE6IE5vIHBhcmFtZXRlcnMgZm9yIGluaXRpYWxpemF0aW9uLiBTa2lwaW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHRocm93IG5ldyBFcnJvcignUmFiYml0IGZhaWxlZCcpO1xuXG4gICAgdGhpcy5sb2dnZXIub2soJ1JhYmJpdCBJbml0aWFsaXplZC4uLicpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYW5uZWwoKTogUHJvbWlzZTxhbXFwbGliLkNoYW5uZWw+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgb24ocm91dGluZ0tleTogc3RyaW5nLCBjYWxsYmFjazogYW55LCBxdWV1ZU5hbWU6IHN0cmluZyA9ICcnKSB7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHJldHVybjtcbiAgICBjb25zdCBxID0gYXdhaXQgY2hhbm5lbC5hc3NlcnRRdWV1ZShxdWV1ZU5hbWUsIHsgZXhjbHVzaXZlOiB0cnVlIH0pO1xuICAgIGF3YWl0IGNoYW5uZWwuYXNzZXJ0RXhjaGFuZ2UodGhpcy5leGNoYW5nZU5hbWUsICd0b3BpYycsIHsgZHVyYWJsZTogZmFsc2UgfSk7XG4gICAgYXdhaXQgY2hhbm5lbC5iaW5kUXVldWUocS5xdWV1ZSwgdGhpcy5leGNoYW5nZU5hbWUsIHJvdXRpbmdLZXkpO1xuICAgIGF3YWl0IGNoYW5uZWwucHJlZmV0Y2goMSk7XG5cbiAgICByZXR1cm4gY2hhbm5lbC5jb25zdW1lKHEucXVldWUsIHRoaXMuY2FsbGJhY2suYmluZCh0aGlzLCBjaGFubmVsLCBjYWxsYmFjaykpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGVtaXQocm91dGluZ0tleTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBjaGFubmVsID0gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gICAgaWYgKCFjaGFubmVsKSByZXR1cm47XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcblxuICAgIGF3YWl0IGNoYW5uZWwucHVibGlzaCh0aGlzLmV4Y2hhbmdlTmFtZSwgcm91dGluZ0tleSwgQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoZGF0YSkpKTtcbiAgfVxuXG4gIC8qXG4gICAgUlBDXG4gICovXG4gIHB1YmxpYyBhc3luYyBjYWxsUHJvY2VkdXJlKHByb2NOYW1lOiBzdHJpbmcsIGRhdGE6IGFueSwgdGltZW91dDogbnVtYmVyID0gdGhpcy5SUENfVElNRU9VVCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcblxuICAgICAgY29uc3QgY29ycmVsYXRpb25JZCA9IHRoaXMuZ2VuZXJhdGVVdWlkKCk7XG5cbiAgICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKGAke2NvcnJlbGF0aW9uSWR9LiR7cHJvY05hbWV9YCwgeyBleGNsdXNpdmU6IHRydWUgfSk7XG5cbiAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignUlBDIHRpbWVvdXQuLi4nKTtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KCd0aW1lb3V0Jyk7XG4gICAgICAgIH0sXG4gICAgICAgIHRpbWVvdXQsXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBjaGFubmVsLmNvbnN1bWUoXG4gICAgICAgIHEucXVldWUsXG4gICAgICAgIChtc2c6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChtc2cucHJvcGVydGllcy5jb3JyZWxhdGlvbklkID09PSBjb3JyZWxhdGlvbklkKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gSlNPTi5wYXJzZShtc2cuY29udGVudC50b1N0cmluZygpKTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoY29udGVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7IG5vQWNrOiB0cnVlIH0sXG4gICAgICApO1xuXG4gICAgICBhd2FpdCBjaGFubmVsLnNlbmRUb1F1ZXVlKFxuICAgICAgICBgcnBjX3F1ZXVlLiR7cHJvY05hbWV9YCxcbiAgICAgICAgQnVmZmVyLmZyb20oSlNPTi5zdHJpbmdpZnkoZGF0YSkpLFxuICAgICAgICB7XG4gICAgICAgICAgY29ycmVsYXRpb25JZCxcbiAgICAgICAgICByZXBseVRvOiBxLnF1ZXVlLFxuICAgICAgICB9LFxuICAgICAgKTtcblxuICAgIH0pO1xuICB9XG5cbiAgLypcbiAgICBSUENcbiAgKi9cbiAgcHVibGljIGFzeW5jIHJlZ2lzdGVyUHJvY2VkdXJlKHByb2NOYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiBhbnkpIHtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHF1ZXVlTmFtZSA9IGBycGNfcXVldWUuJHtwcm9jTmFtZX1gO1xuICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKHF1ZXVlTmFtZSwgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmFzc2VydEV4Y2hhbmdlKHRoaXMuZXhjaGFuZ2VOYW1lLCAndG9waWMnLCB7IGR1cmFibGU6IGZhbHNlIH0pO1xuICAgIGF3YWl0IGNoYW5uZWwuYmluZFF1ZXVlKHEucXVldWUsIHRoaXMuZXhjaGFuZ2VOYW1lLCBwcm9jTmFtZSk7XG4gICAgYXdhaXQgY2hhbm5lbC5wcmVmZXRjaCgxKTtcblxuICAgIHJldHVybiBjaGFubmVsLmNvbnN1bWUocS5xdWV1ZSwgdGhpcy5ycGNDYWxsYmFjay5iaW5kKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxhbXFwbGliLkNoYW5uZWw+IHtcbiAgICBpZiAoIXRoaXMuY29ubmVjdGlvbikge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgYW1xcGxpYi5jb25uZWN0KHRoaXMudXJsKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNoYW5uZWwpIHtcbiAgICAgIHRoaXMuY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jcmVhdGVDaGFubmVsKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbDtcbiAgfVxuXG4gIC8qXG4gICAgUlBDXG4gICovXG4gIHByaXZhdGUgYXN5bmMgcnBjQ2FsbGJhY2soY2hhbm5lbDogYW1xcGxpYi5DaGFubmVsLCBjYWxsYmFjazogRnVuY3Rpb24sIG1lc3NhZ2U6IGFueSkge1xuICAgIGNvbnN0IHJldHZhbCA9IHt9O1xuICAgIG1lc3NhZ2UuY29udGVudCA9IEpTT04ucGFyc2UobWVzc2FnZS5jb250ZW50LnRvU3RyaW5nKCkpO1xuICAgIHRyeSB7XG4gICAgICBfLnNldChyZXR2YWwsICdkYXRhJywgYXdhaXQgY2FsbGJhY2sobWVzc2FnZSkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmxvZ2dlci5lcnJvcignRXJyb3IgaW4gcnBjQ2FsbGJhY2snLCBlcnJvcik7XG4gICAgICBfLnNldChyZXR2YWwsICdlcnJvcicsIGVycm9yKTtcbiAgICB9XG5cbiAgICBjaGFubmVsLnNlbmRUb1F1ZXVlKFxuICAgICAgbWVzc2FnZS5wcm9wZXJ0aWVzLnJlcGx5VG8sXG4gICAgICBCdWZmZXIuZnJvbShKU09OLnN0cmluZ2lmeShyZXR2YWwpKSwge1xuICAgICAgICBjb3JyZWxhdGlvbklkOiBtZXNzYWdlLnByb3BlcnRpZXMuY29ycmVsYXRpb25JZCxcbiAgICAgIH0pO1xuICAgIGNoYW5uZWwuYWNrKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxsYmFjayhjaGFubmVsOiBhbXFwbGliLkNoYW5uZWwsIGNhbGxiYWNrOiBGdW5jdGlvbiwgbWVzc2FnZTogYW55KSB7XG4gICAgbWVzc2FnZS5jb250ZW50ID0gSlNPTi5wYXJzZShtZXNzYWdlLmNvbnRlbnQudG9TdHJpbmcoKSk7XG4gICAgY2FsbGJhY2sobWVzc2FnZSk7XG4gICAgY2hhbm5lbC5hY2sobWVzc2FnZSk7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlVXVpZCgpIHtcbiAgICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygpICtcbiAgICAgIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSArXG4gICAgICBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCk7XG4gIH1cbn1cbiJdfQ==