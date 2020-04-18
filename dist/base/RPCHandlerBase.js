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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const HandlerBase_1 = __importDefault(require(".//HandlerBase"));
class RPCHandlerBase extends HandlerBase_1.default {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const environment = this.resources.configuration.service.environment;
            const service = this.resources.configuration.service.service;
            yield this.resources.rabbit.registerProcedure(`${environment}.${service}.rpc.${this.topic}`, // topic
            this.callback.bind(this));
            this.resources.logger.info('-[rpc  ]', this.getName());
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.resources.logger.info('Handling rpc', this.topic);
                const data = _.get(payload, 'content', {});
                return yield this.handleCallback(data);
            }
            catch (error) {
                this.resources.logger.error('RPC handler ERROR', this.topic, JSON.stringify(error));
            }
        });
    }
}
exports.default = RPCHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlBDSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9SUENIYW5kbGVyQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixpRUFBeUM7QUFFekMsTUFBOEIsY0FBZSxTQUFRLHFCQUFXO0lBQ2pELElBQUk7O1lBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUNyRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBRTdELE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQzNDLEdBQUcsV0FBVyxJQUFJLE9BQU8sUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUssUUFBUTtZQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDekIsQ0FBQztZQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBRWUsUUFBUSxDQUFDLE9BQVk7O1lBQ25DLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDM0MsT0FBTyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDeEM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDckY7UUFDSCxDQUFDO0tBQUE7Q0FJRjtBQXhCRCxpQ0F3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgSGFuZGxlckJhc2UgZnJvbSAnLi8vSGFuZGxlckJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBSUENIYW5kbGVyQmFzZSBleHRlbmRzIEhhbmRsZXJCYXNle1xuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5lbnZpcm9ubWVudDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLnNlcnZpY2U7XG5cbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yYWJiaXQucmVnaXN0ZXJQcm9jZWR1cmUoXG4gICAgICBgJHtlbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS5ycGMuJHt0aGlzLnRvcGljfWAsICAgIC8vIHRvcGljXG4gICAgICB0aGlzLmNhbGxiYWNrLmJpbmQodGhpcyksICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGxiYWNrXG4gICAgKTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnLVtycGMgIF0nLCB0aGlzLmdldE5hbWUoKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgY2FsbGJhY2socGF5bG9hZDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdIYW5kbGluZyBycGMnLCB0aGlzLnRvcGljKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBfLmdldChwYXlsb2FkLCAnY29udGVudCcsIHt9KTtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmhhbmRsZUNhbGxiYWNrKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoJ1JQQyBoYW5kbGVyIEVSUk9SJywgdGhpcy50b3BpYywgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgaGFuZGxlQ2FsbGJhY2soZGF0YTogYW55KTogUHJvbWlzZTxhbnk+O1xuXG59Il19