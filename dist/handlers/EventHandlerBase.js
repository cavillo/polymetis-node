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
const HandlerBase_1 = __importDefault(require("./HandlerBase"));
class EventHandlerBase extends HandlerBase_1.default {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const environment = this.resources.configuration.service.environment;
            const service = this.resources.configuration.service.service;
            const queue = `${environment}.${service}.${this.topic}`;
            yield this.resources.rabbit.on(this.topic, // topic
            this.callback.bind(this), // callback
            queue);
            this.resources.logger.info('-[event]', this.getName());
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.resources.logger.info('Handling event', this.topic);
                const data = _.get(payload, 'content', {});
                yield this.handleCallback(data);
            }
            catch (error) {
                this.resources.logger.error('Event handler ERROR', this.topic, JSON.stringify(error));
            }
        });
    }
}
exports.default = EventHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9FdmVudEhhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLGdFQUF3QztBQUV4QyxNQUE4QixnQkFBaUIsU0FBUSxxQkFBVztJQUNuRCxJQUFJOztZQUNmLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDckUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUU3RCxNQUFNLEtBQUssR0FBRyxHQUFHLFdBQVcsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXhELE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUM1QixJQUFJLENBQUMsS0FBSyxFQUF5QixRQUFRO1lBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFXLFdBQVc7WUFDOUMsS0FBSyxDQUNOLENBQUM7WUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQUVlLFFBQVEsQ0FBQyxPQUFZOztZQUNuQyxJQUFJO2dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3pELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3ZGO1FBQ0gsQ0FBQztLQUFBO0NBR0Y7QUExQkQsbUNBMEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IEhhbmRsZXJCYXNlIGZyb20gJy4vSGFuZGxlckJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBFdmVudEhhbmRsZXJCYXNlIGV4dGVuZHMgSGFuZGxlckJhc2V7XG4gIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLmVudmlyb25tZW50O1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2Uuc2VydmljZTtcblxuICAgIGNvbnN0IHF1ZXVlID0gYCR7ZW52aXJvbm1lbnR9LiR7c2VydmljZX0uJHt0aGlzLnRvcGljfWA7XG5cbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yYWJiaXQub24oXG4gICAgICB0aGlzLnRvcGljLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvcGljXG4gICAgICB0aGlzLmNhbGxiYWNrLmJpbmQodGhpcyksICAgICAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBxdWV1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHF1ZXVlXG4gICAgKTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnLVtldmVudF0nLCB0aGlzLmdldE5hbWUoKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgY2FsbGJhY2socGF5bG9hZDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdIYW5kbGluZyBldmVudCcsIHRoaXMudG9waWMpO1xuICAgICAgY29uc3QgZGF0YSA9IF8uZ2V0KHBheWxvYWQsICdjb250ZW50Jywge30pO1xuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVDYWxsYmFjayhkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKCdFdmVudCBoYW5kbGVyIEVSUk9SJywgdGhpcy50b3BpYywgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgaGFuZGxlQ2FsbGJhY2soZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPjtcbn0iXX0=