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
class RabbitService {
    constructor(conf, logger) {
        const username = conf.username;
        const password = conf.password;
        const host = conf.host;
        const port = conf.port;
        this.logger = logger;
        this.exchangeName = conf.exchange || 'local';
        this.queueName = conf.queue || '';
        this.url = `amqp://${username}:${password}@${host}:${port}`;
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
    init() {
        return __awaiter(this, void 0, void 0, function* () {
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
            // this.logger.log(`RabbitService [emiting]    [${this.exchangeName}][${routingKey}]: `, data);
        });
    }
    callback(channel, callback, message) {
        message.content = JSON.parse(message.content.toString());
        // this.logger.log(`RabbitService [receiving]  [${_.get(message, 'fields.exchange', '--')}][${_.get(message, 'fields.routingKey', '--')}]: `, message.content);
        callback(message);
        channel.ack(message);
    }
    isConnected() {
        return Boolean(this.connection);
    }
}
exports.default = RabbitService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmFiYml0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JhYmJpdC9SYWJiaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBOEI7QUFDOUIsMENBQTRCO0FBSTVCLE1BQXFCLGFBQWE7SUFRaEMsWUFBWSxJQUF5QixFQUFFLE1BQWM7UUFDbkQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQy9CLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLFFBQVEsSUFBSSxRQUFRLElBQUksSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDO0lBQzlELENBQUM7SUFFYSxPQUFPOztZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLGlCQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuRDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUN0RDtZQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFWSxJQUFJOztZQUNmLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxPQUFPO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7WUFFL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUMxQyxDQUFDO0tBQUE7SUFFWSxVQUFVOztZQUNyQixPQUFPLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLENBQUM7S0FBQTtJQUVLLEVBQUUsQ0FBQyxVQUFrQixFQUFFLFFBQWEsRUFBRSxZQUFvQixFQUFFOztZQUNoRSxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDM0IsT0FBTzthQUNSO1lBQ0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLE9BQU87Z0JBQUUsT0FBTztZQUNyQixNQUFNLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDcEUsTUFBTSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDN0UsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNoRSxNQUFNLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUIsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9FLENBQUM7S0FBQTtJQUVLLElBQUksQ0FBQyxVQUFrQixFQUFFLElBQVM7O1lBQ3RDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxPQUFPO2dCQUFFLE9BQU87WUFDckIsTUFBTSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFFN0UsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEYsK0ZBQStGO1FBQ2pHLENBQUM7S0FBQTtJQUVPLFFBQVEsQ0FBQyxPQUF3QixFQUFFLFFBQWtCLEVBQUUsT0FBWTtRQUN6RSxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELCtKQUErSjtRQUMvSixRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRU0sV0FBVztRQUNoQixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGO0FBM0VELGdDQTJFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhbXFwbGliIGZyb20gJ2FtcXBsaWInO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUmFiYml0Q29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRpbHMvTG9nZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmFiYml0U2VydmljZSB7XG4gIHByaXZhdGUgbG9nZ2VyOiBMb2dnZXI7XG4gIHByaXZhdGUgY29ubmVjdGlvbj86IGFtcXBsaWIuQ29ubmVjdGlvbjtcbiAgcHJpdmF0ZSBjaGFubmVsPzogYW1xcGxpYi5DaGFubmVsO1xuICBwcml2YXRlIHVybDogc3RyaW5nO1xuICBwcml2YXRlIHF1ZXVlTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIGV4Y2hhbmdlTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmY6IFJhYmJpdENvbmZpZ3VyYXRpb24sIGxvZ2dlcjogTG9nZ2VyKSB7XG4gICAgY29uc3QgdXNlcm5hbWUgPSBjb25mLnVzZXJuYW1lO1xuICAgIGNvbnN0IHBhc3N3b3JkID0gY29uZi5wYXNzd29yZDtcbiAgICBjb25zdCBob3N0ID0gY29uZi5ob3N0O1xuICAgIGNvbnN0IHBvcnQgPSBjb25mLnBvcnQ7XG5cbiAgICB0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcbiAgICB0aGlzLmV4Y2hhbmdlTmFtZSA9IGNvbmYuZXhjaGFuZ2UgfHwgJ2xvY2FsJztcbiAgICB0aGlzLnF1ZXVlTmFtZSA9IGNvbmYucXVldWUgfHwgJyc7XG4gICAgdGhpcy51cmwgPSBgYW1xcDovLyR7dXNlcm5hbWV9OiR7cGFzc3dvcmR9QCR7aG9zdH06JHtwb3J0fWA7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGNvbm5lY3QoKTogUHJvbWlzZTxhbXFwbGliLkNoYW5uZWw+IHtcbiAgICBpZiAoIXRoaXMuY29ubmVjdGlvbikge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gYXdhaXQgYW1xcGxpYi5jb25uZWN0KHRoaXMudXJsKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNoYW5uZWwpIHtcbiAgICAgIHRoaXMuY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdGlvbi5jcmVhdGVDaGFubmVsKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbDtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBhd2FpdCB0aGlzLmNvbm5lY3QoKTtcbiAgICBpZiAoIWNoYW5uZWwpIHRocm93IG5ldyBFcnJvcignUmFiYml0IGZhaWxlZCcpO1xuXG4gICAgdGhpcy5sb2dnZXIub2soJ1JhYmJpdCBJbml0aWFsaXplZC4uLicpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGdldENoYW5uZWwoKTogUHJvbWlzZTxhbXFwbGliLkNoYW5uZWw+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jb25uZWN0KCk7XG4gIH1cblxuICBhc3luYyBvbihyb3V0aW5nS2V5OiBzdHJpbmcsIGNhbGxiYWNrOiBhbnksIHF1ZXVlTmFtZTogc3RyaW5nID0gJycpIHtcbiAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGNvbnN0IHEgPSBhd2FpdCBjaGFubmVsLmFzc2VydFF1ZXVlKHF1ZXVlTmFtZSwgeyBleGNsdXNpdmU6IHRydWUgfSk7XG4gICAgYXdhaXQgY2hhbm5lbC5hc3NlcnRFeGNoYW5nZSh0aGlzLmV4Y2hhbmdlTmFtZSwgJ3RvcGljJywgeyBkdXJhYmxlOiBmYWxzZSB9KTtcbiAgICBhd2FpdCBjaGFubmVsLmJpbmRRdWV1ZShxLnF1ZXVlLCB0aGlzLmV4Y2hhbmdlTmFtZSwgcm91dGluZ0tleSk7XG4gICAgYXdhaXQgY2hhbm5lbC5wcmVmZXRjaCgxKTtcblxuICAgIHJldHVybiBjaGFubmVsLmNvbnN1bWUocS5xdWV1ZSwgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMsIGNoYW5uZWwsIGNhbGxiYWNrKSk7XG4gIH1cblxuICBhc3luYyBlbWl0KHJvdXRpbmdLZXk6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgY29uc3QgY2hhbm5lbCA9IGF3YWl0IHRoaXMuY29ubmVjdCgpO1xuICAgIGlmICghY2hhbm5lbCkgcmV0dXJuO1xuICAgIGF3YWl0IGNoYW5uZWwuYXNzZXJ0RXhjaGFuZ2UodGhpcy5leGNoYW5nZU5hbWUsICd0b3BpYycsIHsgZHVyYWJsZTogZmFsc2UgfSk7XG5cbiAgICBhd2FpdCBjaGFubmVsLnB1Ymxpc2godGhpcy5leGNoYW5nZU5hbWUsIHJvdXRpbmdLZXksIEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGRhdGEpKSk7XG4gICAgLy8gdGhpcy5sb2dnZXIubG9nKGBSYWJiaXRTZXJ2aWNlIFtlbWl0aW5nXSAgICBbJHt0aGlzLmV4Y2hhbmdlTmFtZX1dWyR7cm91dGluZ0tleX1dOiBgLCBkYXRhKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FsbGJhY2soY2hhbm5lbDogYW1xcGxpYi5DaGFubmVsLCBjYWxsYmFjazogRnVuY3Rpb24sIG1lc3NhZ2U6IGFueSkge1xuICAgIG1lc3NhZ2UuY29udGVudCA9IEpTT04ucGFyc2UobWVzc2FnZS5jb250ZW50LnRvU3RyaW5nKCkpO1xuICAgIC8vIHRoaXMubG9nZ2VyLmxvZyhgUmFiYml0U2VydmljZSBbcmVjZWl2aW5nXSAgWyR7Xy5nZXQobWVzc2FnZSwgJ2ZpZWxkcy5leGNoYW5nZScsICctLScpfV1bJHtfLmdldChtZXNzYWdlLCAnZmllbGRzLnJvdXRpbmdLZXknLCAnLS0nKX1dOiBgLCBtZXNzYWdlLmNvbnRlbnQpO1xuICAgIGNhbGxiYWNrKG1lc3NhZ2UpO1xuICAgIGNoYW5uZWwuYWNrKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHVibGljIGlzQ29ubmVjdGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBCb29sZWFuKHRoaXMuY29ubmVjdGlvbik7XG4gIH1cbn1cbiJdfQ==