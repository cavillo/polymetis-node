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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBpUm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL0FwaVJvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQTRCO0FBSzVCLE1BQThCLFNBQVM7SUFJckMsWUFBWSxTQUEyQjtRQUNyQywwREFBMEQ7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O01BSUU7SUFDVyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ3BELElBQUk7Z0JBQ0YsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQ7O01BRUU7SUFDVyxPQUFPLENBQUMsT0FBZSxFQUFFLFNBQWlCLEVBQUUsSUFBUzs7WUFDaEUsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztZQUM3RCxNQUFNLEtBQUssR0FBRyxHQUFHLFdBQVcsSUFBSSxPQUFPLFFBQVEsU0FBUyxFQUFFLENBQUM7WUFDM0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQ3hDLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztRQUNKLENBQUM7S0FBQTtJQVdlLHFCQUFxQixDQUFDLEdBQVk7O1lBQ2hELHdEQUF3RDtZQUN4RCxzQ0FBc0M7WUFDdEMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFDN0MsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixNQUFNLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO2FBQ2pEO1lBRUQsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV4QyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMxQixNQUFNLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO2FBQ3hGO2lCQUFNLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsRUFBRTtnQkFDbEQsTUFBTSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQzthQUM5RTtZQUVELE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJO2dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxDQUFDLENBQUM7YUFDeEU7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUM5QjtZQUNELE9BQU87UUFDVCxDQUFDO0tBQUE7SUFFZSxpQkFBaUIsQ0FBQyxXQUFrQixFQUFFLFlBQXNCOztZQUMxRSxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDL0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXpELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUM5RSxPQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELENBQUM7S0FBQTtDQUNGO0FBNUVELDRCQTRFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuLy8gaW50ZXJuYWwgZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzIH0gZnJvbSAnLi4vU2VydmljZUJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBSb3V0ZUJhc2Uge1xuICBwdWJsaWMgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzO1xuICBwdWJsaWMgdXJsOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzKSB7XG4gICAgLy8gZXh0ZW5kIHRoaXMgb2JqZWN0IHdpdGggZXZlcnl0aGluZyBwYXNzZWQgaW4gYXMgb3B0aW9uc1xuICAgIHRoaXMucmVzb3VyY2VzID0gcmVzb3VyY2VzO1xuICAgIHRoaXMudXJsID0gJyc7XG4gIH1cblxuICAvKlxuICBQYXJlbnQgbWV0aG9kIHRoYXQgd3JhcHMgdGhlIGxvZ2ljIGltcGxlbWVudGF0aW9uXG4gIGNhbGxiYWNrIG1ldGhvZCBpbiBhIHRyeSBjYXRjaCBmb3IgZGV0ZWN0aW5nIGVycm9yc1xuICBhbmQgcmVzcG9uZGluZyB3aXRoIHRoZSByaWdodCBjb2RlcyBhbmQgbWVzc2FnZXMuXG4gICovXG4gIHB1YmxpYyBhc3luYyByb3V0ZUNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNhbGxiYWNrKHJlcSwgcmVzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgYXdhaXQgdGhpcy5kZXRlY3RLbm93bkVycm9ycyhlcnJvciwgcmVzKTtcbiAgICB9XG4gIH1cblxuICAvKlxuICBNZXRob2QgdG8gY2FsbCByZW1vdGUgcHJvY2VkdXJlcyBpbiBvdGhlciBzZXJ2aWNlc1xuICAqL1xuICBwdWJsaWMgYXN5bmMgY2FsbFJQQyhzZXJ2aWNlOiBzdHJpbmcsIHByb2NlZHVyZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB7IGVudmlyb25tZW50IH0gPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2U7XG4gICAgY29uc3QgdG9waWMgPSBgJHtlbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS5ycGMuJHtwcm9jZWR1cmV9YDtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucmFiYml0LmNhbGxQcm9jZWR1cmUoXG4gICAgICB0b3BpYyxcbiAgICAgIGRhdGEsXG4gICAgKTtcbiAgfVxuXG4gIC8qXG4gIE1ldGhvZCB0byBpbXBsZW1lbnQgd2hlbiBhZGRpbmcgYW4gZW5kcG9pbnQuXG4gIEVhY2ggUm91dGVJbXBsIHNob3VsZCBwbGFjZSB0aGUgbG9naWMgb2YgdGhlXG4gIEV4cHJlc3NKUyBjYWxsYmFjayBtZXRob2RzIGluIGhlcmUuIFRoZSBoYW5kbGluZ1xuICBvZiBlcnJvcnMgYW5kIGNoZWNraW5nIGZvciBhdXRoZW50aWNhdGlvbiB0b2tlbixcbiAgaGFzIGJlbm4gYWJzdHJhY3RlZCB0byB0aGUgUm91dGUgYmFzZSBjbGFzcy5cbiAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PjtcblxuICBwcm90ZWN0ZWQgYXN5bmMgcmVxdWlyZUF1dGhlbnRpY2F0aW9uKHJlcTogUmVxdWVzdCk6IFByb21pc2U8YW55PiB7XG4gICAgLy8gUmVxdWlyaW5nIHRva2VuIGluIEF1dGhvcml6YXRpb24gaGVhZGVyIGluIHRoZSBmb3JtYXRcbiAgICAvLyBBdXRob3JpemF0aW9uOiBCZWFyZXIgI2FjY2Vzc1Rva2VuI1xuICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgIGlmICghYXV0aEhlYWRlcikge1xuICAgICAgdGhyb3cgRXJyb3IoJ05vIGF1dGhvcml6YXRpb24gaGVhZGVyIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXV0aFNwbGl0ID0gYXV0aEhlYWRlci5zcGxpdCgnICcpO1xuXG4gICAgaWYgKGF1dGhTcGxpdC5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdNYWxmb3JtZWQgYXV0aGVudGljYXRpb24gaGVhZGVyLiBcXCdCZWFyZXIgYWNjZXNzVG9rZW5cXCcgc3ludGF4IGV4cGVjdGVkJyk7XG4gICAgfSBlbHNlIGlmIChhdXRoU3BsaXRbMF0udG9Mb3dlckNhc2UoKSAhPT0gJ2JlYXJlcicpIHtcbiAgICAgIHRocm93IEVycm9yKCdcXCdCZWFyZXJcXCcga2V5d29yZCBtaXNzaW5nIGZyb20gZnJvbnQgb2YgYXV0aG9yaXphdGlvbiBoZWFkZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF1dGhTcGxpdFsxXTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJ1RPRE8nLCAndmFsaWRhdGluZyB0b2tlbi4uLicsIGFjY2Vzc1Rva2VuKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgRXJyb3IoJ0ludmFsaWQgdG9rZW4nKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGRldGVjdEtub3duRXJyb3JzKHRocm93bkVycm9yOiBFcnJvciwgaHR0cFJlc3BvbnNlOiBSZXNwb25zZSkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBfLmdldCh0aHJvd25FcnJvciwgJ21lc3NhZ2UnLCAnVW5rbm93biBlcnJvcicpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSBfLmdldCh0aHJvd25FcnJvciwgJ3N0YXR1c0NvZGUnLCA1MDApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKHN0YXR1c0NvZGUsIG1lc3NhZ2UsIEpTT04uc3RyaW5naWZ5KHRocm93bkVycm9yKSk7XG4gICAgcmV0dXJuIGh0dHBSZXNwb25zZS5zdGF0dXMoc3RhdHVzQ29kZSkuc2VuZChtZXNzYWdlKTtcbiAgfVxufSJdfQ==