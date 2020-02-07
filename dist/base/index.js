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
const loadEvents = (resources, events = {}, dir) => __awaiter(this, void 0, void 0, function* () {
    let eventsDir;
    if (dir) {
        eventsDir = dir;
    }
    else {
        eventsDir = path.join(resources.configuration.baseDir, './events/');
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
                const handler = new handlerSpec(resources);
                if (_.has(events, handler.topic)) {
                    throw new Error(`Duplicated event listener: ${handler.topic}`);
                }
                yield handler.init();
                events[handler.topic] = handler;
            }
            catch (error) {
                resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield this.loadEvents(resources, events, path.join(handlerPath, '/'));
            }
            catch (error) {
                // resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
                continue;
            }
        }
    }
    return events;
});
exports.loadEvents = loadEvents;
const loadTasks = (resources, tasks = {}, dir) => __awaiter(this, void 0, void 0, function* () {
    let tasksDir;
    if (dir) {
        tasksDir = dir;
    }
    else {
        tasksDir = path.join(resources.configuration.baseDir, './tasks/');
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
                const handler = new handlerSpec(resources);
                if (_.has(tasks, handler.topic)) {
                    throw new Error(`Duplicated task listener: ${handler.topic}`);
                }
                yield handler.init();
                tasks[handler.topic] = handler;
            }
            catch (error) {
                resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield this.loadTasks(resources, tasks, path.join(handlerPath, '/'));
            }
            catch (error) {
                // resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
                continue;
            }
        }
    }
    return tasks;
});
exports.loadTasks = loadTasks;
const loadRPC = (resources, rpcs = {}, dir) => __awaiter(this, void 0, void 0, function* () {
    let rpcsDir;
    if (dir) {
        rpcsDir = dir;
    }
    else {
        rpcsDir = path.join(resources.configuration.baseDir, './rpc/');
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
                const handler = new handlerSpec(resources);
                if (_.has(rpcs, handler.topic)) {
                    throw new Error(`Duplicated rpc listener: ${handler.topic}`);
                }
                yield handler.init();
                rpcs[handler.topic] = handler;
            }
            catch (error) {
                resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
            }
        }
        else {
            try {
                // recurse down the directory tree
                yield this.loadRPC(resources, rpcs, path.join(handlerPath, '/'));
            }
            catch (error) {
                // resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
                continue;
            }
        }
    }
    return rpcs;
});
exports.loadRPC = loadRPC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCLGtEQUEwQjtBQXVKeEIsZUF2SkssY0FBSSxDQXVKTDtBQXRKTixnRUFBd0M7QUF1SnRDLHNCQXZKSyxxQkFBVyxDQXVKTDtBQXRKYiwwRUFBa0Q7QUF1SmhELDJCQXZKSywwQkFBZ0IsQ0F1Skw7QUF0SmxCLHdFQUFnRDtBQXVKOUMsMEJBdkpLLHlCQUFlLENBdUpMO0FBdEpqQixzRUFBOEM7QUF1SjVDLHlCQXZKSyx3QkFBYyxDQXVKTDtBQXBKaEIsTUFBTSxVQUFVLEdBQUcsQ0FBTyxTQUEyQixFQUFFLFNBQWMsRUFBRSxFQUFFLEdBQVksRUFBZ0IsRUFBRTtJQUNyRyxJQUFJLFNBQWlCLENBQUM7SUFDdEIsSUFBSSxHQUFHLEVBQUU7UUFDUCxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ2pCO1NBQU07UUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztLQUNyRTtJQUVELElBQUksUUFBa0IsQ0FBQztJQUN2QixJQUFJO1FBQ0YsUUFBUSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU87S0FDUjtJQUVELEtBQUssTUFBTSxXQUFXLElBQUksUUFBUSxFQUFFO1FBQ2xDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RELElBQ00sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsY0FBYztlQUNuRCxDQUFDLENBQUMsUUFB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SSxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXhELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLDRCQUE0QixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDOUQ7Z0JBRUQsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO2FBQy9CO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLFdBQVcsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQzVFO1NBQ0Y7YUFBTTtZQUNMLElBQUk7Z0JBQ0Ysa0NBQWtDO2dCQUNsQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2xFO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsNEVBQTRFO2dCQUM1RSxTQUFTO2FBQ1Y7U0FDRjtLQUNGO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUEsQ0FBQztBQVVBLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuL0hhbmRsZXJCYXNlJztcbmltcG9ydCBFdmVudEhhbmRsZXJCYXNlIGZyb20gJy4vRXZlbnRIYW5kbGVyQmFzZSc7XG5pbXBvcnQgVGFza0hhbmRsZXJCYXNlIGZyb20gJy4vVGFza0hhbmRsZXJCYXNlJztcbmltcG9ydCBSUENIYW5kbGVyQmFzZSBmcm9tICcuL1JQQ0hhbmRsZXJCYXNlJztcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLi8nO1xuXG5jb25zdCBsb2FkRXZlbnRzID0gYXN5bmMgKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgZXZlbnRzOiBhbnkgPSB7fSwgZGlyPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgbGV0IGV2ZW50c0Rpcjogc3RyaW5nO1xuICBpZiAoZGlyKSB7XG4gICAgZXZlbnRzRGlyID0gZGlyO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50c0RpciA9IHBhdGguam9pbihyZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9ldmVudHMvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMoZXZlbnRzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4oZXZlbnRzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgaWYgKFxuICAgICAgICAgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcuZXZlbnQudHMnKSAvLyBUeXNwZVNjcmlwdFxuICAgICAgfHwgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcuZXZlbnQuanMnKSAvLyBKYXZhU2NyaXB0XG4gICAgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoYW5kbGVyU3BlYyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgIGNvbnN0IGhhbmRsZXI6IEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHJlc291cmNlcyk7XG5cbiAgICAgICAgaWYgKF8uaGFzKGV2ZW50cywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgZXZlbnQgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgICAgICBldmVudHNbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgRXZlbnQgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkRXZlbnRzKHJlc291cmNlcywgZXZlbnRzLCBwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUnJlY3Vyc2luZyBkb3duICR7aGFuZGxlclBhdGh9OiAke2Vycm9yfWApO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV2ZW50cztcbn07XG5cbmNvbnN0IGxvYWRUYXNrcyA9IGFzeW5jIChyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIHRhc2tzOiBhbnkgPSB7fSwgZGlyPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgbGV0IHRhc2tzRGlyOiBzdHJpbmc7XG4gIGlmIChkaXIpIHtcbiAgICB0YXNrc0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICB0YXNrc0RpciA9IHBhdGguam9pbihyZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi90YXNrcy8nKTtcbiAgfVxuXG4gIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gIHRyeSB7XG4gICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyh0YXNrc0Rpcik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHRhc2tzRGlyLCBoYW5kbGVyTmFtZSk7XG5cbiAgICBpZiAoXG4gICAgICAgICAgXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy50YXNrLnRzJykgLy8gVHlzcGVTY3JpcHRcbiAgICAgIHx8ICBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnRhc2suanMnKSAvLyBKYXZhU2NyaXB0XG4gICAgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoYW5kbGVyU3BlYyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgIGNvbnN0IGhhbmRsZXI6IEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHJlc291cmNlcyk7XG5cbiAgICAgICAgaWYgKF8uaGFzKHRhc2tzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCB0YXNrIGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICAgICAgdGFza3NbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgRXZlbnQgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkVGFza3MocmVzb3VyY2VzLCB0YXNrcywgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIHJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJyZWN1cnNpbmcgZG93biAke2hhbmRsZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXNrcztcbn07XG5cbmNvbnN0IGxvYWRSUEMgPSBhc3luYyAocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzLCBycGNzOiBhbnkgPSB7fSwgZGlyPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgbGV0IHJwY3NEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIHJwY3NEaXIgPSBkaXI7XG4gIH0gZWxzZSB7XG4gICAgcnBjc0RpciA9IHBhdGguam9pbihyZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9ycGMvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMocnBjc0Rpcik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHJwY3NEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgIGlmIChcbiAgICAgICAgICBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJwYy50cycpIC8vIFR5c3BlU2NyaXB0XG4gICAgICB8fCAgXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5ycGMuanMnKSAvLyBKYXZhU2NyaXB0XG4gICAgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoYW5kbGVyU3BlYyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgIGNvbnN0IGhhbmRsZXI6IEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHJlc291cmNlcyk7XG5cbiAgICAgICAgaWYgKF8uaGFzKHJwY3MsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIHJwYyBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgICAgIHJwY3NbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgRXZlbnQgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkUlBDKHJlc291cmNlcywgcnBjcywgcGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIHJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJyZWN1cnNpbmcgZG93biAke2hhbmRsZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBycGNzO1xufTtcblxuZXhwb3J0IHtcbiAgQmFzZSxcbiAgSGFuZGxlckJhc2UsXG4gIEV2ZW50SGFuZGxlckJhc2UsXG4gIFRhc2tIYW5kbGVyQmFzZSxcbiAgUlBDSGFuZGxlckJhc2UsXG4gIGxvYWRFdmVudHMsXG4gIGxvYWRUYXNrcyxcbiAgbG9hZFJQQyxcbn07XG4iXX0=