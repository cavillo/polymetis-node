"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRoutes = void 0;
const _ = __importStar(require("lodash"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const loadRoutes = (service, dir) => __awaiter(void 0, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2xvYWRlcnMvcm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFLekIsTUFBTSxVQUFVLEdBQUcsQ0FBTyxPQUFvQixFQUFFLEdBQVksRUFBRSxFQUFFO0lBQzlELElBQUksU0FBaUIsQ0FBQztJQUN0QixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1IsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUNsQixDQUFDO1NBQU0sQ0FBQztRQUNOLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsSUFBSSxRQUFrQixDQUFDO0lBQ3ZCLElBQUksQ0FBQztRQUNILFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTztJQUNULENBQUM7SUFFRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ25DLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXRELElBQ0UsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsY0FBYztlQUNoRCxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxhQUFhO1VBQ3JELENBQUM7WUFDRCwwQkFBMEI7WUFDMUIsb0NBQW9DO1lBQ3BDLElBQUksQ0FBQztnQkFDSCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNoRCxNQUFNLGFBQWEsR0FBcUIsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUUxRSxNQUFNLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7Z0JBQ2YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixXQUFXLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNyRixDQUFDO1FBQ0gsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUM7Z0JBQ0gsa0NBQWtDO2dCQUNsQyxNQUFNLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RCxDQUFDO1lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztnQkFDZixTQUFTO1lBQ1gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFHQSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCB7IFJvdXRlSGFuZGxlckJhc2UgfSBmcm9tICcuLi8uLi9oYW5kbGVycyc7XG5pbXBvcnQgU2VydmljZUJhc2UgZnJvbSAnLi4vLi4vU2VydmljZUJhc2UnO1xuXG5jb25zdCBsb2FkUm91dGVzID0gYXN5bmMgKHNlcnZpY2U6IFNlcnZpY2VCYXNlLCBkaXI/OiBzdHJpbmcpID0+IHtcbiAgbGV0IHJvdXRlc0Rpcjogc3RyaW5nO1xuICBpZiAoZGlyKSB7XG4gICAgcm91dGVzRGlyID0gZGlyO1xuICB9IGVsc2Uge1xuICAgIHJvdXRlc0RpciA9IHBhdGguam9pbihzZXJ2aWNlLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL2FwaS8nKTtcbiAgfVxuXG4gIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gIHRyeSB7XG4gICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyhyb3V0ZXNEaXIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICBjb25zdCBoYW5kbGVyUGF0aCA9IHBhdGguam9pbihyb3V0ZXNEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgIGlmIChcbiAgICAgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucm91dGUudHMnKSAvLyBUeXNwZVNjcmlwdFxuICAgICAgfHwgXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5yb3V0ZS5qcycpIC8vIEphdmFTY3JpcHRcbiAgICApIHtcbiAgICAgIC8vIHNraXAgbm9uIHJvdXRlIHRzIGZpbGVzXG4gICAgICAvLyBhbGwgcm91dGVzIHNob3VsZCBlbmQgaW4gcm91dGUudHNcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJvdXRlQ2xhc3MgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICBjb25zdCByb3V0ZUluc3RhbmNlOiBSb3V0ZUhhbmRsZXJCYXNlID0gbmV3IHJvdXRlQ2xhc3Moc2VydmljZS5yZXNvdXJjZXMpO1xuXG4gICAgICAgIGF3YWl0IHNlcnZpY2UubG9hZFJvdXRlKHJvdXRlSW5zdGFuY2UpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VydmljZS5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmVjdXJzZSBkb3duIHRoZSBkaXJlY3RvcnkgdHJlZVxuICAgICAgICBhd2FpdCBsb2FkUm91dGVzKHNlcnZpY2UsIHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCB7XG4gIGxvYWRSb3V0ZXMsXG59OyJdfQ==