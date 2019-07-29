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
const Route_1 = __importDefault(require("./Route"));
exports.ApiRoute = Route_1.default;
const loadRoutes = (app, resources, routes = {}, dir) => __awaiter(this, void 0, void 0, function* () {
    const trustedEndpoints = ['get', 'delete', 'put', 'post'];
    let routesDir;
    if (dir) {
        routesDir = dir;
    }
    else {
        routesDir = path.join(resources.configuration.baseDir, './api/');
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
        if (_.endsWith(handlerName, '.route.ts')) {
            // skip non route ts files
            // all routes should end in route.ts
            // all routes should start with the HTTP method to implement followed by a dot
            // in trustedEndpoints list
            // eg: post.route.ts
            // eg: get.allByBusiness.route.ts
            if (!_.includes(trustedEndpoints, method)) {
                continue;
            }
            try {
                const routeClass = require(handlerPath).default;
                const routeInstance = new routeClass(resources);
                const apiPrefix = '/api';
                const routeURL = `${apiPrefix}${routeInstance.url}`;
                switch (method) {
                    case 'get':
                        app.get(routeURL, routeInstance.routeCallback.bind(routeInstance));
                        break;
                    case 'post':
                        app.post(routeURL, routeInstance.routeCallback.bind(routeInstance));
                        break;
                    case 'put':
                        app.put(routeURL, routeInstance.routeCallback.bind(routeInstance));
                        break;
                    case 'delete':
                        app.delete(routeURL, routeInstance.routeCallback.bind(routeInstance));
                        break;
                }
                routes[routeInstance.url] = routeInstance;
                resources.logger.log('-', `${_.toUpper(method)}`, routeInstance.url);
            }
            catch (error) {
                resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield loadRoutes(app, resources, routes, path.join(handlerPath, '/'));
            }
            catch (error) {
                // resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
            }
        }
    }
});
exports.loadRoutes = loadRoutes;
const logApiRoute = (resources, req, res, next) => {
    resources.logger.log(req.method, req.originalUrl);
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
            resources.logger.log(req.method, req.originalUrl, res.statusCode);
        }
        else {
            resources.logger.log(req.method, req.originalUrl, res.statusCode);
        }
    };
    res.on('finish', logFinish);
    next();
};
exports.logApiRoute = logApiRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLHNEQUE0RTtBQU8xRSxrQkFQSyxpQkFBTyxDQU9MO0FBTlQsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUV6QixvREFBK0I7QUFRN0IsbUJBUkssZUFBUSxDQVFMO0FBS1YsTUFBTSxVQUFVLEdBQUcsQ0FBTyxHQUFZLEVBQUUsU0FBMkIsRUFBRSxTQUFjLEVBQUUsRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUN0RyxNQUFNLGdCQUFnQixHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUQsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLElBQUksR0FBRyxFQUFFO1FBQ1AsU0FBUyxHQUFHLEdBQUcsQ0FBQztLQUNqQjtTQUFNO1FBQ0wsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbEU7SUFFRCxJQUFJLFFBQWtCLENBQUM7SUFDdkIsSUFBSTtRQUNGLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3RDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPO0tBQ1I7SUFFRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFFBQVEsRUFBRTtRQUNsQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0RCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMs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QUMsVUFBVSxDQUFDLENBQUM7U0FDckU7YUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQ2hDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckU7YUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQ3hELFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbkU7YUFBTTtZQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbkU7SUFDSCxDQUFDLENBQUM7SUFFRixHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUU1QixJQUFJLEVBQUUsQ0FBQztBQUNULENBQUMsQ0FBQztBQWpHQSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBleHByZXNzLCB7IEV4cHJlc3MsIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBBcGlSb3V0ZSBmcm9tICcuL1JvdXRlJztcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLi8nO1xuZXhwb3J0IHtcbiAgZXhwcmVzcyxcbiAgRXhwcmVzcyxcbiAgTmV4dEZ1bmN0aW9uLFxuICBSZXF1ZXN0LFxuICBSZXNwb25zZSxcbiAgQXBpUm91dGUsXG4gIGxvYWRSb3V0ZXMsXG4gIGxvZ0FwaVJvdXRlLFxufTtcblxuY29uc3QgbG9hZFJvdXRlcyA9IGFzeW5jIChhcHA6IEV4cHJlc3MsIHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgcm91dGVzOiBhbnkgPSB7fSwgZGlyID86IHN0cmluZykgPT4ge1xuICBjb25zdCB0cnVzdGVkRW5kcG9pbnRzID0gWydnZXQnLCAnZGVsZXRlJywgJ3B1dCcsICdwb3N0J107XG4gIGxldCByb3V0ZXNEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIHJvdXRlc0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICByb3V0ZXNEaXIgPSBwYXRoLmpvaW4ocmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vYXBpLycpO1xuICB9XG5cbiAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgdHJ5IHtcbiAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHJvdXRlc0Rpcik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHJvdXRlc0RpciwgaGFuZGxlck5hbWUpO1xuICAgIGNvbnN0IG1ldGhvZCA9IF8udG9Mb3dlcihoYW5kbGVyTmFtZS5zcGxpdCgnLicpWzBdKTtcblxuICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJvdXRlLnRzJykpIHtcbiAgICAgIC8vIHNraXAgbm9uIHJvdXRlIHRzIGZpbGVzXG4gICAgICAvLyBhbGwgcm91dGVzIHNob3VsZCBlbmQgaW4gcm91dGUudHNcbiAgICAgIC8vIGFsbCByb3V0ZXMgc2hvdWxkIHN0YXJ0IHdpdGggdGhlIEhUVFAgbWV0aG9kIHRvIGltcGxlbWVudCBmb2xsb3dlZCBieSBhIGRvdFxuICAgICAgLy8gaW4gdHJ1c3RlZEVuZHBvaW50cyBsaXN0XG4gICAgICAvLyBlZzogcG9zdC5yb3V0ZS50c1xuICAgICAgLy8gZWc6IGdldC5hbGxCeUJ1c2luZXNzLnJvdXRlLnRzXG4gICAgICBpZiAoXG4gICAgICAgICFfLmluY2x1ZGVzKHRydXN0ZWRFbmRwb2ludHMsIG1ldGhvZClcbiAgICAgICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ2xhc3MgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICBjb25zdCByb3V0ZUluc3RhbmNlOiBBcGlSb3V0ZSA9IG5ldyByb3V0ZUNsYXNzKHJlc291cmNlcyk7XG5cbiAgICAgICAgY29uc3QgYXBpUHJlZml4ID0gJy9hcGknO1xuICAgICAgICBjb25zdCByb3V0ZVVSTCA9IGAke2FwaVByZWZpeH0ke3JvdXRlSW5zdGFuY2UudXJsfWA7XG5cbiAgICAgICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgICBjYXNlICdnZXQnOlxuICAgICAgICAgICAgYXBwLmdldChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgICAgICBhcHAucG9zdChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncHV0JzpcbiAgICAgICAgICAgIGFwcC5wdXQocm91dGVVUkwsIHJvdXRlSW5zdGFuY2Uucm91dGVDYWxsYmFjay5iaW5kKHJvdXRlSW5zdGFuY2UpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICBhcHAuZGVsZXRlKHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdXRlc1tyb3V0ZUluc3RhbmNlLnVybF0gPSByb3V0ZUluc3RhbmNlO1xuICAgICAgICByZXNvdXJjZXMubG9nZ2VyLmxvZygnLScsIGAke18udG9VcHBlcihtZXRob2QpfWAsIHJvdXRlSW5zdGFuY2UudXJsKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IGxvYWRSb3V0ZXMoYXBwLCByZXNvdXJjZXMsIHJvdXRlcywgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIHJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJyZWN1cnNpbmcgZG93biAke2hhbmRsZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGxvZ0FwaVJvdXRlID0gKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgcmVzb3VyY2VzLmxvZ2dlci5sb2cocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsKTtcblxuICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgIHJlcy5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgbG9nRmluaXNoKTtcbiAgfTtcblxuICBjb25zdCBsb2dGaW5pc2ggPSAoKSA9PiB7XG4gICAgY2xlYW51cCgpO1xuXG4gICAgaWYgKHJlcy5zdGF0dXNDb2RlID49IDUwMCkge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlID49IDQwMCkge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlIDwgMzAwICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCkge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5sb2cocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIubG9nKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIH1cbiAgfTtcblxuICByZXMub24oJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG5cbiAgbmV4dCgpO1xufTtcbiJdfQ==