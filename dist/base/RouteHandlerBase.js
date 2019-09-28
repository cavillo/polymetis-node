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
const _base_1 = __importDefault(require("./.base"));
class RouteBase extends _base_1.default {
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
                yield this.detectKnownErrors(error, res);
            }
        });
    }
    detectKnownErrors(error, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = _.get(error, 'message', 'Unknown error');
            const statusCode = _.get(error, 'statusCode', 500);
            this.resources.logger.error(statusCode, message, JSON.stringify(error));
            return res.status(statusCode).send(message);
        });
    }
}
exports.default = RouteBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL1JvdXRlSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBNEI7QUFFNUIsd0JBQXdCO0FBQ3hCLG9EQUEyQjtBQUUzQixNQUE4QixTQUFVLFNBQVEsZUFBSTtJQUdsRDs7OztNQUlFO0lBQ1csYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUNwRCxJQUFJO2dCQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN0QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUM7S0FBQTtJQVdlLGlCQUFpQixDQUFDLEtBQVksRUFBRSxHQUFhOztZQUMzRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDekQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4RSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtDQUNGO0FBaENELDRCQWdDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuLy8gaW50ZXJuYWwgZGVwZW5kZW5jaWVzXG5pbXBvcnQgQmFzZSBmcm9tICcuLy5iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgUm91dGVCYXNlIGV4dGVuZHMgQmFzZSB7XG4gIHB1YmxpYyB1cmw6IHN0cmluZztcblxuICAvKlxuICBQYXJlbnQgbWV0aG9kIHRoYXQgd3JhcHMgdGhlIGxvZ2ljIGltcGxlbWVudGF0aW9uXG4gIGNhbGxiYWNrIG1ldGhvZCBpbiBhIHRyeSBjYXRjaCBmb3IgZGV0ZWN0aW5nIGVycm9yc1xuICBhbmQgcmVzcG9uZGluZyB3aXRoIHRoZSByaWdodCBjb2RlcyBhbmQgbWVzc2FnZXMuXG4gICovXG4gIHB1YmxpYyBhc3luYyByb3V0ZUNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNhbGxiYWNrKHJlcSwgcmVzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYXdhaXQgdGhpcy5kZXRlY3RLbm93bkVycm9ycyhlcnJvciwgcmVzKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICBNZXRob2QgdG8gaW1wbGVtZW50IHdoZW4gYWRkaW5nIGFuIGVuZHBvaW50LlxuICBFYWNoIFJvdXRlSW1wbCBzaG91bGQgcGxhY2UgdGhlIGxvZ2ljIG9mIHRoZVxuICBFeHByZXNzSlMgY2FsbGJhY2sgbWV0aG9kcyBpbiBoZXJlLiBUaGUgaGFuZGxpbmdcbiAgb2YgZXJyb3JzIGFuZCBjaGVja2luZyBmb3IgYXV0aGVudGljYXRpb24gdG9rZW4sXG4gIGhhcyBiZW5uIGFic3RyYWN0ZWQgdG8gdGhlIFJvdXRlIGJhc2UgY2xhc3MuXG4gICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBjYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT47XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGRldGVjdEtub3duRXJyb3JzKGVycm9yOiBFcnJvciwgcmVzOiBSZXNwb25zZSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBfLmdldChlcnJvciwgJ21lc3NhZ2UnLCAnVW5rbm93biBlcnJvcicpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBfLmdldChlcnJvciwgJ3N0YXR1c0NvZGUnLCA1MDApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKHN0YXR1c0NvZGUsIG1lc3NhZ2UsIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoc3RhdHVzQ29kZSkuc2VuZChtZXNzYWdlKTtcbiAgfVxufSJdfQ==