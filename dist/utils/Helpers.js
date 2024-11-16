"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = exports.callRPC = exports.emitTask = exports.emitEvent = void 0;
const lodash_1 = __importDefault(require("lodash"));
const rpcs_1 = require("./rpcs");
const emitEvent = (resources, topic, data) => __awaiter(void 0, void 0, void 0, function* () {
    return resources.rabbit.emit(topic, data);
});
exports.emitEvent = emitEvent;
const emitTask = (resources, task, data) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = `${resources.configuration.service.service}.${task}`;
    resources.rabbit.emit(topic, data);
});
exports.emitTask = emitTask;
const callRPC = (resources_1, url_1, data_1, ...args_1) => __awaiter(void 0, [resources_1, url_1, data_1, ...args_1], void 0, function* (resources, url, data, transactionId = (0, exports.generateTransactionId)()) {
    resources.logger.info('RPC-calling', url, transactionId);
    try {
        const response = yield (0, rpcs_1.post)(url, {
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
exports.callRPC = callRPC;
const generateTransactionId = () => {
    return `${lodash_1.default.random(1e10).toString()}-${lodash_1.default.random(1e10).toString()}-${Date.now()}`;
};
exports.generateTransactionId = generateTransactionId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9IZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUF1QjtBQUV2QixpQ0FBa0Q7QUFFM0MsTUFBTSxTQUFTLEdBQUcsQ0FBTyxTQUEyQixFQUFFLEtBQWEsRUFBRSxJQUFTLEVBQWlCLEVBQUU7SUFDdEcsT0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDMUIsS0FBSyxFQUNMLElBQUksQ0FDTCxDQUFDO0FBQ0osQ0FBQyxDQUFBLENBQUM7QUFMVyxRQUFBLFNBQVMsYUFLcEI7QUFFSyxNQUFNLFFBQVEsR0FBRyxDQUFPLFNBQTJCLEVBQUUsSUFBWSxFQUFFLElBQVMsRUFBaUIsRUFBRTtJQUNwRyxNQUFNLEtBQUssR0FBRyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNuRSxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDbkIsS0FBSyxFQUNMLElBQUksQ0FDTCxDQUFDO0FBQ0osQ0FBQyxDQUFBLENBQUM7QUFOVyxRQUFBLFFBQVEsWUFNbkI7QUFFSyxNQUFNLE9BQU8sR0FBRyx3Q0FBNEgsRUFBRSwrRUFBcEgsU0FBMkIsRUFBRSxHQUFXLEVBQUUsSUFBUyxFQUFFLGdCQUF3QixJQUFBLDZCQUFxQixHQUFFO0lBQ25JLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDekQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQXVCLE1BQU0sSUFBQSxXQUFJLEVBQzdDLEdBQUcsRUFDSDtZQUNFLGFBQWE7WUFDYixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQ0YsQ0FBQztRQUVGLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxhQUFhLEVBQUUsQ0FBQztZQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUNELElBQUksQ0FBQyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsQ0FBQztBQUNILENBQUMsQ0FBQSxDQUFDO0FBdkJXLFFBQUEsT0FBTyxXQXVCbEI7QUFFSyxNQUFNLHFCQUFxQixHQUFHLEdBQVcsRUFBRTtJQUNoRCxPQUFPLEdBQUcsZ0JBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksZ0JBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7QUFDbkYsQ0FBQyxDQUFDO0FBRlcsUUFBQSxxQkFBcUIseUJBRWhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLic7XG5pbXBvcnQgeyBwb3N0LCBSUENSZXNwb25zZVBheWxvYWQgfSBmcm9tICcuL3JwY3MnO1xuXG5leHBvcnQgY29uc3QgZW1pdEV2ZW50ID0gYXN5bmMgKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgdG9waWM6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIHJldHVybiByZXNvdXJjZXMucmFiYml0LmVtaXQoXG4gICAgdG9waWMsXG4gICAgZGF0YSxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBlbWl0VGFzayA9IGFzeW5jIChyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIHRhc2s6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IHRvcGljID0gYCR7cmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5zZXJ2aWNlfS4ke3Rhc2t9YDtcbiAgcmVzb3VyY2VzLnJhYmJpdC5lbWl0KFxuICAgIHRvcGljLFxuICAgIGRhdGEsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgY2FsbFJQQyA9IGFzeW5jIDxUPihyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIHVybDogc3RyaW5nLCBkYXRhOiBhbnksIHRyYW5zYWN0aW9uSWQ6IHN0cmluZyA9IGdlbmVyYXRlVHJhbnNhY3Rpb25JZCgpKTogUHJvbWlzZTxUPiA9PiB7XG4gIHJlc291cmNlcy5sb2dnZXIuaW5mbygnUlBDLWNhbGxpbmcnLCB1cmwsIHRyYW5zYWN0aW9uSWQpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlOiBSUENSZXNwb25zZVBheWxvYWQgPSBhd2FpdCBwb3N0KFxuICAgICAgdXJsLFxuICAgICAge1xuICAgICAgICB0cmFuc2FjdGlvbklkLFxuICAgICAgICBwYXlsb2FkOiBkYXRhLFxuICAgICAgfSxcbiAgICApO1xuXG4gICAgaWYgKHJlc3BvbnNlLnRyYW5zYWN0aW9uSWQgIT09IHRyYW5zYWN0aW9uSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0cmFuc2FjdGlvbklkJyk7XG4gICAgfVxuICAgIGlmICghXy5pc05pbChyZXNwb25zZS5lcnJvcikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihyZXNwb25zZS5lcnJvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcignUlBDLWNhbGxpbmctZXJyb3InLCB1cmwsIHRyYW5zYWN0aW9uSWQsIGVycm9yLm1lc3NhZ2UpO1xuICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGdlbmVyYXRlVHJhbnNhY3Rpb25JZCA9ICgpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gYCR7Xy5yYW5kb20oMWUxMCkudG9TdHJpbmcoKX0tJHtfLnJhbmRvbSgxZTEwKS50b1N0cmluZygpfS0ke0RhdGUubm93KCl9YDtcbn07XG4iXX0=