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
                yield loadRPCs(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadRPCs = loadRPCs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9sb2FkZXJzL3JwY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUt6QixNQUFNLFFBQVEsR0FBRyxDQUFPLE9BQW9CLEVBQUUsR0FBWSxFQUFpQixFQUFFO0lBQzNFLElBQUksT0FBZSxDQUFDO0lBQ3BCLElBQUksR0FBRyxFQUFFO1FBQ1AsT0FBTyxHQUFHLEdBQUcsQ0FBQztLQUNmO1NBQU07UUFDTCxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDeEU7SUFFRCxJQUFJLFFBQWtCLENBQUM7SUFDdkIsSUFBSTtRQUNGLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPO0tBQ1I7SUFFRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFFBQVEsRUFBRTtRQUNsQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVwRCxJQUNFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLGNBQWM7ZUFDOUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsYUFBYTtVQUNuRDtZQUNBLElBQUk7Z0JBQ0YsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDakQsTUFBTSxPQUFPLEdBQW1CLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFbkUsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2hDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixXQUFXLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNsRjtTQUNGO2FBQU07WUFDTCxJQUFJO2dCQUNGLGtDQUFrQztnQkFDbEMsTUFBTSxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDdEQ7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxTQUFTO2FBQ1Y7U0FDRjtLQUNGO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFHQSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBSUENIYW5kbGVyQmFzZSBmcm9tICcuLi8uLi9oYW5kbGVycy9SUENIYW5kbGVyQmFzZSc7XG5pbXBvcnQgU2VydmljZUJhc2UgZnJvbSAnLi4vLi4vU2VydmljZUJhc2UnO1xuXG5jb25zdCBsb2FkUlBDcyA9IGFzeW5jIChzZXJ2aWNlOiBTZXJ2aWNlQmFzZSwgZGlyPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGxldCBycGNzRGlyOiBzdHJpbmc7XG4gIGlmIChkaXIpIHtcbiAgICBycGNzRGlyID0gZGlyO1xuICB9IGVsc2Uge1xuICAgIHJwY3NEaXIgPSBwYXRoLmpvaW4oc2VydmljZS5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9ycGMvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMocnBjc0Rpcik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHJwY3NEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgIGlmIChcbiAgICAgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucnBjLnRzJykgLy8gVHlzcGVTY3JpcHRcbiAgICAgIHx8IF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucnBjLmpzJykgLy8gSmF2YVNjcmlwdFxuICAgICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICBjb25zdCBoYW5kbGVyOiBSUENIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyhzZXJ2aWNlLnJlc291cmNlcyk7XG5cbiAgICAgICAgYXdhaXQgc2VydmljZS5sb2FkUlBDKGhhbmRsZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VydmljZS5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBSUEMgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgYXdhaXQgbG9hZFJQQ3Moc2VydmljZSwgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHtcbiAgbG9hZFJQQ3MsXG59O1xuIl19