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
exports.callRPC = (resources, url, data, transactionId = exports.generateTransactionId()) => __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9IZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUI7QUFFdkIsaUNBQWtEO0FBRXJDLFFBQUEsU0FBUyxHQUFHLENBQU8sU0FBMkIsRUFBRSxLQUFhLEVBQUUsSUFBUyxFQUFpQixFQUFFO0lBQ3RHLE9BQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQzFCLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztBQUNKLENBQUMsQ0FBQSxDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQUcsQ0FBTyxTQUEyQixFQUFFLElBQVksRUFBRSxJQUFTLEVBQWlCLEVBQUU7SUFDcEcsTUFBTSxLQUFLLEdBQUcsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbkUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ25CLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztBQUNKLENBQUMsQ0FBQSxDQUFDO0FBRVcsUUFBQSxPQUFPLEdBQUcsQ0FBVSxTQUEyQixFQUFFLEdBQVcsRUFBRSxJQUFTLEVBQUUsZ0JBQXdCLDZCQUFxQixFQUFFLEVBQWMsRUFBRTtJQUNuSixTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3pELElBQUk7UUFDRixNQUFNLFFBQVEsR0FBdUIsTUFBTSxXQUFJLENBQzdDLEdBQUcsRUFDSDtZQUNFLGFBQWE7WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQ0YsQ0FBQztRQUVGLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxhQUFhLEVBQUU7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsSUFBSSxDQUFDLGdCQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQztRQUVELE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztLQUN0QjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDaEM7QUFDSCxDQUFDLENBQUEsQ0FBQztBQUVXLFFBQUEscUJBQXFCLEdBQUcsR0FBVyxFQUFFO0lBQ2hELE9BQU8sR0FBRyxnQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxnQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQztBQUNuRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgU2VydmljZVJlc291cmNlcyB9IGZyb20gJy4uJztcbmltcG9ydCB7IHBvc3QsIFJQQ1Jlc3BvbnNlUGF5bG9hZCB9IGZyb20gJy4vcnBjcyc7XG5cbmV4cG9ydCBjb25zdCBlbWl0RXZlbnQgPSBhc3luYyAocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzLCB0b3BpYzogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgcmV0dXJuIHJlc291cmNlcy5yYWJiaXQuZW1pdChcbiAgICB0b3BpYyxcbiAgICBkYXRhLFxuICApO1xufTtcblxuZXhwb3J0IGNvbnN0IGVtaXRUYXNrID0gYXN5bmMgKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgdGFzazogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgY29uc3QgdG9waWMgPSBgJHtyZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLnNlcnZpY2V9LiR7dGFza31gO1xuICByZXNvdXJjZXMucmFiYml0LmVtaXQoXG4gICAgdG9waWMsXG4gICAgZGF0YSxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBjYWxsUlBDID0gYXN5bmMgPFQ+KHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgdXJsOiBzdHJpbmcsIGRhdGE6IGFueSwgdHJhbnNhY3Rpb25JZDogc3RyaW5nID0gZ2VuZXJhdGVUcmFuc2FjdGlvbklkKCkpOiBQcm9taXNlPFQ+ID0+IHtcbiAgcmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUEMtY2FsbGluZycsIHVybCwgdHJhbnNhY3Rpb25JZCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2U6IFJQQ1Jlc3BvbnNlUGF5bG9hZCA9IGF3YWl0IHBvc3QoXG4gICAgICB1cmwsXG4gICAgICB7XG4gICAgICAgIHRyYW5zYWN0aW9uSWQsXG4gICAgICAgIHBheWxvYWQ6IGRhdGEsXG4gICAgICB9LFxuICAgICk7XG5cbiAgICBpZiAocmVzcG9uc2UudHJhbnNhY3Rpb25JZCAhPT0gdHJhbnNhY3Rpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRyYW5zYWN0aW9uSWQnKTtcbiAgICB9XG4gICAgaWYgKCFfLmlzTmlsKHJlc3BvbnNlLmVycm9yKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3BvbnNlLmVycm9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXNvdXJjZXMubG9nZ2VyLmVycm9yKCdSUEMtY2FsbGluZy1lcnJvcicsIHVybCwgdHJhbnNhY3Rpb25JZCwgZXJyb3IubWVzc2FnZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgZ2VuZXJhdGVUcmFuc2FjdGlvbklkID0gKCk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBgJHtfLnJhbmRvbSgxZTEwKS50b1N0cmluZygpfS0ke18ucmFuZG9tKDFlMTApLnRvU3RyaW5nKCl9LSR7RGF0ZS5ub3coKX1gO1xufTtcbiJdfQ==