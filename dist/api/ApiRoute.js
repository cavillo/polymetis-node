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
                this.resources.logger.warn('TODO', 'validating token...');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBpUm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL0FwaVJvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQTRCO0FBSzVCLE1BQThCLFNBQVM7SUFJckMsWUFBWSxTQUEyQjtRQUNyQywwREFBMEQ7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O01BSUU7SUFDVyxhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWE7O1lBQ3BELElBQUk7Z0JBQ0YsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQztLQUFBO0lBV2UscUJBQXFCLENBQUMsR0FBWTs7WUFDaEQsd0RBQXdEO1lBQ3hELHNDQUFzQztZQUN0QyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUM3QyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLE1BQU0sS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7YUFDakQ7WUFFRCxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXhDLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sS0FBSyxDQUFDLHlFQUF5RSxDQUFDLENBQUM7YUFDeEY7aUJBQU0sSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxFQUFFO2dCQUNsRCxNQUFNLEtBQUssQ0FBQywrREFBK0QsQ0FBQyxDQUFDO2FBQzlFO1lBRUQsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO2FBQzNEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDOUI7WUFDRCxPQUFPO1FBQ1QsQ0FBQztLQUFBO0lBRWUsaUJBQWlCLENBQUMsV0FBa0IsRUFBRSxZQUFzQjs7WUFDMUUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV6RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUUsT0FBTyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQUE7Q0FDRjtBQWhFRCw0QkFnRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8vIGludGVybmFsIGRlcGVuZGVuY2llc1xuaW1wb3J0IHsgU2VydmljZVJlc291cmNlcyB9IGZyb20gJy4uL1NlcnZpY2VCYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgUm91dGVCYXNlIHtcbiAgcHVibGljIHJlc291cmNlczogU2VydmljZVJlc291cmNlcztcbiAgcHVibGljIHVybDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHJlc291cmNlczogU2VydmljZVJlc291cmNlcykge1xuICAgIC8vIGV4dGVuZCB0aGlzIG9iamVjdCB3aXRoIGV2ZXJ5dGhpbmcgcGFzc2VkIGluIGFzIG9wdGlvbnNcbiAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlcztcbiAgICB0aGlzLnVybCA9ICcnO1xuICB9XG5cbiAgLypcbiAgUGFyZW50IG1ldGhvZCB0aGF0IHdyYXBzIHRoZSBsb2dpYyBpbXBsZW1lbnRhdGlvblxuICBjYWxsYmFjayBtZXRob2QgaW4gYSB0cnkgY2F0Y2ggZm9yIGRldGVjdGluZyBlcnJvcnNcbiAgYW5kIHJlc3BvbmRpbmcgd2l0aCB0aGUgcmlnaHQgY29kZXMgYW5kIG1lc3NhZ2VzLlxuICAqL1xuICBwdWJsaWMgYXN5bmMgcm91dGVDYWxsYmFjayhyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpOiBQcm9taXNlPGFueT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgdGhpcy5jYWxsYmFjayhyZXEsIHJlcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGF3YWl0IHRoaXMuZGV0ZWN0S25vd25FcnJvcnMoZXJyb3IsIHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLypcbiAgTWV0aG9kIHRvIGltcGxlbWVudCB3aGVuIGFkZGluZyBhbiBlbmRwb2ludC5cbiAgRWFjaCBSb3V0ZUltcGwgc2hvdWxkIHBsYWNlIHRoZSBsb2dpYyBvZiB0aGVcbiAgRXhwcmVzc0pTIGNhbGxiYWNrIG1ldGhvZHMgaW4gaGVyZS4gVGhlIGhhbmRsaW5nXG4gIG9mIGVycm9ycyBhbmQgY2hlY2tpbmcgZm9yIGF1dGhlbnRpY2F0aW9uIHRva2VuLFxuICBoYXMgYmVubiBhYnN0cmFjdGVkIHRvIHRoZSBSb3V0ZSBiYXNlIGNsYXNzLlxuICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgY2FsbGJhY2socmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogUHJvbWlzZTxhbnk+O1xuXG4gIHByb3RlY3RlZCBhc3luYyByZXF1aXJlQXV0aGVudGljYXRpb24ocmVxOiBSZXF1ZXN0KSB7XG4gICAgLy8gUmVxdWlyaW5nIHRva2VuIGluIEF1dGhvcml6YXRpb24gaGVhZGVyIGluIHRoZSBmb3JtYXRcbiAgICAvLyBBdXRob3JpemF0aW9uOiBCZWFyZXIgI2FjY2Vzc1Rva2VuI1xuICAgIGNvbnN0IGF1dGhIZWFkZXIgPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgIGlmICghYXV0aEhlYWRlcikge1xuICAgICAgdGhyb3cgRXJyb3IoJ05vIGF1dGhvcml6YXRpb24gaGVhZGVyIHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXV0aFNwbGl0ID0gYXV0aEhlYWRlci5zcGxpdCgnICcpO1xuXG4gICAgaWYgKGF1dGhTcGxpdC5sZW5ndGggIT09IDIpIHtcbiAgICAgIHRocm93IEVycm9yKCdNYWxmb3JtZWQgYXV0aGVudGljYXRpb24gaGVhZGVyLiBcXCdCZWFyZXIgYWNjZXNzVG9rZW5cXCcgc3ludGF4IGV4cGVjdGVkJyk7XG4gICAgfSBlbHNlIGlmIChhdXRoU3BsaXRbMF0udG9Mb3dlckNhc2UoKSAhPT0gJ2JlYXJlcicpIHtcbiAgICAgIHRocm93IEVycm9yKCdcXCdCZWFyZXJcXCcga2V5d29yZCBtaXNzaW5nIGZyb20gZnJvbnQgb2YgYXV0aG9yaXphdGlvbiBoZWFkZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF1dGhTcGxpdFsxXTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJ1RPRE8nLCAndmFsaWRhdGluZyB0b2tlbi4uLicpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyBFcnJvcignSW52YWxpZCB0b2tlbicpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgZGV0ZWN0S25vd25FcnJvcnModGhyb3duRXJyb3I6IEVycm9yLCBodHRwUmVzcG9uc2U6IFJlc3BvbnNlKSB7XG4gICAgY29uc3QgbWVzc2FnZSA9IF8uZ2V0KHRocm93bkVycm9yLCAnbWVzc2FnZScsICdVbmtub3duIGVycm9yJyk7XG4gICAgY29uc3Qgc3RhdHVzQ29kZSA9IF8uZ2V0KHRocm93bkVycm9yLCAnc3RhdHVzQ29kZScsIDUwMCk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3Ioc3RhdHVzQ29kZSwgbWVzc2FnZSwgSlNPTi5zdHJpbmdpZnkodGhyb3duRXJyb3IpKTtcbiAgICByZXR1cm4gaHR0cFJlc3BvbnNlLnN0YXR1cyhzdGF0dXNDb2RlKS5zZW5kKG1lc3NhZ2UpO1xuICB9XG59Il19