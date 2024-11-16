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
        throw (0, http_errors_1.default)(statusCode, message);
    }
}
exports.default = RouteBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9Sb3V0ZUhhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esb0RBQXVCO0FBQ3ZCLDhEQUFxQztBQUVyQyx3QkFBd0I7QUFDeEIsa0RBQTBCO0FBRzFCLE1BQThCLFNBQVUsU0FBUSxjQUFJO0lBSWxEOzs7O01BSUU7SUFDVyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ3BELElBQUksQ0FBQztnQkFDSCxPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQztZQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNILENBQUM7S0FBQTtJQVdTLFdBQVcsQ0FBQyxLQUFZLEVBQUUsR0FBYTtRQUMvQyxNQUFNLE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sVUFBVSxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzFGLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVTLFVBQVUsQ0FBQyxVQUFrQixFQUFFLE9BQWU7UUFDdEQsTUFBTSxJQUFBLHFCQUFVLEVBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDRjtBQXJDRCw0QkFxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IEh0dHBFcnJvcnMgZnJvbSAnaHR0cC1lcnJvcnMnO1xuXG4vLyBpbnRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5cbmV4cG9ydCB0eXBlIFJvdXRlQmFzZVRydXN0ZWRNZXRob2RzID0gJ2dldCcgfCAnZGVsZXRlJyB8ICdwdXQnIHwgJ3Bvc3QnO1xuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgUm91dGVCYXNlIGV4dGVuZHMgQmFzZSB7XG4gIHB1YmxpYyBtZXRob2Q6IFJvdXRlQmFzZVRydXN0ZWRNZXRob2RzO1xuICBwdWJsaWMgdXJsOiBzdHJpbmc7XG5cbiAgLypcbiAgUGFyZW50IG1ldGhvZCB0aGF0IHdyYXBzIHRoZSBsb2dpYyBpbXBsZW1lbnRhdGlvblxuICBjYWxsYmFjayBtZXRob2QgaW4gYSB0cnkgY2F0Y2ggZm9yIGRldGVjdGluZyBlcnJvcnNcbiAgYW5kIHJlc3BvbmRpbmcgd2l0aCB0aGUgcmlnaHQgY29kZXMgYW5kIG1lc3NhZ2VzLlxuICAqL1xuICBwdWJsaWMgYXN5bmMgcm91dGVDYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5jYWxsYmFjayhyZXEsIHJlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgTWV0aG9kIHRvIGltcGxlbWVudCB3aGVuIGFkZGluZyBhbiBlbmRwb2ludC5cbiAgRWFjaCBSb3V0ZUltcGwgc2hvdWxkIHBsYWNlIHRoZSBsb2dpYyBvZiB0aGVcbiAgRXhwcmVzc0pTIGNhbGxiYWNrIG1ldGhvZHMgaW4gaGVyZS4gVGhlIGhhbmRsaW5nXG4gIG9mIGVycm9ycyBhbmQgY2hlY2tpbmcgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuLFxuICBoYXMgYmVlbiBhYnN0cmFjdGVkIHRvIHRoZSBSb3V0ZSBiYXNlIGNsYXNzLlxuICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgY2FsbGJhY2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTxhbnk+O1xuXG4gIHByb3RlY3RlZCBoYW5kbGVFcnJvcihlcnJvcjogRXJyb3IsIHJlczogUmVzcG9uc2UpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gXy5nZXQoZXJyb3IsICdtZXNzYWdlJywgJ1Vua25vd24gZXJyb3InKTtcbiAgICBjb25zdCBzdGF0dXNDb2RlID0gXy5nZXQoZXJyb3IsICdzdGF0dXNDb2RlJywgNTAwKTtcblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcignQVBJUm91dGUgRXJyb3InLCBzdGF0dXNDb2RlLCBtZXNzYWdlLCBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKHN0YXR1c0NvZGUpLnNlbmQobWVzc2FnZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgdGhyb3dFcnJvcihzdGF0dXNDb2RlOiBudW1iZXIsIG1lc3NhZ2U6IHN0cmluZykge1xuICAgIHRocm93IEh0dHBFcnJvcnMoc3RhdHVzQ29kZSwgbWVzc2FnZSk7XG4gIH1cbn1cbiJdfQ==