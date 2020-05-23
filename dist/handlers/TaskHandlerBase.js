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
class TaskHandlerBase extends HandlerBase_1.default {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const environment = this.resources.configuration.service.environment;
            const service = this.resources.configuration.service.service;
            const queue = `${environment}.${service}.${this.topic}`;
            yield this.resources.rabbit.on(`${service}.${this.topic}`, // topic
            this.callback.bind(this), // callback
            queue);
            this.resources.logger.info('-[task ]', this.getName());
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.resources.logger.info('Handling task', this.topic);
                const data = _.get(payload, 'content', {});
                yield this.handleCallback(data);
            }
            catch (error) {
                this.resources.logger.error('Task handler ERROR', this.topic, JSON.stringify(error));
            }
        });
    }
}
exports.default = TaskHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFza0hhbmRsZXJCYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXJzL1Rhc2tIYW5kbGVyQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixnRUFBd0M7QUFFeEMsTUFBOEIsZUFBZ0IsU0FBUSxxQkFBVztJQUNsRCxJQUFJOztZQUNmLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDckUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUU3RCxNQUFNLEtBQUssR0FBRyxHQUFHLFdBQVcsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXhELE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUM1QixHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQVMsUUFBUTtZQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBVyxXQUFXO1lBQzlDLEtBQUssQ0FDTixDQUFDO1lBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN6RCxDQUFDO0tBQUE7SUFFZSxRQUFRLENBQUMsT0FBWTs7WUFDbkMsSUFBSTtnQkFDRixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDdEY7UUFDSCxDQUFDO0tBQUE7Q0FJRjtBQTNCRCxrQ0EyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgSGFuZGxlckJhc2UgZnJvbSAnLi9IYW5kbGVyQmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFRhc2tIYW5kbGVyQmFzZSBleHRlbmRzIEhhbmRsZXJCYXNle1xuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5lbnZpcm9ubWVudDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLnNlcnZpY2U7XG5cbiAgICBjb25zdCBxdWV1ZSA9IGAke2Vudmlyb25tZW50fS4ke3NlcnZpY2V9LiR7dGhpcy50b3BpY31gO1xuXG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0Lm9uKFxuICAgICAgYCR7c2VydmljZX0uJHt0aGlzLnRvcGljfWAsICAgICAgICAvLyB0b3BpY1xuICAgICAgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMpLCAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgcXVldWUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBxdWV1ZVxuICAgICk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJy1bdGFzayBdJywgdGhpcy5nZXROYW1lKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGNhbGxiYWNrKHBheWxvYWQ6IGFueSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnSGFuZGxpbmcgdGFzaycsIHRoaXMudG9waWMpO1xuICAgICAgY29uc3QgZGF0YSA9IF8uZ2V0KHBheWxvYWQsICdjb250ZW50Jywge30pO1xuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVDYWxsYmFjayhkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKCdUYXNrIGhhbmRsZXIgRVJST1InLCB0aGlzLnRvcGljLCBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBoYW5kbGVDYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuXG59Il19