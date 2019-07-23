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
const HandlerBase_1 = __importDefault(require("../handlers/HandlerBase"));
class EventHandlerBase extends HandlerBase_1.default {
    constructor(resources) {
        super(resources);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const environment = this.resources.configuration.service.environment;
            const service = this.resources.configuration.service.service;
            const queue = `${environment}.${service}.${this.topic}`;
            yield this.resources.rabbit.on(this.topic, // topic
            this.callback.bind(this), // callback
            queue);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9FdmVudEhhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLDBFQUFrRDtBQUdsRCxNQUE4QixnQkFBaUIsU0FBUSxxQkFBVztJQUdoRSxZQUFZLFNBQTJCO1FBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVksSUFBSTs7WUFDZixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ3JFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFFN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxXQUFXLElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUV4RCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FDNUIsSUFBSSxDQUFDLEtBQUssRUFBeUIsUUFBUTtZQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBVyxXQUFXO1lBQzlDLEtBQUssQ0FDTixDQUFDO1FBQ0osQ0FBQztLQUFBO0lBRWUsUUFBUSxDQUFDLE9BQVk7O1lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQUE7SUFJZSxRQUFRLENBQUMsSUFBWSxFQUFFLElBQVM7O1lBQzlDLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztRQUNKLENBQUM7S0FBQTtDQUNGO0FBbkNELG1DQW1DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuLi9oYW5kbGVycy9IYW5kbGVyQmFzZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzIH0gZnJvbSAnLi4vU2VydmljZUJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBFdmVudEhhbmRsZXJCYXNlIGV4dGVuZHMgSGFuZGxlckJhc2V7XG4gIHB1YmxpYyBhYnN0cmFjdCB0b3BpYzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHJlc291cmNlczogU2VydmljZVJlc291cmNlcykge1xuICAgIHN1cGVyKHJlc291cmNlcyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5lbnZpcm9ubWVudDtcbiAgICBjb25zdCBzZXJ2aWNlID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLnNlcnZpY2U7XG5cbiAgICBjb25zdCBxdWV1ZSA9IGAke2Vudmlyb25tZW50fS4ke3NlcnZpY2V9LiR7dGhpcy50b3BpY31gO1xuXG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0Lm9uKFxuICAgICAgdGhpcy50b3BpYywgICAgICAgICAgICAgICAgICAgICAgICAvLyB0b3BpY1xuICAgICAgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMpLCAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICAgcXVldWUsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBxdWV1ZVxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgY2FsbGJhY2socGF5bG9hZDogYW55KSB7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnSGFuZGxpbmcgZXZlbnQnLCB0aGlzLnRvcGljKTtcbiAgICBjb25zdCBkYXRhID0gXy5nZXQocGF5bG9hZCwgJ2NvbnRlbnQnLCB7fSk7XG4gICAgYXdhaXQgdGhpcy5oYW5kbGVDYWxsYmFjayhkYXRhKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBoYW5kbGVDYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIHByb3RlY3RlZCBhc3luYyBlbWl0VGFzayh0YXNrOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IHRvcGljID0gYCR7dGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLnNlcnZpY2V9LiR7dGFza31gO1xuICAgIHRoaXMucmVzb3VyY2VzLnJhYmJpdC5lbWl0KFxuICAgICAgdG9waWMsXG4gICAgICBkYXRhLFxuICAgICk7XG4gIH1cbn0iXX0=