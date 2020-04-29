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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const Base_1 = __importDefault(require("./Base"));
exports.Base = Base_1.default;
const HandlerBase_1 = __importDefault(require("./HandlerBase"));
exports.HandlerBase = HandlerBase_1.default;
const EventHandlerBase_1 = __importDefault(require("./EventHandlerBase"));
exports.EventHandlerBase = EventHandlerBase_1.default;
const TaskHandlerBase_1 = __importDefault(require("./TaskHandlerBase"));
exports.TaskHandlerBase = TaskHandlerBase_1.default;
const RPCHandlerBase_1 = __importDefault(require("./RPCHandlerBase"));
exports.RPCHandlerBase = RPCHandlerBase_1.default;
const RouteHandlerBase_1 = __importDefault(require("./RouteHandlerBase"));
exports.RouteHandlerBase = RouteHandlerBase_1.default;
const loadEvents = (service, dir) => __awaiter(this, void 0, void 0, function* () {
    let eventsDir;
    if (dir) {
        eventsDir = dir;
    }
    else {
        eventsDir = path.join(service.resources.configuration.baseDir, './events/');
    }
    let handlers;
    try {
        handlers = fs.readdirSync(eventsDir);
    }
    catch (error) {
        return;
    }
    for (const handlerName of handlers) {
        const handlerPath = path.join(eventsDir, handlerName);
        if (_.endsWith(handlerName, '.event.ts') // TyspeScript
            || _.endsWith(handlerName, '.event.js') // JavaScript
        ) {
            try {
                const handlerSpec = require(handlerPath).default;
                const handler = new handlerSpec(service.resources);
                yield service.loadEvent(handler);
            }
            catch (error) {
                service.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield this.loadEvents(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadEvents = loadEvents;
const loadTasks = (service, dir) => __awaiter(this, void 0, void 0, function* () {
    let tasksDir;
    if (dir) {
        tasksDir = dir;
    }
    else {
        tasksDir = path.join(service.resources.configuration.baseDir, './tasks/');
    }
    let handlers;
    try {
        handlers = fs.readdirSync(tasksDir);
    }
    catch (error) {
        return;
    }
    for (const handlerName of handlers) {
        const handlerPath = path.join(tasksDir, handlerName);
        if (_.endsWith(handlerName, '.task.ts') // TyspeScript
            || _.endsWith(handlerName, '.task.js') // JavaScript
        ) {
            try {
                const handlerSpec = require(handlerPath).default;
                const handler = new handlerSpec(service.resources);
                yield service.loadTask(handler);
            }
            catch (error) {
                service.resources.logger.error(`Error Registering Task ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield this.loadTasks(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadTasks = loadTasks;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCLGtEQUEwQjtBQW1JeEIsZUFuSUssY0FBSSxDQW1JTDtBQWxJTixnRUFBd0M7QUFtSXRDLHNCQW5JSyxxQkFBVyxDQW1JTDtBQWxJYiwwRUFBa0Q7QUFtSWhELDJCQW5JSywwQkFBZ0IsQ0FtSUw7QUFsSWxCLHdFQUFnRDtBQW1JOUMsMEJBbklLLHlCQUFlLENBbUlMO0FBbElqQixzRUFBOEM7QUFtSTVDLHlCQW5JSyx3QkFBYyxDQW1JTDtBQWxJaEIsMEVBQWtEO0FBbUloRCwyQkFuSUssMEJBQWdCLENBbUlMO0FBaElsQixNQUFNLFVBQVUsR0FBRyxDQUFPLE9BQW9CLEVBQUUsR0FBWSxFQUFpQixFQUFFO0lBQzdFLElBQUksU0FBaUIsQ0FBQztJQUN0QixJQUFJLEdBQUcsRUFBRTtRQUNQLFNBQVMsR0FBRyxHQUFHLENBQUM7S0FDakI7U0FBTTtRQUNMLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztLQUM3RTtJQUVELElBQUksUUFBa0IsQ0FBQztJQUN2QixJQUFJO1FBQ0YsUUFBUSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU87S0FDUjtJQUVELEtBQUssTUFBTSxXQUFXLElBQUksUUFBUSxFQUFFO1FBQ2xDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELElBQ00sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsV0FB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Q0FBQyxDQUFBLENBQUM7QUFXQSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5pbXBvcnQgSGFuZGxlckJhc2UgZnJvbSAnLi9IYW5kbGVyQmFzZSc7XG5pbXBvcnQgRXZlbnRIYW5kbGVyQmFzZSBmcm9tICcuL0V2ZW50SGFuZGxlckJhc2UnO1xuaW1wb3J0IFRhc2tIYW5kbGVyQmFzZSBmcm9tICcuL1Rhc2tIYW5kbGVyQmFzZSc7XG5pbXBvcnQgUlBDSGFuZGxlckJhc2UgZnJvbSAnLi9SUENIYW5kbGVyQmFzZSc7XG5pbXBvcnQgUm91dGVIYW5kbGVyQmFzZSBmcm9tICcuL1JvdXRlSGFuZGxlckJhc2UnO1xuaW1wb3J0IFNlcnZpY2VCYXNlIGZyb20gJy4uL1NlcnZpY2VCYXNlJztcblxuY29uc3QgbG9hZEV2ZW50cyA9IGFzeW5jIChzZXJ2aWNlOiBTZXJ2aWNlQmFzZSwgZGlyPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGxldCBldmVudHNEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIGV2ZW50c0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICBldmVudHNEaXIgPSBwYXRoLmpvaW4oc2VydmljZS5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9ldmVudHMvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMoZXZlbnRzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4oZXZlbnRzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgaWYgKFxuICAgICAgICAgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcuZXZlbnQudHMnKSAvLyBUeXNwZVNjcmlwdFxuICAgICAgfHwgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcuZXZlbnQuanMnKSAvLyBKYXZhU2NyaXB0XG4gICAgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoYW5kbGVyU3BlYyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgIGNvbnN0IGhhbmRsZXI6IEV2ZW50SGFuZGxlckJhc2UgPSBuZXcgaGFuZGxlclNwZWMoc2VydmljZS5yZXNvdXJjZXMpO1xuXG4gICAgICAgIGF3YWl0IHNlcnZpY2UubG9hZEV2ZW50KGhhbmRsZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VydmljZS5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmVjdXJzZSBkb3duIHRoZSBkaXJlY3RvcnkgdHJlZVxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRFdmVudHMoc2VydmljZSwgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuY29uc3QgbG9hZFRhc2tzID0gYXN5bmMgKHNlcnZpY2U6IFNlcnZpY2VCYXNlLCBkaXI/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgbGV0IHRhc2tzRGlyOiBzdHJpbmc7XG4gIGlmIChkaXIpIHtcbiAgICB0YXNrc0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICB0YXNrc0RpciA9IHBhdGguam9pbihzZXJ2aWNlLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL3Rhc2tzLycpO1xuICB9XG5cbiAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgdHJ5IHtcbiAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHRhc2tzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4odGFza3NEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgIGlmIChcbiAgICAgICAgICBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnRhc2sudHMnKSAvLyBUeXNwZVNjcmlwdFxuICAgICAgfHwgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcudGFzay5qcycpIC8vIEphdmFTY3JpcHRcbiAgICApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgY29uc3QgaGFuZGxlcjogVGFza0hhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHNlcnZpY2UucmVzb3VyY2VzKTtcblxuICAgICAgICBhd2FpdCBzZXJ2aWNlLmxvYWRUYXNrKGhhbmRsZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VydmljZS5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBUYXNrICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFRhc2tzKHNlcnZpY2UsIHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IGxvYWRSUENzID0gYXN5bmMgKHNlcnZpY2U6IFNlcnZpY2VCYXNlLCBkaXI/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgbGV0IHJwY3NEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIHJwY3NEaXIgPSBkaXI7XG4gIH0gZWxzZSB7XG4gICAgcnBjc0RpciA9IHBhdGguam9pbihzZXJ2aWNlLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL3JwYy8nKTtcbiAgfVxuXG4gIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gIHRyeSB7XG4gICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyhycGNzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4ocnBjc0RpciwgaGFuZGxlck5hbWUpO1xuXG4gICAgaWYgKFxuICAgICAgICAgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcucnBjLnRzJykgLy8gVHlzcGVTY3JpcHRcbiAgICAgIHx8ICBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJwYy5qcycpIC8vIEphdmFTY3JpcHRcbiAgICApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgY29uc3QgaGFuZGxlcjogUlBDSGFuZGxlckJhc2UgPSBuZXcgaGFuZGxlclNwZWMoc2VydmljZS5yZXNvdXJjZXMpO1xuXG4gICAgICAgIGF3YWl0IHNlcnZpY2UubG9hZFJQQyhoYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlcnZpY2UucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgUlBDICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFJQQ3Moc2VydmljZSwgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IHtcbiAgQmFzZSxcbiAgSGFuZGxlckJhc2UsXG4gIEV2ZW50SGFuZGxlckJhc2UsXG4gIFRhc2tIYW5kbGVyQmFzZSxcbiAgUlBDSGFuZGxlckJhc2UsXG4gIFJvdXRlSGFuZGxlckJhc2UsXG4gIGxvYWRFdmVudHMsXG4gIGxvYWRUYXNrcyxcbiAgbG9hZFJQQ3MsXG59O1xuIl19