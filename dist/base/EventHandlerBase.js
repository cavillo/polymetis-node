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
            this.resources.logger.log('-', this.getName());
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.log('Handling event', this.topic);
            const data = _.get(payload, 'content', {});
            yield this.handleCallback(data);
        });
    }
    emitTask(task, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = `${this.resources.configuration.service.service}.${task}`;
            this.resources.rabbit.emit(topic, data);
        });
    }
}
exports.default = EventHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL0V2ZW50SGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsZ0VBQXdDO0FBRXhDLE1BQThCLGdCQUFpQixTQUFRLHFCQUFXO0lBQ25ELElBQUk7O1lBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUNyRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBRTdELE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFeEQsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQzVCLElBQUksQ0FBQyxLQUFLLEVBQXlCLFFBQVE7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQVcsV0FBVztZQUM5QyxLQUFLLENBQ04sQ0FBQztZQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUFBO0lBRWUsUUFBUSxDQUFDLE9BQVk7O1lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQUE7SUFJZSxRQUFRLENBQUMsSUFBWSxFQUFFLElBQVM7O1lBQzlDLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztRQUNKLENBQUM7S0FBQTtDQUNGO0FBOUJELG1DQThCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuL0hhbmRsZXJCYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgRXZlbnRIYW5kbGVyQmFzZSBleHRlbmRzIEhhbmRsZXJCYXNle1xuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5lbnZpcm9ubWVudDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLnNlcnZpY2U7XG5cbiAgICBjb25zdCBxdWV1ZSA9IGAke2Vudmlyb25tZW50fS4ke3NlcnZpY2V9LiR7dGhpcy50b3BpY31gO1xuXG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0Lm9uKFxuICAgICAgdGhpcy50b3BpYywgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b3BpY1xuICAgICAgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMpLCAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgcXVldWUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBxdWV1ZVxuICAgICk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnLScsIHRoaXMuZ2V0TmFtZSgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBjYWxsYmFjayhwYXlsb2FkOiBhbnkpIHtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCdIYW5kbGluZyBldmVudCcsIHRoaXMudG9waWMpO1xuICAgIGNvbnN0IGRhdGEgPSBfLmdldChwYXlsb2FkLCAnY29udGVudCcsIHt9KTtcbiAgICBhd2FpdCB0aGlzLmhhbmRsZUNhbGxiYWNrKGRhdGEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGhhbmRsZUNhbGxiYWNrKGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD47XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGVtaXRUYXNrKHRhc2s6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgY29uc3QgdG9waWMgPSBgJHt0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2Uuc2VydmljZX0uJHt0YXNrfWA7XG4gICAgdGhpcy5yZXNvdXJjZXMucmFiYml0LmVtaXQoXG4gICAgICB0b3BpYyxcbiAgICAgIGRhdGEsXG4gICAgKTtcbiAgfVxufSJdfQ==