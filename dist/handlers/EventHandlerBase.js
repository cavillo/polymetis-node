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
class EvenHandlerBase extends HandlerBase_1.default {
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
            this.resources.logger.log(this.getName(), 'Initialized...');
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.log('Handling event', this.topic);
            const data = _.get(payload, 'content', {});
            yield this.handleCallback(data);
        });
    }
    getName() {
        return `Event Handler ${this.topic}`;
    }
    emitTask(task, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = `${this.resources.configuration.service.service}.${task}`;
            this.resources.rabbit.emit(topic, data);
        });
    }
}
exports.default = EvenHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9FdmVudEhhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLDBFQUFrRDtBQUdsRCxNQUE4QixlQUFnQixTQUFRLHFCQUFXO0lBRy9ELFlBQVksU0FBMkI7UUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFWSxJQUFJOztZQUNmLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7WUFDckUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUU3RCxNQUFNLEtBQUssR0FBRyxHQUFHLFdBQVcsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXhELE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUM1QixJQUFJLENBQUMsS0FBSyxFQUF5QixRQUFRO1lBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFXLFdBQVc7WUFDOUMsS0FBSyxDQUNOLENBQUM7WUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsQ0FBQztLQUFBO0lBRWUsUUFBUSxDQUFDLE9BQVk7O1lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQUE7SUFJTSxPQUFPO1FBQ1osT0FBTyxpQkFBaUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFZSxRQUFRLENBQUMsSUFBWSxFQUFFLElBQVM7O1lBQzlDLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztRQUNKLENBQUM7S0FBQTtDQUNGO0FBekNELGtDQXlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuLi9oYW5kbGVycy9IYW5kbGVyQmFzZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzIH0gZnJvbSAnLi4vU2VydmljZUJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBFdmVuSGFuZGxlckJhc2UgZXh0ZW5kcyBIYW5kbGVyQmFzZXtcbiAgcHVibGljIGFic3RyYWN0IHRvcGljOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzKSB7XG4gICAgc3VwZXIocmVzb3VyY2VzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLmVudmlyb25tZW50O1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2Uuc2VydmljZTtcblxuICAgIGNvbnN0IHF1ZXVlID0gYCR7ZW52aXJvbm1lbnR9LiR7c2VydmljZX0uJHt0aGlzLnRvcGljfWA7XG5cbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yYWJiaXQub24oXG4gICAgICB0aGlzLnRvcGljLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvcGljXG4gICAgICB0aGlzLmNhbGxiYWNrLmJpbmQodGhpcyksICAgICAgICAgIC8vIGNhbGxiYWNrXG4gICAgICBxdWV1ZSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHF1ZXVlXG4gICAgKTtcblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2codGhpcy5nZXROYW1lKCksICdJbml0aWFsaXplZC4uLicpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGNhbGxiYWNrKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJ0hhbmRsaW5nIGV2ZW50JywgdGhpcy50b3BpYyk7XG4gICAgY29uc3QgZGF0YSA9IF8uZ2V0KHBheWxvYWQsICdjb250ZW50Jywge30pO1xuICAgIGF3YWl0IHRoaXMuaGFuZGxlQ2FsbGJhY2soZGF0YSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgaGFuZGxlQ2FsbGJhY2soZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPjtcblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgRXZlbnQgSGFuZGxlciAke3RoaXMudG9waWN9YDtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBlbWl0VGFzayh0YXNrOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IHRvcGljID0gYCR7dGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLnNlcnZpY2V9LiR7dGFza31gO1xuICAgIHRoaXMucmVzb3VyY2VzLnJhYmJpdC5lbWl0KFxuICAgICAgdG9waWMsXG4gICAgICBkYXRhLFxuICAgICk7XG4gIH1cbn0iXX0=