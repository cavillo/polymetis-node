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
const express_1 = __importDefault(require("express"));
exports.express = express_1.default;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const loadRoutes = (service, dir) => __awaiter(this, void 0, void 0, function* () {
    let routesDir;
    if (dir) {
        routesDir = dir;
    }
    else {
        routesDir = path.join(service.resources.configuration.baseDir, './api/');
    }
    let handlers;
    try {
        handlers = fs.readdirSync(routesDir);
    }
    catch (error) {
        return;
    }
    for (const handlerName of handlers) {
        const handlerPath = path.join(routesDir, handlerName);
        const method = _.toLower(handlerName.split('.')[0]);
        if (_.endsWith(handlerName, '.route.ts') // TyspeScript
            || _.endsWith(handlerName, '.route.js') // JavaScript
        ) {
            // skip non route ts files
            // all routes should end in route.ts
            // all routes should start with the HTTP method to implement followed by a dot
            // in trustedEndpoints list
            // eg: post.route.ts
            // eg: get.allByBusiness.route.ts
            if (method !== 'get'
                && method !== 'post'
                && method !== 'put'
                && method !== 'delete') {
                continue;
            }
            try {
                const routeClass = require(handlerPath).default;
                const routeInstance = new routeClass(service.resources);
                yield service.loadRoute(routeInstance, method);
            }
            catch (error) {
                service.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield loadRoutes(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadRoutes = loadRoutes;
const logApiRoute = (resources, req, res, next) => {
    resources.logger.info(req.method, req.originalUrl);
    const cleanup = () => {
        res.removeListener('finish', logFinish);
    };
    const logFinish = () => {
        cleanup();
        if (res.statusCode >= 500) {
            resources.logger.error(req.method, req.originalUrl, res.statusCode);
        }
        else if (res.statusCode >= 400) {
            resources.logger.error(req.method, req.originalUrl, res.statusCode);
        }
        else if (res.statusCode < 300 && res.statusCode >= 200) {
            resources.logger.info(req.method, req.originalUrl, res.statusCode);
        }
        else {
            resources.logger.info(req.method, req.originalUrl, res.statusCode);
        }
    };
    res.on('finish', logFinish);
    next();
};
exports.logApiRoute = logApiRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQVBJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0FQSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixzREFBNEU7QUE0RjFFLGtCQTVGSyxpQkFBTyxDQTRGTDtBQTNGVCwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBT3pCLE1BQU0sVUFBVSxHQUFHLENBQU8sT0FBb0IsRUFBRSxHQUFZLEVBQUUsRUFBRTtJQUM5RCxJQUFJLFNBQWlCLENBQUM7SUFDdEIsSUFBSSxHQUFHLEVBQUU7UUFDUCxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ2pCO1NBQU07UUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDMUU7SUFFRCxJQUFJLFFBQWtCLENBQUM7SUFDdkIsSUFBSTtRQUNGLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3RDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPO0tBQ1I7SUFFRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFFBQVEsRUFBRTtRQUNsQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0RCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRCxJQUNNLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLGNBQWM7ZUFDbkQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsYUFBYTtVQUN0RDtZQUNBLDBCQUEwQjtZQUMxQixvQ0FBb0M7WUFDcEMsOEVBQThFO1lBQzlFLDJCQUEyQjtZQUMzQixvQkFBb0I7WUFDcEIsaUNBQWlDO1lBQ2pDLElBQ0ssTUFBTSxLQUFLLEtBQUs7bUJBQ2hCLE1BQU0sS0FBSyxNQUFNO21CQUNqQixNQUFNLEtBQUssS0FBSzttQkFDaEIsTUFBTSxLQUFLLFFBQVEsRUFDdEI7Z0JBQ0EsU0FBUzthQUNWO1lBQ0QsSUFBSTtnQkFDRixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNoRCxNQUFNLGFBQWEsR0FBcUIsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUUxRSxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2hEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixXQUFXLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNwRjtTQUNGO2FBQU07WUFDTCxJQUFJO2dCQUNGLGtDQUFrQztnQkFDbEMsTUFBTSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxTQUFTO2FBQ1Y7U0FDRjtLQUNGO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFtQ0EsZ0NBQVU7QUFqQ1osTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUEyQixFQUFFLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO0lBQ25HLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRW5ELE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtRQUNuQixHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7UUFDckIsT0FBTyxFQUFFLENBQUM7UUFFVixJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQ3pCLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckU7YUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQ2hDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckU7YUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQ3hELFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEU7YUFBTTtZQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDLENBQUM7SUFFRixHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUU1QixJQUFJLEVBQUUsQ0FBQztBQUNULENBQUMsQ0FBQztBQVVBLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGV4cHJlc3MsIHsgRXhwcmVzcywgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuaW1wb3J0IHsgUm91dGVIYW5kbGVyQmFzZSB9IGZyb20gJy4uL2Jhc2UnO1xuaW1wb3J0IFNlcnZpY2VCYXNlLCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLi9TZXJ2aWNlQmFzZSc7XG5cbnR5cGUgVHJ1c3RlZEVuZHBvaW50cyA9ICdnZXQnIHwgJ2RlbGV0ZScgfCAncHV0JyB8ICdwb3N0JztcblxuY29uc3QgbG9hZFJvdXRlcyA9IGFzeW5jIChzZXJ2aWNlOiBTZXJ2aWNlQmFzZSwgZGlyPzogc3RyaW5nKSA9PiB7XG4gIGxldCByb3V0ZXNEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIHJvdXRlc0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICByb3V0ZXNEaXIgPSBwYXRoLmpvaW4oc2VydmljZS5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9hcGkvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMocm91dGVzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4ocm91dGVzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgY29uc3QgbWV0aG9kID0gXy50b0xvd2VyKGhhbmRsZXJOYW1lLnNwbGl0KCcuJylbMF0pO1xuXG4gICAgaWYgKFxuICAgICAgICAgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucm91dGUudHMnKSAvLyBUeXNwZVNjcmlwdFxuICAgICAgfHwgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucm91dGUuanMnKSAvLyBKYXZhU2NyaXB0XG4gICAgKSB7XG4gICAgICAvLyBza2lwIG5vbiByb3V0ZSB0cyBmaWxlc1xuICAgICAgLy8gYWxsIHJvdXRlcyBzaG91bGQgZW5kIGluIHJvdXRlLnRzXG4gICAgICAvLyBhbGwgcm91dGVzIHNob3VsZCBzdGFydCB3aXRoIHRoZSBIVFRQIG1ldGhvZCB0byBpbXBsZW1lbnQgZm9sbG93ZWQgYnkgYSBkb3RcbiAgICAgIC8vIGluIHRydXN0ZWRFbmRwb2ludHMgbGlzdFxuICAgICAgLy8gZWc6IHBvc3Qucm91dGUudHNcbiAgICAgIC8vIGVnOiBnZXQuYWxsQnlCdXNpbmVzcy5yb3V0ZS50c1xuICAgICAgaWYgKFxuICAgICAgICAgICBtZXRob2QgIT09ICdnZXQnXG4gICAgICAgICYmIG1ldGhvZCAhPT0gJ3Bvc3QnXG4gICAgICAgICYmIG1ldGhvZCAhPT0gJ3B1dCdcbiAgICAgICAgJiYgbWV0aG9kICE9PSAnZGVsZXRlJ1xuICAgICAgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgcm91dGVDbGFzcyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgIGNvbnN0IHJvdXRlSW5zdGFuY2U6IFJvdXRlSGFuZGxlckJhc2UgPSBuZXcgcm91dGVDbGFzcyhzZXJ2aWNlLnJlc291cmNlcyk7XG5cbiAgICAgICAgYXdhaXQgc2VydmljZS5sb2FkUm91dGUocm91dGVJbnN0YW5jZSwgbWV0aG9kKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlcnZpY2UucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgRXZlbnQgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgYXdhaXQgbG9hZFJvdXRlcyhzZXJ2aWNlLCBwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBsb2dBcGlSb3V0ZSA9IChyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gIHJlc291cmNlcy5sb2dnZXIuaW5mbyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwpO1xuXG4gIGNvbnN0IGNsZWFudXAgPSAoKSA9PiB7XG4gICAgcmVzLnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBsb2dGaW5pc2gpO1xuICB9O1xuXG4gIGNvbnN0IGxvZ0ZpbmlzaCA9ICgpID0+IHtcbiAgICBjbGVhbnVwKCk7XG5cbiAgICBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNTAwKSB7XG4gICAgICByZXNvdXJjZXMubG9nZ2VyLmVycm9yKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgICByZXNvdXJjZXMubG9nZ2VyLmVycm9yKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPCAzMDAgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwKSB7XG4gICAgICByZXNvdXJjZXMubG9nZ2VyLmluZm8ocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIuaW5mbyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICB9XG4gIH07XG5cbiAgcmVzLm9uKCdmaW5pc2gnLCBsb2dGaW5pc2gpO1xuXG4gIG5leHQoKTtcbn07XG5cbmV4cG9ydCB7XG4gIGV4cHJlc3MsXG4gIEV4cHJlc3MsXG4gIE5leHRGdW5jdGlvbixcbiAgUmVxdWVzdCxcbiAgUmVzcG9uc2UsXG4gIFRydXN0ZWRFbmRwb2ludHMsXG4gIGxvYWRSb3V0ZXMsXG4gIGxvZ0FwaVJvdXRlLFxufTtcbiJdfQ==