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
    throwError(statusCode, message) {
        throw {
            message,
            statusCode,
        };
    }
}
exports.default = RouteBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9Sb3V0ZUhhbmRsZXJCYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQTRCO0FBRTVCLHdCQUF3QjtBQUN4QixrREFBMEI7QUFHMUIsTUFBOEIsU0FBVSxTQUFRLGNBQUk7SUFJbEQ7Ozs7TUFJRTtJQUNXLGFBQWEsQ0FBQyxHQUFZLEVBQUUsR0FBYTs7WUFDcEQsSUFBSTtnQkFDRixPQUFPLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDdEM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3BDO1FBQ0gsQ0FBQztLQUFBO0lBV2UsV0FBVyxDQUFDLEtBQVksRUFBRSxHQUFhOztZQUNyRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDekQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtJQUVTLFVBQVUsQ0FBQyxVQUFrQixFQUFFLE9BQWU7UUFDdEQsTUFBTTtZQUNKLE9BQU87WUFDUCxVQUFVO1NBQ1gsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXhDRCw0QkF3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8vIGludGVybmFsIGRlcGVuZGVuY2llc1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcblxuZXhwb3J0IHR5cGUgUm91dGVCYXNlVHJ1c3RlZE1ldGhvZHMgPSAnZ2V0JyB8ICdkZWxldGUnIHwgJ3B1dCcgfCAncG9zdCc7XG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBSb3V0ZUJhc2UgZXh0ZW5kcyBCYXNlIHtcbiAgcHVibGljIG1ldGhvZDogUm91dGVCYXNlVHJ1c3RlZE1ldGhvZHM7XG4gIHB1YmxpYyB1cmw6IHN0cmluZztcblxuICAvKlxuICBQYXJlbnQgbWV0aG9kIHRoYXQgd3JhcHMgdGhlIGxvZ2ljIGltcGxlbWVudGF0aW9uXG4gIGNhbGxiYWNrIG1ldGhvZCBpbiBhIHRyeSBjYXRjaCBmb3IgZGV0ZWN0aW5nIGVycm9yc1xuICBhbmQgcmVzcG9uZGluZyB3aXRoIHRoZSByaWdodCBjb2RlcyBhbmQgbWVzc2FnZXMuXG4gICovXG4gIHB1YmxpYyBhc3luYyByb3V0ZUNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNhbGxiYWNrKHJlcSwgcmVzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYXdhaXQgdGhpcy5oYW5kbGVFcnJvcihlcnJvciwgcmVzKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICBNZXRob2QgdG8gaW1wbGVtZW50IHdoZW4gYWRkaW5nIGFuIGVuZHBvaW50LlxuICBFYWNoIFJvdXRlSW1wbCBzaG91bGQgcGxhY2UgdGhlIGxvZ2ljIG9mIHRoZVxuICBFeHByZXNzSlMgY2FsbGJhY2sgbWV0aG9kcyBpbiBoZXJlLiBUaGUgaGFuZGxpbmdcbiAgb2YgZXJyb3JzIGFuZCBjaGVja2luZyBmb3IgYXV0aGVudGljYXRpb24gdG9rZW4sXG4gIGhhcyBiZW5uIGFic3RyYWN0ZWQgdG8gdGhlIFJvdXRlIGJhc2UgY2xhc3MuXG4gICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBjYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT47XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGhhbmRsZUVycm9yKGVycm9yOiBFcnJvciwgcmVzOiBSZXNwb25zZSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBfLmdldChlcnJvciwgJ21lc3NhZ2UnLCAnVW5rbm93biBlcnJvcicpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBfLmdldChlcnJvciwgJ3N0YXR1c0NvZGUnLCA1MDApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKHN0YXR1c0NvZGUsIG1lc3NhZ2UsIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoc3RhdHVzQ29kZSkuc2VuZChtZXNzYWdlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB0aHJvd0Vycm9yKHN0YXR1c0NvZGU6IG51bWJlciwgbWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhyb3cge1xuICAgICAgbWVzc2FnZSxcbiAgICAgIHN0YXR1c0NvZGUsXG4gICAgfTtcbiAgfVxufSJdfQ==