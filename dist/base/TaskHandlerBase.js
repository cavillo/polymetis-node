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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFza0hhbmRsZXJCYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Jhc2UvVGFza0hhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLGdFQUF3QztBQUV4QyxNQUE4QixlQUFnQixTQUFRLHFCQUFXO0lBQ2xELElBQUk7O1lBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUNyRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBRTdELE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFeEQsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQzVCLEdBQUcsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBUyxRQUFRO1lBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFXLFdBQVc7WUFDOUMsS0FBSyxDQUNOLENBQUM7WUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQUVlLFFBQVEsQ0FBQyxPQUFZOztZQUNuQyxJQUFJO2dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUN0RjtRQUNILENBQUM7S0FBQTtDQUlGO0FBM0JELGtDQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuL0hhbmRsZXJCYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgVGFza0hhbmRsZXJCYXNlIGV4dGVuZHMgSGFuZGxlckJhc2V7XG4gIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLmVudmlyb25tZW50O1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2Uuc2VydmljZTtcblxuICAgIGNvbnN0IHF1ZXVlID0gYCR7ZW52aXJvbm1lbnR9LiR7c2VydmljZX0uJHt0aGlzLnRvcGljfWA7XG5cbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yYWJiaXQub24oXG4gICAgICBgJHtzZXJ2aWNlfS4ke3RoaXMudG9waWN9YCwgICAgICAgIC8vIHRvcGljXG4gICAgICB0aGlzLmNhbGxiYWNrLmJpbmQodGhpcyksICAgICAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBxdWV1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHF1ZXVlXG4gICAgKTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnLVt0YXNrIF0nLCB0aGlzLmdldE5hbWUoKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgY2FsbGJhY2socGF5bG9hZDogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdIYW5kbGluZyB0YXNrJywgdGhpcy50b3BpYyk7XG4gICAgICBjb25zdCBkYXRhID0gXy5nZXQocGF5bG9hZCwgJ2NvbnRlbnQnLCB7fSk7XG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZUNhbGxiYWNrKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoJ1Rhc2sgaGFuZGxlciBFUlJPUicsIHRoaXMudG9waWMsIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGhhbmRsZUNhbGxiYWNrKGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD47XG5cbn0iXX0=