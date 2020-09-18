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
class RouteBase extends Base_1.default {
    /*
    Parent method that wraps the logic implementation
    callback method in a try catch for detecting errors
    and responding with the right codes and messages.
    */
    routeCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.callback(req, res);
            }
            catch (error) {
                this.handleError(error, res);
            }
        });
    }
    handleError(error, res) {
        const message = lodash_1.default.get(error, 'message', 'Unknown error');
        const statusCode = lodash_1.default.get(error, 'statusCode', 500);
        this.resources.logger.error('APIRoute Error', statusCode, message, JSON.stringify(error));
        return res.status(statusCode).send(message);
    }
    throwError(statusCode, message) {
        throw http_errors_1.default(statusCode, message);
    }
}
exports.default = RouteBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9Sb3V0ZUhhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxvREFBdUI7QUFDdkIsOERBQXFDO0FBRXJDLHdCQUF3QjtBQUN4QixrREFBMEI7QUFHMUIsTUFBOEIsU0FBVSxTQUFRLGNBQUk7SUFJbEQ7Ozs7TUFJRTtJQUNXLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTs7WUFDcEQsSUFBSTtnQkFDRixPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDdEM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzthQUM5QjtRQUNILENBQUM7S0FBQTtJQVdTLFdBQVcsQ0FBQyxLQUFZLEVBQUUsR0FBYTtRQUMvQyxNQUFNLE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sVUFBVSxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzFGLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVTLFVBQVUsQ0FBQyxVQUFrQixFQUFFLE9BQWU7UUFDdEQsTUFBTSxxQkFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4QyxDQUFDO0NBQ0Y7QUFyQ0QsNEJBcUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIdHRwRXJyb3JzIGZyb20gJ2h0dHAtZXJyb3JzJztcblxuLy8gaW50ZXJuYWwgZGVwZW5kZW5jaWVzXG5pbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuXG5leHBvcnQgdHlwZSBSb3V0ZUJhc2VUcnVzdGVkTWV0aG9kcyA9ICdnZXQnIHwgJ2RlbGV0ZScgfCAncHV0JyB8ICdwb3N0JztcbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFJvdXRlQmFzZSBleHRlbmRzIEJhc2Uge1xuICBwdWJsaWMgbWV0aG9kOiBSb3V0ZUJhc2VUcnVzdGVkTWV0aG9kcztcbiAgcHVibGljIHVybDogc3RyaW5nO1xuXG4gIC8qXG4gIFBhcmVudCBtZXRob2QgdGhhdCB3cmFwcyB0aGUgbG9naWMgaW1wbGVtZW50YXRpb25cbiAgY2FsbGJhY2sgbWV0aG9kIGluIGEgdHJ5IGNhdGNoIGZvciBkZXRlY3RpbmcgZXJyb3JzXG4gIGFuZCByZXNwb25kaW5nIHdpdGggdGhlIHJpZ2h0IGNvZGVzIGFuZCBtZXNzYWdlcy5cbiAgKi9cbiAgcHVibGljIGFzeW5jIHJvdXRlQ2FsbGJhY2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbGJhY2socmVxLCByZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCByZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIE1ldGhvZCB0byBpbXBsZW1lbnQgd2hlbiBhZGRpbmcgYW4gZW5kcG9pbnQuXG4gIEVhY2ggUm91dGVJbXBsIHNob3VsZCBwbGFjZSB0aGUgbG9naWMgb2YgdGhlXG4gIEV4cHJlc3NKUyBjYWxsYmFjayBtZXRob2RzIGluIGhlcmUuIFRoZSBoYW5kbGluZ1xuICBvZiBlcnJvcnMgYW5kIGNoZWNraW5nIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbixcbiAgaGFzIGJlZW4gYWJzdHJhY3RlZCB0byB0aGUgUm91dGUgYmFzZSBjbGFzcy5cbiAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PjtcblxuICBwcm90ZWN0ZWQgaGFuZGxlRXJyb3IoZXJyb3I6IEVycm9yLCByZXM6IFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IF8uZ2V0KGVycm9yLCAnbWVzc2FnZScsICdVbmtub3duIGVycm9yJyk7XG4gICAgY29uc3Qgc3RhdHVzQ29kZSA9IF8uZ2V0KGVycm9yLCAnc3RhdHVzQ29kZScsIDUwMCk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoJ0FQSVJvdXRlIEVycm9yJywgc3RhdHVzQ29kZSwgbWVzc2FnZSwgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyhzdGF0dXNDb2RlKS5zZW5kKG1lc3NhZ2UpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHRocm93RXJyb3Ioc3RhdHVzQ29kZTogbnVtYmVyLCBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aHJvdyBIdHRwRXJyb3JzKHN0YXR1c0NvZGUsIG1lc3NhZ2UpO1xuICB9XG59XG4iXX0=