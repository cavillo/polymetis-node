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
const RouteHandlerBase_1 = __importDefault(require("../base/RouteHandlerBase"));
exports.ApiRoute = RouteHandlerBase_1.default;
const loadRoutes = (app, resources, routes = {}, dir) => __awaiter(this, void 0, void 0, function* () {
    const apiPrefix = _.get(resources, 'configuration.api.prefix', '/api');
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
                resources.logger.info('-', `${_.toUpper(method)}`, routeInstance.url);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQVBJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0FQSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixzREFBNEU7QUFPMUUsa0JBUEssaUJBQU8sQ0FPTDtBQU5ULDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFFekIsZ0ZBQWdEO0FBUTlDLG1CQVJLLDBCQUFRLENBUUw7QUFLVixNQUFNLFVBQVUsR0FBRyxDQUFPLEdBQVksRUFBRSxTQUEyQixFQUFFLFNBQWMsRUFBRSxFQUFFLEdBQVksRUFBRSxFQUFFO0lBQ3JHLE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRCxJQUFJLFNBQWlCLENBQUM7SUFDdEIsSUFBSSxHQUFHLEVBQUU7UUFDUCxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ2pCO1NBQU07UUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNsRTtJQUVELElBQUksUUFBa0IsQ0FBQztJQUN2QixJQUFJO1FBQ0YsUUFBUSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU87S0FDUjtJQUVELEtBQUssTUFBTSxXQUFXLElBQUksUUFBUSxFQUFFO1FBQ2xDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFD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Q0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckU7YUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQ2hDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDckU7YUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQ3hELFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEU7YUFBTTtZQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEU7SUFDSCxDQUFDLENBQUM7SUFFRixHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUU1QixJQUFJLEVBQUUsQ0FBQztBQUNULENBQUMsQ0FBQztBQWpHQSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBleHByZXNzLCB7IEV4cHJlc3MsIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBBcGlSb3V0ZSBmcm9tICcuLi9iYXNlL1JvdXRlSGFuZGxlckJhc2UnO1xuaW1wb3J0IHsgU2VydmljZVJlc291cmNlcyB9IGZyb20gJy4uLyc7XG5leHBvcnQge1xuICBleHByZXNzLFxuICBFeHByZXNzLFxuICBOZXh0RnVuY3Rpb24sXG4gIFJlcXVlc3QsXG4gIFJlc3BvbnNlLFxuICBBcGlSb3V0ZSxcbiAgbG9hZFJvdXRlcyxcbiAgbG9nQXBpUm91dGUsXG59O1xuXG5jb25zdCBsb2FkUm91dGVzID0gYXN5bmMgKGFwcDogRXhwcmVzcywgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzLCByb3V0ZXM6IGFueSA9IHt9LCBkaXI/OiBzdHJpbmcpID0+IHtcbiAgY29uc3QgYXBpUHJlZml4ID0gXy5nZXQocmVzb3VyY2VzLCAnY29uZmlndXJhdGlvbi5hcGkucHJlZml4JywgJy9hcGknKTtcbiAgY29uc3QgdHJ1c3RlZEVuZHBvaW50cyA9IFsnZ2V0JywgJ2RlbGV0ZScsICdwdXQnLCAncG9zdCddO1xuICBsZXQgcm91dGVzRGlyOiBzdHJpbmc7XG4gIGlmIChkaXIpIHtcbiAgICByb3V0ZXNEaXIgPSBkaXI7XG4gIH0gZWxzZSB7XG4gICAgcm91dGVzRGlyID0gcGF0aC5qb2luKHJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL2FwaS8nKTtcbiAgfVxuXG4gIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gIHRyeSB7XG4gICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyhyb3V0ZXNEaXIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICBjb25zdCBoYW5kbGVyUGF0aCA9IHBhdGguam9pbihyb3V0ZXNEaXIsIGhhbmRsZXJOYW1lKTtcbiAgICBjb25zdCBtZXRob2QgPSBfLnRvTG93ZXIoaGFuZGxlck5hbWUuc3BsaXQoJy4nKVswXSk7XG5cbiAgICBpZiAoXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5yb3V0ZS50cycpKSB7XG4gICAgICAvLyBza2lwIG5vbiByb3V0ZSB0cyBmaWxlc1xuICAgICAgLy8gYWxsIHJvdXRlcyBzaG91bGQgZW5kIGluIHJvdXRlLnRzXG4gICAgICAvLyBhbGwgcm91dGVzIHNob3VsZCBzdGFydCB3aXRoIHRoZSBIVFRQIG1ldGhvZCB0byBpbXBsZW1lbnQgZm9sbG93ZWQgYnkgYSBkb3RcbiAgICAgIC8vIGluIHRydXN0ZWRFbmRwb2ludHMgbGlzdFxuICAgICAgLy8gZWc6IHBvc3Qucm91dGUudHNcbiAgICAgIC8vIGVnOiBnZXQuYWxsQnlCdXNpbmVzcy5yb3V0ZS50c1xuICAgICAgaWYgKFxuICAgICAgICAhXy5pbmNsdWRlcyh0cnVzdGVkRW5kcG9pbnRzLCBtZXRob2QpXG4gICAgICApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgY29uc3Qgcm91dGVJbnN0YW5jZTogQXBpUm91dGUgPSBuZXcgcm91dGVDbGFzcyhyZXNvdXJjZXMpO1xuXG4gICAgICAgIGNvbnN0IHJvdXRlVVJMID0gYCR7YXBpUHJlZml4fSR7cm91dGVJbnN0YW5jZS51cmx9YDtcblxuICAgICAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgICAgIGNhc2UgJ2dldCc6XG4gICAgICAgICAgICBhcHAuZ2V0KHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwb3N0JzpcbiAgICAgICAgICAgIGFwcC5wb3N0KHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwdXQnOlxuICAgICAgICAgICAgYXBwLnB1dChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgIGFwcC5kZWxldGUocm91dGVVUkwsIHJvdXRlSW5zdGFuY2Uucm91dGVDYWxsYmFjay5iaW5kKHJvdXRlSW5zdGFuY2UpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgcm91dGVzW3JvdXRlSW5zdGFuY2UudXJsXSA9IHJvdXRlSW5zdGFuY2U7XG4gICAgICAgIHJlc291cmNlcy5sb2dnZXIuaW5mbygnLScsIGAke18udG9VcHBlcihtZXRob2QpfWAsIHJvdXRlSW5zdGFuY2UudXJsKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IGxvYWRSb3V0ZXMoYXBwLCByZXNvdXJjZXMsIHJvdXRlcywgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuY29uc3QgbG9nQXBpUm91dGUgPSAocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzLCByZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICByZXNvdXJjZXMubG9nZ2VyLmluZm8ocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsKTtcblxuICBjb25zdCBjbGVhbnVwID0gKCkgPT4ge1xuICAgIHJlcy5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgbG9nRmluaXNoKTtcbiAgfTtcblxuICBjb25zdCBsb2dGaW5pc2ggPSAoKSA9PiB7XG4gICAgY2xlYW51cCgpO1xuXG4gICAgaWYgKHJlcy5zdGF0dXNDb2RlID49IDUwMCkge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlID49IDQwMCkge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlIDwgMzAwICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCkge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5pbmZvKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvdXJjZXMubG9nZ2VyLmluZm8ocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgfVxuICB9O1xuXG4gIHJlcy5vbignZmluaXNoJywgbG9nRmluaXNoKTtcblxuICBuZXh0KCk7XG59O1xuIl19