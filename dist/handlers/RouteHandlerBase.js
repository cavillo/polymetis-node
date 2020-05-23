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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9Sb3V0ZUhhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQTRCO0FBRTVCLHdCQUF3QjtBQUN4QixrREFBMEI7QUFHMUIsTUFBOEIsU0FBVSxTQUFRLGNBQUk7SUFJbEQ7Ozs7TUFJRTtJQUNXLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTs7WUFDcEQsSUFBSTtnQkFDRixPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDdEM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO1FBQ0gsQ0FBQztLQUFBO0lBV2UsV0FBVyxDQUFDLEtBQVksRUFBRSxHQUFhOztZQUNyRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDekQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtDQUNGO0FBakNELDRCQWlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuLy8gaW50ZXJuYWwgZGVwZW5kZW5jaWVzXG5pbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuXG5leHBvcnQgdHlwZSBSb3V0ZUJhc2VUcnVzdGVkTWV0aG9kcyA9ICdnZXQnIHwgJ2RlbGV0ZScgfCAncHV0JyB8ICdwb3N0JztcbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFJvdXRlQmFzZSBleHRlbmRzIEJhc2Uge1xuICBwdWJsaWMgbWV0aG9kOiBSb3V0ZUJhc2VUcnVzdGVkTWV0aG9kcztcbiAgcHVibGljIHVybDogc3RyaW5nO1xuXG4gIC8qXG4gIFBhcmVudCBtZXRob2QgdGhhdCB3cmFwcyB0aGUgbG9naWMgaW1wbGVtZW50YXRpb25cbiAgY2FsbGJhY2sgbWV0aG9kIGluIGEgdHJ5IGNhdGNoIGZvciBkZXRlY3RpbmcgZXJyb3JzXG4gIGFuZCByZXNwb25kaW5nIHdpdGggdGhlIHJpZ2h0IGNvZGVzIGFuZCBtZXNzYWdlcy5cbiAgKi9cbiAgcHVibGljIGFzeW5jIHJvdXRlQ2FsbGJhY2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbGJhY2socmVxLCByZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZUVycm9yKGVycm9yLCByZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIE1ldGhvZCB0byBpbXBsZW1lbnQgd2hlbiBhZGRpbmcgYW4gZW5kcG9pbnQuXG4gIEVhY2ggUm91dGVJbXBsIHNob3VsZCBwbGFjZSB0aGUgbG9naWMgb2YgdGhlXG4gIEV4cHJlc3NKUyBjYWxsYmFjayBtZXRob2RzIGluIGhlcmUuIFRoZSBoYW5kbGluZ1xuICBvZiBlcnJvcnMgYW5kIGNoZWNraW5nIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbixcbiAgaGFzIGJlbm4gYWJzdHJhY3RlZCB0byB0aGUgUm91dGUgYmFzZSBjbGFzcy5cbiAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PjtcblxuICBwcm90ZWN0ZWQgYXN5bmMgaGFuZGxlRXJyb3IoZXJyb3I6IEVycm9yLCByZXM6IFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IF8uZ2V0KGVycm9yLCAnbWVzc2FnZScsICdVbmtub3duIGVycm9yJyk7XG4gICAgY29uc3Qgc3RhdHVzQ29kZSA9IF8uZ2V0KGVycm9yLCAnc3RhdHVzQ29kZScsIDUwMCk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3Ioc3RhdHVzQ29kZSwgbWVzc2FnZSwgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyhzdGF0dXNDb2RlKS5zZW5kKG1lc3NhZ2UpO1xuICB9XG59Il19