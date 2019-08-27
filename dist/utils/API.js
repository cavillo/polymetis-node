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
    const apiBaseRoute = _.isEmpty(resources.configuration.api.baseRoute) ? '' : resources.configuration.api.baseRoute;
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
                const routeURL = `${apiBaseRoute}${routeInstance.url}`;
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
                resources.logger.info('-', `${_.toUpper(method)}`, routeURL);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQVBJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0FQSS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixzREFBNEU7QUFPMUUsa0JBUEssaUJBQU8sQ0FPTDtBQU5ULDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFFekIsZ0ZBQWdEO0FBUTlDLG1CQVJLLDBCQUFRLENBUUw7QUFLVixNQUFNLFVBQVUsR0FBRyxDQUFPLEdBQVksRUFBRSxTQUEyQixFQUFFLFNBQWMsRUFBRSxFQUFFLEdBQVksRUFBRSxFQUFFO0lBQ3JHLE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDO0lBQ25ILE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMxRCxJQUFJLFNBQWlCLENBQUM7SUFDdEIsSUFBSSxHQUFHLEVBQUU7UUFDUCxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ2pCO1NBQU07UUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNsRTtJQUVELElBQUksUUFBa0IsQ0FBQztJQUN2QixJQUFJO1FBQ0YsUUFBUSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU87S0FDUjtJQUVELEtBQUssTUFBTSxXQUFXLElBQUksUUFBUSxFQUFFO1FBQ2xDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENB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RyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7WUFDekIsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyRTthQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7WUFDaEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNyRTthQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7WUFDeEQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwRTthQUFNO1lBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNwRTtJQUNILENBQUMsQ0FBQztJQUVGLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTVCLElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQyxDQUFDO0FBakdBLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGV4cHJlc3MsIHsgRXhwcmVzcywgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuaW1wb3J0IEFwaVJvdXRlIGZyb20gJy4uL2Jhc2UvUm91dGVIYW5kbGVyQmFzZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzIH0gZnJvbSAnLi4vJztcbmV4cG9ydCB7XG4gIGV4cHJlc3MsXG4gIEV4cHJlc3MsXG4gIE5leHRGdW5jdGlvbixcbiAgUmVxdWVzdCxcbiAgUmVzcG9uc2UsXG4gIEFwaVJvdXRlLFxuICBsb2FkUm91dGVzLFxuICBsb2dBcGlSb3V0ZSxcbn07XG5cbmNvbnN0IGxvYWRSb3V0ZXMgPSBhc3luYyAoYXBwOiBFeHByZXNzLCByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIHJvdXRlczogYW55ID0ge30sIGRpcj86IHN0cmluZykgPT4ge1xuICBjb25zdCBhcGlCYXNlUm91dGUgPSBfLmlzRW1wdHkocmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLmJhc2VSb3V0ZSkgPyAnJyA6IHJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5iYXNlUm91dGU7XG4gIGNvbnN0IHRydXN0ZWRFbmRwb2ludHMgPSBbJ2dldCcsICdkZWxldGUnLCAncHV0JywgJ3Bvc3QnXTtcbiAgbGV0IHJvdXRlc0Rpcjogc3RyaW5nO1xuICBpZiAoZGlyKSB7XG4gICAgcm91dGVzRGlyID0gZGlyO1xuICB9IGVsc2Uge1xuICAgIHJvdXRlc0RpciA9IHBhdGguam9pbihyZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9hcGkvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMocm91dGVzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4ocm91dGVzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgY29uc3QgbWV0aG9kID0gXy50b0xvd2VyKGhhbmRsZXJOYW1lLnNwbGl0KCcuJylbMF0pO1xuXG4gICAgaWYgKF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucm91dGUudHMnKSkge1xuICAgICAgLy8gc2tpcCBub24gcm91dGUgdHMgZmlsZXNcbiAgICAgIC8vIGFsbCByb3V0ZXMgc2hvdWxkIGVuZCBpbiByb3V0ZS50c1xuICAgICAgLy8gYWxsIHJvdXRlcyBzaG91bGQgc3RhcnQgd2l0aCB0aGUgSFRUUCBtZXRob2QgdG8gaW1wbGVtZW50IGZvbGxvd2VkIGJ5IGEgZG90XG4gICAgICAvLyBpbiB0cnVzdGVkRW5kcG9pbnRzIGxpc3RcbiAgICAgIC8vIGVnOiBwb3N0LnJvdXRlLnRzXG4gICAgICAvLyBlZzogZ2V0LmFsbEJ5QnVzaW5lc3Mucm91dGUudHNcbiAgICAgIGlmIChcbiAgICAgICAgIV8uaW5jbHVkZXModHJ1c3RlZEVuZHBvaW50cywgbWV0aG9kKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3Qgcm91dGVDbGFzcyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgIGNvbnN0IHJvdXRlSW5zdGFuY2U6IEFwaVJvdXRlID0gbmV3IHJvdXRlQ2xhc3MocmVzb3VyY2VzKTtcblxuICAgICAgICBjb25zdCByb3V0ZVVSTCA9IGAke2FwaUJhc2VSb3V0ZX0ke3JvdXRlSW5zdGFuY2UudXJsfWA7XG5cbiAgICAgICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgICBjYXNlICdnZXQnOlxuICAgICAgICAgICAgYXBwLmdldChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgICAgICBhcHAucG9zdChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncHV0JzpcbiAgICAgICAgICAgIGFwcC5wdXQocm91dGVVUkwsIHJvdXRlSW5zdGFuY2Uucm91dGVDYWxsYmFjay5iaW5kKHJvdXRlSW5zdGFuY2UpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICBhcHAuZGVsZXRlKHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdXRlc1tyb3V0ZUluc3RhbmNlLnVybF0gPSByb3V0ZUluc3RhbmNlO1xuICAgICAgICByZXNvdXJjZXMubG9nZ2VyLmluZm8oJy0nLCBgJHtfLnRvVXBwZXIobWV0aG9kKX1gLCByb3V0ZVVSTCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmVjdXJzZSBkb3duIHRoZSBkaXJlY3RvcnkgdHJlZVxuICAgICAgICBhd2FpdCBsb2FkUm91dGVzKGFwcCwgcmVzb3VyY2VzLCByb3V0ZXMsIHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGxvZ0FwaVJvdXRlID0gKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgcmVzb3VyY2VzLmxvZ2dlci5pbmZvKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCk7XG5cbiAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcbiAgICByZXMucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG4gIH07XG5cbiAgY29uc3QgbG9nRmluaXNoID0gKCkgPT4ge1xuICAgIGNsZWFudXAoKTtcblxuICAgIGlmIChyZXMuc3RhdHVzQ29kZSA+PSA1MDApIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgfSBlbHNlIGlmIChyZXMuc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgfSBlbHNlIGlmIChyZXMuc3RhdHVzQ29kZSA8IDMwMCAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDApIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIuaW5mbyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5pbmZvKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIH1cbiAgfTtcblxuICByZXMub24oJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG5cbiAgbmV4dCgpO1xufTtcbiJdfQ==