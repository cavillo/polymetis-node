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
                yield this.handleError(error, res);
            }
        });
    }
    handleError(error, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = _.get(error, 'message', 'Unknown error');
            const statusCode = _.get(error, 'statusCode', 500);
            this.resources.logger.error(statusCode, message, JSON.stringify(error));
            return res.status(statusCode).send(message);
        });
    }
}
exports.default = RouteBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL1JvdXRlSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBNEI7QUFFNUIsd0JBQXdCO0FBQ3hCLGtEQUEwQjtBQUUxQixNQUE4QixTQUFVLFNBQVEsY0FBSTtJQUdsRDs7OztNQUlFO0lBQ1csYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUNwRCxJQUFJO2dCQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN0QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDcEM7UUFDSCxDQUFDO0tBQUE7SUFXZSxXQUFXLENBQUMsS0FBWSxFQUFFLEdBQWE7O1lBQ3JELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUN6RCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFbkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUFBO0NBQ0Y7QUFoQ0QsNEJBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG4vLyBpbnRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFJvdXRlQmFzZSBleHRlbmRzIEJhc2Uge1xuICBwdWJsaWMgdXJsOiBzdHJpbmc7XG5cbiAgLypcbiAgUGFyZW50IG1ldGhvZCB0aGF0IHdyYXBzIHRoZSBsb2dpYyBpbXBsZW1lbnRhdGlvblxuICBjYWxsYmFjayBtZXRob2QgaW4gYSB0cnkgY2F0Y2ggZm9yIGRldGVjdGluZyBlcnJvcnNcbiAgYW5kIHJlc3BvbmRpbmcgd2l0aCB0aGUgcmlnaHQgY29kZXMgYW5kIG1lc3NhZ2VzLlxuICAqL1xuICBwdWJsaWMgYXN5bmMgcm91dGVDYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5jYWxsYmFjayhyZXEsIHJlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGF3YWl0IHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IsIHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgTWV0aG9kIHRvIGltcGxlbWVudCB3aGVuIGFkZGluZyBhbiBlbmRwb2ludC5cbiAgRWFjaCBSb3V0ZUltcGwgc2hvdWxkIHBsYWNlIHRoZSBsb2dpYyBvZiB0aGVcbiAgRXhwcmVzc0pTIGNhbGxiYWNrIG1ldGhvZHMgaW4gaGVyZS4gVGhlIGhhbmRsaW5nXG4gIG9mIGVycm9ycyBhbmQgY2hlY2tpbmcgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuLFxuICBoYXMgYmVubiBhYnN0cmFjdGVkIHRvIHRoZSBSb3V0ZSBiYXNlIGNsYXNzLlxuICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgY2FsbGJhY2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTxhbnk+O1xuXG4gIHByb3RlY3RlZCBhc3luYyBoYW5kbGVFcnJvcihlcnJvcjogRXJyb3IsIHJlczogUmVzcG9uc2UpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gXy5nZXQoZXJyb3IsICdtZXNzYWdlJywgJ1Vua25vd24gZXJyb3InKTtcbiAgICBjb25zdCBzdGF0dXNDb2RlID0gXy5nZXQoZXJyb3IsICdzdGF0dXNDb2RlJywgNTAwKTtcblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihzdGF0dXNDb2RlLCBtZXNzYWdlLCBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgIHJldHVybiByZXMuc3RhdHVzKHN0YXR1c0NvZGUpLnNlbmQobWVzc2FnZSk7XG4gIH1cbn0iXX0=