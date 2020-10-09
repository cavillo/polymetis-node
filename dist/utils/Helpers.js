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
const rpcs_1 = require("./rpcs");
exports.emitEvent = (resources, topic, data) => __awaiter(this, void 0, void 0, function* () {
    return resources.rabbit.emit(topic, data);
});
exports.emitTask = (resources, task, data) => __awaiter(this, void 0, void 0, function* () {
    const topic = `${resources.configuration.service.service}.${task}`;
    resources.rabbit.emit(topic, data);
});
exports.callRPC = (resources, url, data, transactionId = this.generateTransactionId()) => __awaiter(this, void 0, void 0, function* () {
    resources.logger.info('RPC-calling', url, transactionId);
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
        resources.logger.error('RPC-calling-error', url, transactionId, error.message);
        throw new Error(error.message);
    }
});
exports.generateTransactionId = () => {
    return `${lodash_1.default.random(1e10).toString()}-${lodash_1.default.random(1e10).toString()}-${Date.now()}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9IZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUI7QUFFdkIsaUNBQWtEO0FBRXJDLFFBQUEsU0FBUyxHQUFHLENBQU8sU0FBMkIsRUFBRSxLQUFhLEVBQUUsSUFBUyxFQUFpQixFQUFFO0lBQ3RHLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQzFCLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztBQUNKLENBQUMsQ0FBQSxDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQUcsQ0FBTyxTQUEyQixFQUFFLElBQVksRUFBRSxJQUFTLEVBQWlCLEVBQUU7SUFDcEcsTUFBTSxLQUFLLEdBQUcsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbkUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ25CLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztBQUNKLENBQUMsQ0FBQSxDQUFDO0FBRVcsUUFBQSxPQUFPLEdBQUcsQ0FBVSxTQUEyQixFQUFFLEdBQVcsRUFBRSxJQUFTLEVBQUUsZ0JBQXdCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFjLEVBQUU7SUFDeEosU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN6RCxJQUFJO1FBQ0YsTUFBTSxRQUFRLEdBQXVCLE1BQU0sV0FBSSxDQUM3QyxHQUFHLEVBQ0g7WUFDRSxhQUFhO1lBQ2IsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUNGLENBQUM7UUFFRixJQUFJLFFBQVEsQ0FBQyxhQUFhLEtBQUssYUFBYSxFQUFFO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUMxQztRQUNELElBQUksQ0FBQyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDakM7UUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7S0FDdEI7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9FLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hDO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHLEdBQVcsRUFBRTtJQUNoRCxPQUFPLEdBQUcsZ0JBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksZ0JBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDbkYsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLic7XG5pbXBvcnQgeyBwb3N0LCBSUENSZXNwb25zZVBheWxvYWQgfSBmcm9tICcuL3JwY3MnO1xuXG5leHBvcnQgY29uc3QgZW1pdEV2ZW50ID0gYXN5bmMgKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgdG9waWM6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIHJldHVybiByZXNvdXJjZXMucmFiYml0LmVtaXQoXG4gICAgdG9waWMsXG4gICAgZGF0YSxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbWl0VGFzayA9IGFzeW5jIChyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIHRhc2s6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IHRvcGljID0gYCR7cmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5zZXJ2aWNlfS4ke3Rhc2t9YDtcbiAgcmVzb3VyY2VzLnJhYmJpdC5lbWl0KFxuICAgIHRvcGljLFxuICAgIGRhdGEsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsbFJQQyA9IGFzeW5jIDxUPihyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIHVybDogc3RyaW5nLCBkYXRhOiBhbnksIHRyYW5zYWN0aW9uSWQ6IHN0cmluZyA9IHRoaXMuZ2VuZXJhdGVUcmFuc2FjdGlvbklkKCkpOiBQcm9taXNlPFQ+ID0+IHtcbiAgcmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUEMtY2FsbGluZycsIHVybCwgdHJhbnNhY3Rpb25JZCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2U6IFJQQ1Jlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHBvc3QoXG4gICAgICB1cmwsXG4gICAgICB7XG4gICAgICAgIHRyYW5zYWN0aW9uSWQsXG4gICAgICAgIHBheWxvYWQ6IGRhdGEsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAocmVzcG9uc2UudHJhbnNhY3Rpb25JZCAhPT0gdHJhbnNhY3Rpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRyYW5zYWN0aW9uSWQnKTtcbiAgICB9XG4gICAgaWYgKCFfLmlzTmlsKHJlc3BvbnNlLmVycm9yKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLmVycm9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXNvdXJjZXMubG9nZ2VyLmVycm9yKCdSUEMtY2FsbGluZy1lcnJvcicsIHVybCwgdHJhbnNhY3Rpb25JZCwgZXJyb3IubWVzc2FnZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVUcmFuc2FjdGlvbklkID0gKCk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBgJHtfLnJhbmRvbSgxZTEwKS50b1N0cmluZygpfS0ke18ucmFuZG9tKDFlMTApLnRvU3RyaW5nKCl9LSR7RGF0ZS5ub3coKX1gO1xufTtcbiJdfQ==