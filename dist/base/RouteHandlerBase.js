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
    /*
    Method to call remote procedures in other services
    */
    callRPC(service, procedure, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { environment } = this.resources.configuration.service;
            const topic = `${environment}.${service}.rpc.${procedure}`;
            return this.resources.rabbit.callProcedure(topic, data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL1JvdXRlSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBNEI7QUFFNUIsd0JBQXdCO0FBQ3hCLG9EQUEyQjtBQUUzQixNQUE4QixTQUFVLFNBQVEsZUFBSTtJQUdsRDs7OztNQUlFO0lBQ1csYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUNwRCxJQUFJO2dCQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN0QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUM7S0FBQTtJQUVEOztNQUVFO0lBQ1csT0FBTyxDQUFDLE9BQWUsRUFBRSxTQUFpQixFQUFFLElBQVM7O1lBQ2hFLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7WUFDN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxXQUFXLElBQUksT0FBTyxRQUFRLFNBQVMsRUFBRSxDQUFDO1lBQzNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUN4QyxLQUFLLEVBQ0wsSUFBSSxDQUNMLENBQUM7UUFDSixDQUFDO0tBQUE7SUFXZSxpQkFBaUIsQ0FBQyxLQUFZLEVBQUUsR0FBYTs7WUFDM0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDeEUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxDQUFDO0tBQUE7Q0FDRjtBQTVDRCw0QkE0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8vIGludGVybmFsIGRlcGVuZGVuY2llc1xuaW1wb3J0IEJhc2UgZnJvbSAnLi8uYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFJvdXRlQmFzZSBleHRlbmRzIEJhc2Uge1xuICBwdWJsaWMgdXJsOiBzdHJpbmc7XG5cbiAgLypcbiAgUGFyZW50IG1ldGhvZCB0aGF0IHdyYXBzIHRoZSBsb2dpYyBpbXBsZW1lbnRhdGlvblxuICBjYWxsYmFjayBtZXRob2QgaW4gYSB0cnkgY2F0Y2ggZm9yIGRldGVjdGluZyBlcnJvcnNcbiAgYW5kIHJlc3BvbmRpbmcgd2l0aCB0aGUgcmlnaHQgY29kZXMgYW5kIG1lc3NhZ2VzLlxuICAqL1xuICBwdWJsaWMgYXN5bmMgcm91dGVDYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5jYWxsYmFjayhyZXEsIHJlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGF3YWl0IHRoaXMuZGV0ZWN0S25vd25FcnJvcnMoZXJyb3IsIHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgTWV0aG9kIHRvIGNhbGwgcmVtb3RlIHByb2NlZHVyZXMgaW4gb3RoZXIgc2VydmljZXNcbiAgKi9cbiAgcHVibGljIGFzeW5jIGNhbGxSUEMoc2VydmljZTogc3RyaW5nLCBwcm9jZWR1cmU6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgY29uc3QgeyBlbnZpcm9ubWVudCB9ID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlO1xuICAgIGNvbnN0IHRvcGljID0gYCR7ZW52aXJvbm1lbnR9LiR7c2VydmljZX0ucnBjLiR7cHJvY2VkdXJlfWA7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJhYmJpdC5jYWxsUHJvY2VkdXJlKFxuICAgICAgdG9waWMsXG4gICAgICBkYXRhLFxuICAgICk7XG4gIH1cblxuICAvKlxuICBNZXRob2QgdG8gaW1wbGVtZW50IHdoZW4gYWRkaW5nIGFuIGVuZHBvaW50LlxuICBFYWNoIFJvdXRlSW1wbCBzaG91bGQgcGxhY2UgdGhlIGxvZ2ljIG9mIHRoZVxuICBFeHByZXNzSlMgY2FsbGJhY2sgbWV0aG9kcyBpbiBoZXJlLiBUaGUgaGFuZGxpbmdcbiAgb2YgZXJyb3JzIGFuZCBjaGVja2luZyBmb3IgYXV0aGVudGljYXRpb24gdG9rZW4sXG4gIGhhcyBiZW5uIGFic3RyYWN0ZWQgdG8gdGhlIFJvdXRlIGJhc2UgY2xhc3MuXG4gICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBjYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT47XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGRldGVjdEtub3duRXJyb3JzKGVycm9yOiBFcnJvciwgcmVzOiBSZXNwb25zZSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBfLmdldChlcnJvciwgJ21lc3NhZ2UnLCAnVW5rbm93biBlcnJvcicpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBfLmdldChlcnJvciwgJ3N0YXR1c0NvZGUnLCA1MDApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKHN0YXR1c0NvZGUsIG1lc3NhZ2UsIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoc3RhdHVzQ29kZSkuc2VuZChtZXNzYWdlKTtcbiAgfVxufSJdfQ==