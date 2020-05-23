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
        if (_.endsWith(handlerName, '.route.ts') // TyspeScript
            || _.endsWith(handlerName, '.route.js') // JavaScript
        ) {
            // skip non route ts files
            // all routes should end in route.ts
            try {
                const routeClass = require(handlerPath).default;
                const routeInstance = new routeClass(service.resources);
                yield service.loadRoute(routeInstance);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2xvYWRlcnMvcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFLekIsTUFBTSxVQUFVLEdBQUcsQ0FBTyxPQUFvQixFQUFFLEdBQVksRUFBRSxFQUFFO0lBQzlELElBQUksU0FBaUIsQ0FBQztJQUN0QixJQUFJLEdBQUcsRUFBRTtRQUNQLFNBQVMsR0FBRyxHQUFHLENBQUM7S0FDakI7U0FBTTtRQUNMLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMxRTtJQUVELElBQUksUUFBa0IsQ0FBQztJQUN2QixJQUFJO1FBQ0YsUUFBUSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU87S0FDUjtJQUVELEtBQUssTUFBTSxXQUFXLElBQUksUUFBUSxFQUFFO1FBQ2xDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXRELElBQ0UsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsY0FBYztlQUNoRCxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxhQUFhO1VBQ3JEO1lBQ0EsMEJBQTBCO1lBQzFCLG9DQUFvQztZQUNwQyxJQUFJO2dCQUNGLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2hELE1BQU0sYUFBYSxHQUFxQixJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRTFFLE1BQU0sT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN4QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsV0FBVyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDcEY7U0FDRjthQUFNO1lBQ0wsSUFBSTtnQkFDRixrQ0FBa0M7Z0JBQ2xDLE1BQU0sVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3hEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsU0FBUzthQUNWO1NBQ0Y7S0FDRjtBQUNILENBQUMsQ0FBQSxDQUFDO0FBR0EsZ0NBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQgeyBSb3V0ZUhhbmRsZXJCYXNlIH0gZnJvbSAnLi4vLi4vaGFuZGxlcnMnO1xuaW1wb3J0IFNlcnZpY2VCYXNlIGZyb20gJy4uLy4uL1NlcnZpY2VCYXNlJztcblxuY29uc3QgbG9hZFJvdXRlcyA9IGFzeW5jIChzZXJ2aWNlOiBTZXJ2aWNlQmFzZSwgZGlyPzogc3RyaW5nKSA9PiB7XG4gIGxldCByb3V0ZXNEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIHJvdXRlc0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICByb3V0ZXNEaXIgPSBwYXRoLmpvaW4oc2VydmljZS5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9hcGkvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMocm91dGVzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4ocm91dGVzRGlyLCBoYW5kbGVyTmFtZSk7XG5cbiAgICBpZiAoXG4gICAgICBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJvdXRlLnRzJykgLy8gVHlzcGVTY3JpcHRcbiAgICAgIHx8IF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucm91dGUuanMnKSAvLyBKYXZhU2NyaXB0XG4gICAgKSB7XG4gICAgICAvLyBza2lwIG5vbiByb3V0ZSB0cyBmaWxlc1xuICAgICAgLy8gYWxsIHJvdXRlcyBzaG91bGQgZW5kIGluIHJvdXRlLnRzXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByb3V0ZUNsYXNzID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgY29uc3Qgcm91dGVJbnN0YW5jZTogUm91dGVIYW5kbGVyQmFzZSA9IG5ldyByb3V0ZUNsYXNzKHNlcnZpY2UucmVzb3VyY2VzKTtcblxuICAgICAgICBhd2FpdCBzZXJ2aWNlLmxvYWRSb3V0ZShyb3V0ZUluc3RhbmNlKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlcnZpY2UucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgRXZlbnQgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgYXdhaXQgbG9hZFJvdXRlcyhzZXJ2aWNlLCBwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge1xuICBsb2FkUm91dGVzLFxufTsiXX0=