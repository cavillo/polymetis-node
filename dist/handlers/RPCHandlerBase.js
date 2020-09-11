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
        throw http_errors_1.default.createError(statusCode, message);
    }
}
exports.default = RPCHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlBDSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFuZGxlcnMvUlBDSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLG9EQUF1QjtBQUN2Qiw4REFBcUM7QUFFckMsd0JBQXdCO0FBQ3hCLGtEQUEwQjtBQUUxQixNQUE4QixjQUFlLFNBQVEsY0FBSTtJQUd2RDs7OztNQUlFO0lBQ1csYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUNwRCxJQUFJO2dCQUNGLE1BQU0sYUFBYSxHQUFXLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBQy9ELE1BQU0sT0FBTyxHQUFRLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUVwRCxJQUNNLGdCQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQUMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO3VCQUNwRCxnQkFBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUM1QztvQkFDQSxNQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQ25DO2dCQUVELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFFdkUsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQy9ELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3ZEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQztLQUFBO0lBV1MsYUFBYSxDQUFDLGFBQXFCLEVBQUUsSUFBUyxFQUFFLEdBQWE7UUFDckUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsYUFBYTtZQUNiLElBQUk7U0FDTCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRVMsV0FBVyxDQUFDLEtBQVksRUFBRSxHQUFZLEVBQUUsR0FBYTtRQUM3RCxNQUFNLE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sYUFBYSxHQUFXLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFL0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVTLFVBQVUsQ0FBQyxVQUFrQixFQUFFLE9BQWU7UUFDdEQsTUFBTSxxQkFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNGO0FBekRELGlDQXlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgSHR0cEVycm9ycyBmcm9tICdodHRwLWVycm9ycyc7XG5cbi8vIGludGVybmFsIGRlcGVuZGVuY2llc1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgUlBDSGFuZGxlckJhc2UgZXh0ZW5kcyBCYXNlIHtcbiAgcHVibGljIHByb2NlZHVyZTogc3RyaW5nO1xuXG4gIC8qXG4gIFBhcmVudCBtZXRob2QgdGhhdCB3cmFwcyB0aGUgbG9naWMgaW1wbGVtZW50YXRpb25cbiAgY2FsbGJhY2sgbWV0aG9kIGluIGEgdHJ5IGNhdGNoIGZvciBkZXRlY3RpbmcgZXJyb3JzXG4gIGFuZCByZXNwb25kaW5nIHdpdGggdGhlIHJpZ2h0IGNvZGVzIGFuZCBtZXNzYWdlcy5cbiAgKi9cbiAgcHVibGljIGFzeW5jIHJvdXRlQ2FsbGJhY2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdHJhbnNhY3Rpb25JZDogc3RyaW5nID0gXy5nZXQocmVxLmJvZHksICd0cmFuc2FjdGlvbklkJyk7XG4gICAgICBjb25zdCBwYXlsb2FkOiBhbnkgPSBfLmdldChyZXEuYm9keSwgJ3BheWxvYWQnLCB7fSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgICAgIF8uaXNOaWwodHJhbnNhY3Rpb25JZCkgfHwgIV8uaXNTdHJpbmcodHJhbnNhY3Rpb25JZClcbiAgICAgICAgfHwgIF8uaXNOaWwocGF5bG9hZCkgfHwgIV8uaXNPYmplY3QocGF5bG9hZClcbiAgICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcGFyYW1zJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUEMtc3RhcnQnLCB0aGlzLnByb2NlZHVyZSwgdHJhbnNhY3Rpb25JZCk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY2FsbGJhY2soeyB0cmFuc2FjdGlvbklkLCBwYXlsb2FkIH0pO1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU3VjY2Vzcyh0cmFuc2FjdGlvbklkLCByZXN1bHQsIHJlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIHJlcSwgcmVzKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICBNZXRob2QgdG8gaW1wbGVtZW50IHdoZW4gYWRkaW5nIGFuIGVuZHBvaW50LlxuICBFYWNoIFJvdXRlSW1wbCBzaG91bGQgcGxhY2UgdGhlIGxvZ2ljIG9mIHRoZVxuICBFeHByZXNzSlMgY2FsbGJhY2sgbWV0aG9kcyBpbiBoZXJlLiBUaGUgaGFuZGxpbmdcbiAgb2YgZXJyb3JzIGFuZCBjaGVja2luZyBmb3IgYXV0aGVudGljYXRpb24gdG9rZW4sXG4gIGhhcyBiZWVuIGFic3RyYWN0ZWQgdG8gdGhlIFJvdXRlIGJhc2UgY2xhc3MuXG4gICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBjYWxsYmFjayhkYXRhOiB7IHRyYW5zYWN0aW9uSWQ6IHN0cmluZywgcGF5bG9hZDogYW55IH0pOiBQcm9taXNlPGFueT47XG5cbiAgcHJvdGVjdGVkIGhhbmRsZVN1Y2Nlc3ModHJhbnNhY3Rpb25JZDogc3RyaW5nLCBkYXRhOiBhbnksIHJlczogUmVzcG9uc2UpIHtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnUlBDLXN1Y2Nlc3MnLCB0aGlzLnByb2NlZHVyZSwgdHJhbnNhY3Rpb25JZCk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHtcbiAgICAgIHRyYW5zYWN0aW9uSWQsXG4gICAgICBkYXRhLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGhhbmRsZUVycm9yKGVycm9yOiBFcnJvciwgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IF8uZ2V0KGVycm9yLCAnbWVzc2FnZScsICdVbmtub3duIGVycm9yJyk7XG4gICAgY29uc3QgdHJhbnNhY3Rpb25JZDogc3RyaW5nID0gXy5nZXQocmVxLmJvZHksICd0cmFuc2FjdGlvbklkJyk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoJ1JQQy1lcnJvcicsIHRoaXMucHJvY2VkdXJlLCB0cmFuc2FjdGlvbklkLCBtZXNzYWdlKTtcbiAgICByZXR1cm4gcmVzLmpzb24oeyB0cmFuc2FjdGlvbklkLCBlcnJvcjogbWVzc2FnZSB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0aHJvd0Vycm9yKHN0YXR1c0NvZGU6IG51bWJlciwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhyb3cgSHR0cEVycm9ycy5jcmVhdGVFcnJvcihzdGF0dXNDb2RlLCBtZXNzYWdlKTtcbiAgfVxufVxuIl19