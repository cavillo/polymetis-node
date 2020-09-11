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
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const rpcs_1 = require("../utils/rpcs");
class Base {
    constructor(resources) {
        this.resources = resources;
        this.resources = resources;
    }
    emitEvent(topic, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resources.rabbit.emit(topic, data);
        });
    }
    emitTask(task, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = `${this.resources.configuration.service.service}.${task}`;
            this.resources.rabbit.emit(topic, data);
        });
    }
    callRPC(url, data, transactionId = this.generateTransactionId()) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('RPC-calling', url, transactionId);
            try {
                const response = yield rpcs_1.post(url, {
                    transactionId,
                    payload: data,
                });
                if (response.transactionId !== transactionId) {
                    throw new Error('Invalid transactionId');
                }
                if (!lodash_1.default.isNil(response.error)) {
                    throw new Error(response.error);
                }
                return response.data;
            }
            catch (error) {
                this.resources.logger.error('RPC-calling-error', url, transactionId, error.message);
                throw new Error(error.message);
            }
        });
    }
    generateTransactionId() {
        return `${lodash_1.default.random(1e10).toString()}-${lodash_1.default.random(1e10).toString()}-${Date.now()}`;
    }
}
exports.default = Base;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9CYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUI7QUFFdkIsd0NBQXlEO0FBRXpELE1BQXFCLElBQUk7SUFDdkIsWUFBc0IsU0FBMkI7UUFBM0IsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVZLFNBQVMsQ0FBQyxLQUFhLEVBQUUsSUFBUzs7WUFDN0MsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQy9CLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVZLFFBQVEsQ0FBQyxJQUFZLEVBQUUsSUFBUzs7WUFDM0MsTUFBTSxLQUFLLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3hFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDeEIsS0FBSyxFQUNMLElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFJLEdBQVcsRUFBRSxJQUFTLEVBQUUsZ0JBQXdCLElBQUksQ0FBQyxxQkFBcUIsRUFBRTs7WUFDbEcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDOUQsSUFBSTtnQkFDRixNQUFNLFFBQVEsR0FBdUIsTUFBTSxXQUFJLENBQzdDLEdBQUcsRUFDSDtvQkFDRSxhQUFhO29CQUNiLE9BQU8sRUFBRSxJQUFJO2lCQUNkLENBQ0YsQ0FBQztnQkFFRixJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssYUFBYSxFQUFFO29CQUM1QyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7aUJBQzFDO2dCQUNELElBQUksQ0FBQyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNqQztnQkFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7YUFDdEI7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3BGLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2hDO1FBQ0gsQ0FBQztLQUFBO0lBRVMscUJBQXFCO1FBQzdCLE9BQU8sR0FBRyxnQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxnQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUNuRixDQUFDO0NBQ0Y7QUFoREQsdUJBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLic7XG5pbXBvcnQgeyBwb3N0LCBSUENSZXNwb25zZVBheWxvYWQgfSBmcm9tICcuLi91dGlscy9ycGNzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMpIHtcbiAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlcztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBlbWl0RXZlbnQodG9waWM6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJhYmJpdC5lbWl0KFxuICAgICAgdG9waWMsXG4gICAgICBkYXRhLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZW1pdFRhc2sodGFzazogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB0b3BpYyA9IGAke3RoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5zZXJ2aWNlfS4ke3Rhc2t9YDtcbiAgICB0aGlzLnJlc291cmNlcy5yYWJiaXQuZW1pdChcbiAgICAgIHRvcGljLFxuICAgICAgZGF0YSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNhbGxSUEM8VD4odXJsOiBzdHJpbmcsIGRhdGE6IGFueSwgdHJhbnNhY3Rpb25JZDogc3RyaW5nID0gdGhpcy5nZW5lcmF0ZVRyYW5zYWN0aW9uSWQoKSk6IFByb21pc2U8VD4ge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUEMtY2FsbGluZycsIHVybCwgdHJhbnNhY3Rpb25JZCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlOiBSUENSZXNwb25zZVBheWxvYWQgPSBhd2FpdCBwb3N0KFxuICAgICAgICB1cmwsXG4gICAgICAgIHtcbiAgICAgICAgICB0cmFuc2FjdGlvbklkLFxuICAgICAgICAgIHBheWxvYWQ6IGRhdGEsXG4gICAgICAgIH0sXG4gICAgICApO1xuXG4gICAgICBpZiAocmVzcG9uc2UudHJhbnNhY3Rpb25JZCAhPT0gdHJhbnNhY3Rpb25JZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdHJhbnNhY3Rpb25JZCcpO1xuICAgICAgfVxuICAgICAgaWYgKCFfLmlzTmlsKHJlc3BvbnNlLmVycm9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzcG9uc2UuZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKCdSUEMtY2FsbGluZy1lcnJvcicsIHVybCwgdHJhbnNhY3Rpb25JZCwgZXJyb3IubWVzc2FnZSk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdlbmVyYXRlVHJhbnNhY3Rpb25JZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHtfLnJhbmRvbSgxZTEwKS50b1N0cmluZygpfS0ke18ucmFuZG9tKDFlMTApLnRvU3RyaW5nKCl9LSR7RGF0ZS5ub3coKX1gO1xuICB9XG59XG4iXX0=