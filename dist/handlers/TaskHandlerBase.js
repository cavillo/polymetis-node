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
    constructor(resources) {
        super(resources);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const environment = this.resources.configuration.service.environment;
            const service = this.resources.configuration.service.service;
            const queue = `${environment}.${service}.${this.topic}`;
            yield this.resources.rabbit.on(`${service}.${this.topic}`, // topic
            this.callback.bind(this), // callback
            queue);
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.log('Handling task', this.topic);
            const data = _.get(payload, 'content', {});
            yield this.handleCallback(data);
        });
    }
}
exports.default = TaskHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFza0hhbmRsZXJCYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXJzL1Rhc2tIYW5kbGVyQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixnRUFBd0M7QUFHeEMsTUFBOEIsZUFBZ0IsU0FBUSxxQkFBVztJQUcvRCxZQUFZLFNBQTJCO1FBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVksSUFBSTs7WUFDZixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ3JFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFFN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxXQUFXLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUV4RCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FDNUIsR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFTLFFBQVE7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQVcsV0FBVztZQUM5QyxLQUFLLENBQ04sQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVlLFFBQVEsQ0FBQyxPQUFZOztZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2RCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0MsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUM7S0FBQTtDQUlGO0FBNUJELGtDQTRCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuL0hhbmRsZXJCYXNlJztcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLi9TZXJ2aWNlQmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFRhc2tIYW5kbGVyQmFzZSBleHRlbmRzIEhhbmRsZXJCYXNle1xuICBwdWJsaWMgYWJzdHJhY3QgdG9waWM6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMpIHtcbiAgICBzdXBlcihyZXNvdXJjZXMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2UuZW52aXJvbm1lbnQ7XG4gICAgY29uc3Qgc2VydmljZSA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5zZXJ2aWNlO1xuXG4gICAgY29uc3QgcXVldWUgPSBgJHtlbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS4ke3RoaXMudG9waWN9YDtcblxuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnJhYmJpdC5vbihcbiAgICAgIGAke3NlcnZpY2V9LiR7dGhpcy50b3BpY31gLCAgICAgICAgLy8gdG9waWNcbiAgICAgIHRoaXMuY2FsbGJhY2suYmluZCh0aGlzKSwgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIHF1ZXVlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcXVldWVcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGNhbGxiYWNrKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJ0hhbmRsaW5nIHRhc2snLCB0aGlzLnRvcGljKTtcbiAgICBjb25zdCBkYXRhID0gXy5nZXQocGF5bG9hZCwgJ2NvbnRlbnQnLCB7fSk7XG4gICAgYXdhaXQgdGhpcy5oYW5kbGVDYWxsYmFjayhkYXRhKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBoYW5kbGVDYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuXG59Il19