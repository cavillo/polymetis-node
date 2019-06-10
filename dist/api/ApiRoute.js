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
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
class RouteBase {
    constructor(resources) {
        // extend this object with everything passed in as options
        this.resources = resources;
        this.url = '';
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBpUm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL0FwaVJvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQTRCO0FBSzVCLE1BQThCLFNBQVM7SUFJckMsWUFBWSxTQUEyQjtRQUNyQywwREFBMEQ7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O01BSUU7SUFDVyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ3BELElBQUk7Z0JBQ0YsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQztLQUFBO0lBV2UscUJBQXFCLENBQUMsR0FBWTs7WUFDaEQsd0RBQXdEO1lBQ3hELHNDQUFzQztZQUN0QyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUM3QyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLE1BQU0sS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7YUFDakQ7WUFFRCxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sS0FBSyxDQUFDLHlFQUF5RSxDQUFDLENBQUM7YUFDeEY7aUJBQU0sSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxFQUFFO2dCQUNsRCxNQUFNLEtBQUssQ0FBQywrREFBK0QsQ0FBQyxDQUFDO2FBQzlFO1lBRUQsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxXQUFXLENBQUMsQ0FBQzthQUN4RTtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2FBQzlCO1lBQ0QsT0FBTztRQUNULENBQUM7S0FBQTtJQUVlLGlCQUFpQixDQUFDLFdBQWtCLEVBQUUsWUFBc0I7O1lBQzFFLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztZQUMvRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFekQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzlFLE9BQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkQsQ0FBQztLQUFBO0NBQ0Y7QUFoRUQsNEJBZ0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuXG4vLyBpbnRlcm5hbCBkZXBlbmRlbmNpZXNcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLi9TZXJ2aWNlQmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFJvdXRlQmFzZSB7XG4gIHB1YmxpYyByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG4gIHB1YmxpYyB1cmw6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMpIHtcbiAgICAvLyBleHRlbmQgdGhpcyBvYmplY3Qgd2l0aCBldmVyeXRoaW5nIHBhc3NlZCBpbiBhcyBvcHRpb25zXG4gICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZXM7XG4gICAgdGhpcy51cmwgPSAnJztcbiAgfVxuXG4gIC8qXG4gIFBhcmVudCBtZXRob2QgdGhhdCB3cmFwcyB0aGUgbG9naWMgaW1wbGVtZW50YXRpb25cbiAgY2FsbGJhY2sgbWV0aG9kIGluIGEgdHJ5IGNhdGNoIGZvciBkZXRlY3RpbmcgZXJyb3JzXG4gIGFuZCByZXNwb25kaW5nIHdpdGggdGhlIHJpZ2h0IGNvZGVzIGFuZCBtZXNzYWdlcy5cbiAgKi9cbiAgcHVibGljIGFzeW5jIHJvdXRlQ2FsbGJhY2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY2FsbGJhY2socmVxLCByZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhd2FpdCB0aGlzLmRldGVjdEtub3duRXJyb3JzKGVycm9yLCByZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIE1ldGhvZCB0byBpbXBsZW1lbnQgd2hlbiBhZGRpbmcgYW4gZW5kcG9pbnQuXG4gIEVhY2ggUm91dGVJbXBsIHNob3VsZCBwbGFjZSB0aGUgbG9naWMgb2YgdGhlXG4gIEV4cHJlc3NKUyBjYWxsYmFjayBtZXRob2RzIGluIGhlcmUuIFRoZSBoYW5kbGluZ1xuICBvZiBlcnJvcnMgYW5kIGNoZWNraW5nIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbixcbiAgaGFzIGJlbm4gYWJzdHJhY3RlZCB0byB0aGUgUm91dGUgYmFzZSBjbGFzcy5cbiAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PjtcblxuICBwcm90ZWN0ZWQgYXN5bmMgcmVxdWlyZUF1dGhlbnRpY2F0aW9uKHJlcTogUmVxdWVzdCk6IFByb21pc2U8YW55PiB7XG4gICAgLy8gUmVxdWlyaW5nIHRva2VuIGluIEF1dGhvcml6YXRpb24gaGVhZGVyIGluIHRoZSBmb3JtYXRcbiAgICAvLyBBdXRob3JpemF0aW9uOiBCZWFyZXIgI2FjY2Vzc1Rva2VuI1xuICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgIGlmICghYXV0aEhlYWRlcikge1xuICAgICAgdGhyb3cgRXJyb3IoJ05vIGF1dGhvcml6YXRpb24gaGVhZGVyIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXV0aFNwbGl0ID0gYXV0aEhlYWRlci5zcGxpdCgnICcpO1xuXG4gICAgaWYgKGF1dGhTcGxpdC5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdNYWxmb3JtZWQgYXV0aGVudGljYXRpb24gaGVhZGVyLiBcXCdCZWFyZXIgYWNjZXNzVG9rZW5cXCcgc3ludGF4IGV4cGVjdGVkJyk7XG4gICAgfSBlbHNlIGlmIChhdXRoU3BsaXRbMF0udG9Mb3dlckNhc2UoKSAhPT0gJ2JlYXJlcicpIHtcbiAgICAgIHRocm93IEVycm9yKCdcXCdCZWFyZXJcXCcga2V5d29yZCBtaXNzaW5nIGZyb20gZnJvbnQgb2YgYXV0aG9yaXphdGlvbiBoZWFkZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF1dGhTcGxpdFsxXTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJ1RPRE8nLCAndmFsaWRhdGluZyB0b2tlbi4uLicsIGFjY2Vzc1Rva2VuKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgdG9rZW4nKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGRldGVjdEtub3duRXJyb3JzKHRocm93bkVycm9yOiBFcnJvciwgaHR0cFJlc3BvbnNlOiBSZXNwb25zZSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBfLmdldCh0aHJvd25FcnJvciwgJ21lc3NhZ2UnLCAnVW5rbm93biBlcnJvcicpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBfLmdldCh0aHJvd25FcnJvciwgJ3N0YXR1c0NvZGUnLCA1MDApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKHN0YXR1c0NvZGUsIG1lc3NhZ2UsIEpTT04uc3RyaW5naWZ5KHRocm93bkVycm9yKSk7XG4gICAgcmV0dXJuIGh0dHBSZXNwb25zZS5zdGF0dXMoc3RhdHVzQ29kZSkuc2VuZChtZXNzYWdlKTtcbiAgfVxufSJdfQ==