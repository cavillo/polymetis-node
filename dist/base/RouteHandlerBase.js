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
    requireAuthentication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Requiring token in Authorization header in the format
            // Authorization: Bearer #accessToken#
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw Error('No authorization header provided');
            }
            const authSplit = authHeader.split(' ');
            if (authSplit.length !== 2) {
                throw Error('Malformed authentication header. \'Bearer accessToken\' syntax expected');
            }
            else if (authSplit[0].toLowerCase() !== 'bearer') {
                throw Error('\'Bearer\' keyword missing from front of authorization header');
            }
            const accessToken = authSplit[1];
            try {
                this.resources.logger.warn('TODO', 'validating token...', accessToken);
            }
            catch (error) {
                throw Error('Invalid token');
            }
            return;
        });
    }
    detectKnownErrors(thrownError, httpResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = _.get(thrownError, 'message', 'Unknown error');
            const statusCode = _.get(thrownError, 'statusCode', 500);
            this.resources.logger.error(statusCode, message, JSON.stringify(thrownError));
            return httpResponse.status(statusCode).send(message);
        });
    }
}
exports.default = RouteBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUm91dGVIYW5kbGVyQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL1JvdXRlSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwwQ0FBNEI7QUFFNUIsd0JBQXdCO0FBQ3hCLGtEQUEwQjtBQUUxQixNQUE4QixTQUFVLFNBQVEsY0FBSTtJQUdsRDs7OztNQUlFO0lBQ1csYUFBYSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUNwRCxJQUFJO2dCQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN0QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUM7S0FBQTtJQUVEOztNQUVFO0lBQ1csT0FBTyxDQUFDLE9BQWUsRUFBRSxTQUFpQixFQUFFLElBQVM7O1lBQ2hFLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7WUFDN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxXQUFXLElBQUksT0FBTyxRQUFRLFNBQVMsRUFBRSxDQUFDO1lBQzNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUN4QyxLQUFLLEVBQ0wsSUFBSSxDQUNMLENBQUM7UUFDSixDQUFDO0tBQUE7SUFXZSxxQkFBcUIsQ0FBQyxHQUFZOztZQUNoRCx3REFBd0Q7WUFDeEQsc0NBQXNDO1lBQ3RDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQzdDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2YsTUFBTSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQzthQUNqRDtZQUVELE1BQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFeEMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDMUIsTUFBTSxLQUFLLENBQUMseUVBQXlFLENBQUMsQ0FBQzthQUN4RjtpQkFBTSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRLEVBQUU7Z0JBQ2xELE1BQU0sS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7YUFDOUU7WUFFRCxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSTtnQkFDRixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxDQUFDO2FBQ3hFO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDOUI7WUFDRCxPQUFPO1FBQ1QsQ0FBQztLQUFBO0lBRWUsaUJBQWlCLENBQUMsV0FBa0IsRUFBRSxZQUFzQjs7WUFDMUUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV6RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUUsT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQUE7Q0FDRjtBQXJFRCw0QkFxRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8vIGludGVybmFsIGRlcGVuZGVuY2llc1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgUm91dGVCYXNlIGV4dGVuZHMgQmFzZSB7XG4gIHB1YmxpYyB1cmw6IHN0cmluZztcblxuICAvKlxuICBQYXJlbnQgbWV0aG9kIHRoYXQgd3JhcHMgdGhlIGxvZ2ljIGltcGxlbWVudGF0aW9uXG4gIGNhbGxiYWNrIG1ldGhvZCBpbiBhIHRyeSBjYXRjaCBmb3IgZGV0ZWN0aW5nIGVycm9yc1xuICBhbmQgcmVzcG9uZGluZyB3aXRoIHRoZSByaWdodCBjb2RlcyBhbmQgbWVzc2FnZXMuXG4gICovXG4gIHB1YmxpYyBhc3luYyByb3V0ZUNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNhbGxiYWNrKHJlcSwgcmVzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYXdhaXQgdGhpcy5kZXRlY3RLbm93bkVycm9ycyhlcnJvciwgcmVzKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICBNZXRob2QgdG8gY2FsbCByZW1vdGUgcHJvY2VkdXJlcyBpbiBvdGhlciBzZXJ2aWNlc1xuICAqL1xuICBwdWJsaWMgYXN5bmMgY2FsbFJQQyhzZXJ2aWNlOiBzdHJpbmcsIHByb2NlZHVyZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB7IGVudmlyb25tZW50IH0gPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2U7XG4gICAgY29uc3QgdG9waWMgPSBgJHtlbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS5ycGMuJHtwcm9jZWR1cmV9YDtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucmFiYml0LmNhbGxQcm9jZWR1cmUoXG4gICAgICB0b3BpYyxcbiAgICAgIGRhdGEsXG4gICAgKTtcbiAgfVxuXG4gIC8qXG4gIE1ldGhvZCB0byBpbXBsZW1lbnQgd2hlbiBhZGRpbmcgYW4gZW5kcG9pbnQuXG4gIEVhY2ggUm91dGVJbXBsIHNob3VsZCBwbGFjZSB0aGUgbG9naWMgb2YgdGhlXG4gIEV4cHJlc3NKUyBjYWxsYmFjayBtZXRob2RzIGluIGhlcmUuIFRoZSBoYW5kbGluZ1xuICBvZiBlcnJvcnMgYW5kIGNoZWNraW5nIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbixcbiAgaGFzIGJlbm4gYWJzdHJhY3RlZCB0byB0aGUgUm91dGUgYmFzZSBjbGFzcy5cbiAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PjtcblxuICBwcm90ZWN0ZWQgYXN5bmMgcmVxdWlyZUF1dGhlbnRpY2F0aW9uKHJlcTogUmVxdWVzdCk6IFByb21pc2U8YW55PiB7XG4gICAgLy8gUmVxdWlyaW5nIHRva2VuIGluIEF1dGhvcml6YXRpb24gaGVhZGVyIGluIHRoZSBmb3JtYXRcbiAgICAvLyBBdXRob3JpemF0aW9uOiBCZWFyZXIgI2FjY2Vzc1Rva2VuI1xuICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgIGlmICghYXV0aEhlYWRlcikge1xuICAgICAgdGhyb3cgRXJyb3IoJ05vIGF1dGhvcml6YXRpb24gaGVhZGVyIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXV0aFNwbGl0ID0gYXV0aEhlYWRlci5zcGxpdCgnICcpO1xuXG4gICAgaWYgKGF1dGhTcGxpdC5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdNYWxmb3JtZWQgYXV0aGVudGljYXRpb24gaGVhZGVyLiBcXCdCZWFyZXIgYWNjZXNzVG9rZW5cXCcgc3ludGF4IGV4cGVjdGVkJyk7XG4gICAgfSBlbHNlIGlmIChhdXRoU3BsaXRbMF0udG9Mb3dlckNhc2UoKSAhPT0gJ2JlYXJlcicpIHtcbiAgICAgIHRocm93IEVycm9yKCdcXCdCZWFyZXJcXCcga2V5d29yZCBtaXNzaW5nIGZyb20gZnJvbnQgb2YgYXV0aG9yaXphdGlvbiBoZWFkZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF1dGhTcGxpdFsxXTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJ1RPRE8nLCAndmFsaWRhdGluZyB0b2tlbi4uLicsIGFjY2Vzc1Rva2VuKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgdG9rZW4nKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGRldGVjdEtub3duRXJyb3JzKHRocm93bkVycm9yOiBFcnJvciwgaHR0cFJlc3BvbnNlOiBSZXNwb25zZSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBfLmdldCh0aHJvd25FcnJvciwgJ21lc3NhZ2UnLCAnVW5rbm93biBlcnJvcicpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBfLmdldCh0aHJvd25FcnJvciwgJ3N0YXR1c0NvZGUnLCA1MDApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKHN0YXR1c0NvZGUsIG1lc3NhZ2UsIEpTT04uc3RyaW5naWZ5KHRocm93bkVycm9yKSk7XG4gICAgcmV0dXJuIGh0dHBSZXNwb25zZS5zdGF0dXMoc3RhdHVzQ29kZSkuc2VuZChtZXNzYWdlKTtcbiAgfVxufSJdfQ==