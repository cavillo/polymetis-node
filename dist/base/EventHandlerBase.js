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
            this.resources.logger.info('-', this.getName());
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('Handling event', this.topic);
            const data = _.get(payload, 'content', {});
            yield this.handleCallback(data);
        });
    }
}
exports.default = EventHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnRIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL0V2ZW50SGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsZ0VBQXdDO0FBRXhDLE1BQThCLGdCQUFpQixTQUFRLHFCQUFXO0lBQ25ELElBQUk7O1lBQ2YsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztZQUNyRSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBRTdELE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFeEQsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQzVCLElBQUksQ0FBQyxLQUFLLEVBQXlCLFFBQVE7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQVcsV0FBVztZQUM5QyxLQUFLLENBQ04sQ0FBQztZQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQztLQUFBO0lBRWUsUUFBUSxDQUFDLE9BQVk7O1lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQUE7Q0FHRjtBQXRCRCxtQ0FzQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgSGFuZGxlckJhc2UgZnJvbSAnLi9IYW5kbGVyQmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEV2ZW50SGFuZGxlckJhc2UgZXh0ZW5kcyBIYW5kbGVyQmFzZXtcbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2UuZW52aXJvbm1lbnQ7XG4gICAgY29uc3Qgc2VydmljZSA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5zZXJ2aWNlO1xuXG4gICAgY29uc3QgcXVldWUgPSBgJHtlbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS4ke3RoaXMudG9waWN9YDtcblxuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnJhYmJpdC5vbihcbiAgICAgIHRoaXMudG9waWMsICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9waWNcbiAgICAgIHRoaXMuY2FsbGJhY2suYmluZCh0aGlzKSwgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICAgIHF1ZXVlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcXVldWVcbiAgICApO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCctJywgdGhpcy5nZXROYW1lKCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGNhbGxiYWNrKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdIYW5kbGluZyBldmVudCcsIHRoaXMudG9waWMpO1xuICAgIGNvbnN0IGRhdGEgPSBfLmdldChwYXlsb2FkLCAnY29udGVudCcsIHt9KTtcbiAgICBhd2FpdCB0aGlzLmhhbmRsZUNhbGxiYWNrKGRhdGEpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGhhbmRsZUNhbGxiYWNrKGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD47XG59Il19