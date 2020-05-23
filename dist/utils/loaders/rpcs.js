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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const loadRPCs = (service, dir) => __awaiter(this, void 0, void 0, function* () {
    let rpcsDir;
    if (dir) {
        rpcsDir = dir;
    }
    else {
        rpcsDir = path.join(service.resources.configuration.baseDir, './rpc/');
    }
    let handlers;
    try {
        handlers = fs.readdirSync(rpcsDir);
    }
    catch (error) {
        return;
    }
    for (const handlerName of handlers) {
        const handlerPath = path.join(rpcsDir, handlerName);
        if (_.endsWith(handlerName, '.rpc.ts') // TyspeScript
            || _.endsWith(handlerName, '.rpc.js') // JavaScript
        ) {
            try {
                const handlerSpec = require(handlerPath).default;
                const handler = new handlerSpec(service.resources);
                yield service.loadRPC(handler);
            }
            catch (error) {
                service.resources.logger.error(`Error Registering RPC ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield this.loadRPCs(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadRPCs = loadRPCs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9sb2FkZXJzL3JwY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUt6QixNQUFNLFFBQVEsR0FBRyxDQUFPLE9BQW9CLEVBQUUsR0FBWSxFQUFpQixFQUFFO0lBQzNFLElBQUksT0FBZSxDQUFDO0lBQ3BCLElBQUksR0FBRyxFQUFFO1FBQ1AsT0FBTyxHQUFHLEdBQUcsQ0FBQztLQUNmO1NBQU07UUFDTCxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDeEU7SUFFRCxJQUFJLFFBQWtCLENBQUM7SUFDdkIsSUFBSTtRQUNGLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPO0tBQ1I7SUFFRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFFBQVEsRUFBRTtRQUNsQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVwRCxJQUNFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLGNBQWM7ZUFDOUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsYUFBYTtVQUNuRDtZQUNBLElBQUk7Z0JBQ0YsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDakQsTUFBTSxPQUFPLEdBQW1CLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFbkUsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2hDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixXQUFXLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNsRjtTQUNGO2FBQU07WUFDTCxJQUFJO2dCQUNGLGtDQUFrQztnQkFDbEMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzNEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsU0FBUzthQUNWO1NBQ0Y7S0FDRjtBQUNILENBQUMsQ0FBQSxDQUFDO0FBR0EsNEJBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQgUlBDSGFuZGxlckJhc2UgZnJvbSAnLi4vLi4vaGFuZGxlcnMvUlBDSGFuZGxlckJhc2UnO1xuaW1wb3J0IFNlcnZpY2VCYXNlIGZyb20gJy4uLy4uL1NlcnZpY2VCYXNlJztcblxuY29uc3QgbG9hZFJQQ3MgPSBhc3luYyAoc2VydmljZTogU2VydmljZUJhc2UsIGRpcj86IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBsZXQgcnBjc0Rpcjogc3RyaW5nO1xuICBpZiAoZGlyKSB7XG4gICAgcnBjc0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICBycGNzRGlyID0gcGF0aC5qb2luKHNlcnZpY2UucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vcnBjLycpO1xuICB9XG5cbiAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgdHJ5IHtcbiAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHJwY3NEaXIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICBjb25zdCBoYW5kbGVyUGF0aCA9IHBhdGguam9pbihycGNzRGlyLCBoYW5kbGVyTmFtZSk7XG5cbiAgICBpZiAoXG4gICAgICBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJwYy50cycpIC8vIFR5c3BlU2NyaXB0XG4gICAgICB8fCBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJwYy5qcycpIC8vIEphdmFTY3JpcHRcbiAgICApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgY29uc3QgaGFuZGxlcjogUlBDSGFuZGxlckJhc2UgPSBuZXcgaGFuZGxlclNwZWMoc2VydmljZS5yZXNvdXJjZXMpO1xuXG4gICAgICAgIGF3YWl0IHNlcnZpY2UubG9hZFJQQyhoYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlcnZpY2UucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgUlBDICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFJQQ3Moc2VydmljZSwgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHtcbiAgbG9hZFJQQ3MsXG59O1xuIl19