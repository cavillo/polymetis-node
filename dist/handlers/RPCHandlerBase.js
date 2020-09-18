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
const http_errors_1 = __importDefault(require("http-errors"));
// internal dependencies
const Base_1 = __importDefault(require("./Base"));
class RPCHandlerBase extends Base_1.default {
    /*
    Parent method that wraps the logic implementation
    callback method in a try catch for detecting errors
    and responding with the right codes and messages.
    */
    routeCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionId = lodash_1.default.get(req.body, 'transactionId');
                const payload = lodash_1.default.get(req.body, 'payload', {});
                if (lodash_1.default.isNil(transactionId) || !lodash_1.default.isString(transactionId)
                    || lodash_1.default.isNil(payload) || !lodash_1.default.isObject(payload)) {
                    throw new Error('Invalid params');
                }
                this.resources.logger.info('RPC-start', this.procedure, transactionId);
                const result = yield this.callback({ transactionId, payload });
                return this.handleSuccess(transactionId, result, res);
            }
            catch (error) {
                this.handleError(error, req, res);
            }
        });
    }
    handleSuccess(transactionId, data, res) {
        this.resources.logger.info('RPC-success', this.procedure, transactionId);
        return res.status(200).send({
            transactionId,
            data,
        });
    }
    handleError(error, req, res) {
        const message = lodash_1.default.get(error, 'message', 'Unknown error');
        const transactionId = lodash_1.default.get(req.body, 'transactionId');
        this.resources.logger.error('RPC-error', this.procedure, transactionId, message);
        return res.json({ transactionId, error: message });
    }
    throwError(statusCode, message) {
        throw http_errors_1.default(statusCode, message);
    }
}
exports.default = RPCHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlBDSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFuZGxlcnMvUlBDSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLG9EQUF1QjtBQUN2Qiw4REFBcUM7QUFFckMsd0JBQXdCO0FBQ3hCLGtEQUEwQjtBQUUxQixNQUE4QixjQUFlLFNBQVEsY0FBSTtJQUd2RDs7OztNQUlFO0lBQ1csYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUNwRCxJQUFJO2dCQUNGLE1BQU0sYUFBYSxHQUFXLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQy9ELE1BQU0sT0FBTyxHQUFRLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVwRCxJQUNNLGdCQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO3VCQUNwRCxnQkFBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUM1QztvQkFDQSxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQ25DO2dCQUVELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFFdkUsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQztLQUFBO0lBV1MsYUFBYSxDQUFDLGFBQXFCLEVBQUUsSUFBUyxFQUFFLEdBQWE7UUFDckUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsYUFBYTtZQUNiLElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRVMsV0FBVyxDQUFDLEtBQVksRUFBRSxHQUFZLEVBQUUsR0FBYTtRQUM3RCxNQUFNLE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sYUFBYSxHQUFXLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFL0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVTLFVBQVUsQ0FBQyxVQUFrQixFQUFFLE9BQWU7UUFDdEQsTUFBTSxxQkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0Y7QUF6REQsaUNBeURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIdHRwRXJyb3JzIGZyb20gJ2h0dHAtZXJyb3JzJztcblxuLy8gaW50ZXJuYWwgZGVwZW5kZW5jaWVzXG5pbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBSUENIYW5kbGVyQmFzZSBleHRlbmRzIEJhc2Uge1xuICBwdWJsaWMgcHJvY2VkdXJlOiBzdHJpbmc7XG5cbiAgLypcbiAgUGFyZW50IG1ldGhvZCB0aGF0IHdyYXBzIHRoZSBsb2dpYyBpbXBsZW1lbnRhdGlvblxuICBjYWxsYmFjayBtZXRob2QgaW4gYSB0cnkgY2F0Y2ggZm9yIGRldGVjdGluZyBlcnJvcnNcbiAgYW5kIHJlc3BvbmRpbmcgd2l0aCB0aGUgcmlnaHQgY29kZXMgYW5kIG1lc3NhZ2VzLlxuICAqL1xuICBwdWJsaWMgYXN5bmMgcm91dGVDYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0cmFuc2FjdGlvbklkOiBzdHJpbmcgPSBfLmdldChyZXEuYm9keSwgJ3RyYW5zYWN0aW9uSWQnKTtcbiAgICAgIGNvbnN0IHBheWxvYWQ6IGFueSA9IF8uZ2V0KHJlcS5ib2R5LCAncGF5bG9hZCcsIHt9KTtcblxuICAgICAgaWYgKFxuICAgICAgICAgICAgXy5pc05pbCh0cmFuc2FjdGlvbklkKSB8fCAhXy5pc1N0cmluZyh0cmFuc2FjdGlvbklkKVxuICAgICAgICB8fCAgXy5pc05pbChwYXlsb2FkKSB8fCAhXy5pc09iamVjdChwYXlsb2FkKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXJhbXMnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ1JQQy1zdGFydCcsIHRoaXMucHJvY2VkdXJlLCB0cmFuc2FjdGlvbklkKTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jYWxsYmFjayh7IHRyYW5zYWN0aW9uSWQsIHBheWxvYWQgfSk7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVTdWNjZXNzKHRyYW5zYWN0aW9uSWQsIHJlc3VsdCwgcmVzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvciwgcmVxLCByZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIE1ldGhvZCB0byBpbXBsZW1lbnQgd2hlbiBhZGRpbmcgYW4gZW5kcG9pbnQuXG4gIEVhY2ggUm91dGVJbXBsIHNob3VsZCBwbGFjZSB0aGUgbG9naWMgb2YgdGhlXG4gIEV4cHJlc3NKUyBjYWxsYmFjayBtZXRob2RzIGluIGhlcmUuIFRoZSBoYW5kbGluZ1xuICBvZiBlcnJvcnMgYW5kIGNoZWNraW5nIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbixcbiAgaGFzIGJlZW4gYWJzdHJhY3RlZCB0byB0aGUgUm91dGUgYmFzZSBjbGFzcy5cbiAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGNhbGxiYWNrKGRhdGE6IHsgdHJhbnNhY3Rpb25JZDogc3RyaW5nLCBwYXlsb2FkOiBhbnkgfSk6IFByb21pc2U8YW55PjtcblxuICBwcm90ZWN0ZWQgaGFuZGxlU3VjY2Vzcyh0cmFuc2FjdGlvbklkOiBzdHJpbmcsIGRhdGE6IGFueSwgcmVzOiBSZXNwb25zZSkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUEMtc3VjY2VzcycsIHRoaXMucHJvY2VkdXJlLCB0cmFuc2FjdGlvbklkKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLnNlbmQoe1xuICAgICAgdHJhbnNhY3Rpb25JZCxcbiAgICAgIGRhdGEsXG4gICAgfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IoZXJyb3I6IEVycm9yLCByZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gXy5nZXQoZXJyb3IsICdtZXNzYWdlJywgJ1Vua25vd24gZXJyb3InKTtcbiAgICBjb25zdCB0cmFuc2FjdGlvbklkOiBzdHJpbmcgPSBfLmdldChyZXEuYm9keSwgJ3RyYW5zYWN0aW9uSWQnKTtcblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcignUlBDLWVycm9yJywgdGhpcy5wcm9jZWR1cmUsIHRyYW5zYWN0aW9uSWQsIG1lc3NhZ2UpO1xuICAgIHJldHVybiByZXMuanNvbih7IHRyYW5zYWN0aW9uSWQsIGVycm9yOiBtZXNzYWdlIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRocm93RXJyb3Ioc3RhdHVzQ29kZTogbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aHJvdyBIdHRwRXJyb3JzKHN0YXR1c0NvZGUsIG1lc3NhZ2UpO1xuICB9XG59XG4iXX0=