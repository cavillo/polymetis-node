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
        if (_.endsWith(handlerName, '.event.ts')) {
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
        if (_.endsWith(handlerName, '.task.ts')) {
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
        if (_.endsWith(handlerName, '.rpc.ts')) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCLGdFQUF3QztBQTZJdEMsc0JBN0lLLHFCQUFXLENBNklMO0FBNUliLDBFQUFrRDtBQTZJaEQsMkJBN0lLLDBCQUFnQixDQTZJTDtBQTVJbEIsd0VBQWdEO0FBNkk5QywwQkE3SUsseUJBQWUsQ0E2SUw7QUE1SWpCLHNFQUE4QztBQTZJNUMseUJBN0lLLHdCQUFjLENBNklMO0FBMUloQixNQUFNLFVBQVUsR0FBRyxDQUFPLFNBQTJCLEVBQUUsU0FBYyxFQUFFLEVBQUUsR0FBWSxFQUFnQixFQUFFO0lBQ3JHLElBQUksU0FBaUIsQ0FBQztJQUN0QixJQUFJLEdBQUcsRUFBRTtRQUNQLFNBQVMsR0FBRyxHQUFHLENBQUM7S0FDakI7U0FBTTtRQUNMLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQ3JFO0lBRUQsSUFBSSxRQUFrQixDQUFDO0lBQ3ZCLElBQUk7UUFDRixRQUFRLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUN0QztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTztLQUNSO0lBRUQsS0FBSyxNQUFNLFdBQVcsSUFBSSxRQUFRLEVBQUU7UUFDbEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsRUFBRTtZQUN4QyxJQUFJO2dCQUNGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFP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QUMsR0FBRyxPQUFPLENBQUM7YUFDL0I7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsV0FBVyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDNUU7U0FDRjthQUFNO1lBQ0wsSUFBSTtnQkFDRixrQ0FBa0M7Z0JBQ2xDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDbEU7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCw0RUFBNEU7Z0JBQzVFLFNBQVM7YUFDVjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQSxDQUFDO0FBU0EsMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQgSGFuZGxlckJhc2UgZnJvbSAnLi9IYW5kbGVyQmFzZSc7XG5pbXBvcnQgRXZlbnRIYW5kbGVyQmFzZSBmcm9tICcuL0V2ZW50SGFuZGxlckJhc2UnO1xuaW1wb3J0IFRhc2tIYW5kbGVyQmFzZSBmcm9tICcuL1Rhc2tIYW5kbGVyQmFzZSc7XG5pbXBvcnQgUlBDSGFuZGxlckJhc2UgZnJvbSAnLi9SUENIYW5kbGVyQmFzZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzIH0gZnJvbSAnLi4vJztcblxuY29uc3QgbG9hZEV2ZW50cyA9IGFzeW5jIChyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMsIGV2ZW50czogYW55ID0ge30sIGRpcj86IHN0cmluZyk6IFByb21pc2U8YW55PiA9PiB7XG4gIGxldCBldmVudHNEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIGV2ZW50c0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICBldmVudHNEaXIgPSBwYXRoLmpvaW4ocmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vZXZlbnRzLycpO1xuICB9XG5cbiAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgdHJ5IHtcbiAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKGV2ZW50c0Rpcik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKGV2ZW50c0RpciwgaGFuZGxlck5hbWUpO1xuICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLmV2ZW50LnRzJykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgY29uc3QgaGFuZGxlcjogSGFuZGxlckJhc2UgPSBuZXcgaGFuZGxlclNwZWMocmVzb3VyY2VzKTtcblxuICAgICAgICBpZiAoXy5oYXMoZXZlbnRzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBldmVudCBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgICAgIGV2ZW50c1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmVjdXJzZSBkb3duIHRoZSBkaXJlY3RvcnkgdHJlZVxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRFdmVudHMocmVzb3VyY2VzLCBldmVudHMsIHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyByZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZXZlbnRzO1xufTtcblxuY29uc3QgbG9hZFRhc2tzID0gYXN5bmMgKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgdGFza3M6IGFueSA9IHt9LCBkaXI/OiBzdHJpbmcpOiBQcm9taXNlPGFueT4gPT4ge1xuICBsZXQgdGFza3NEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIHRhc2tzRGlyID0gZGlyO1xuICB9IGVsc2Uge1xuICAgIHRhc2tzRGlyID0gcGF0aC5qb2luKHJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL3Rhc2tzLycpO1xuICB9XG5cbiAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgdHJ5IHtcbiAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHRhc2tzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4odGFza3NEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnRhc2sudHMnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICBjb25zdCBoYW5kbGVyOiBIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyhyZXNvdXJjZXMpO1xuXG4gICAgICAgIGlmIChfLmhhcyh0YXNrcywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgdGFzayBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgICAgIHRhc2tzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFRhc2tzKHJlc291cmNlcywgdGFza3MsIHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyByZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFza3M7XG59O1xuXG5jb25zdCBsb2FkUlBDID0gYXN5bmMgKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgcnBjczogYW55ID0ge30sIGRpcj86IHN0cmluZyk6IFByb21pc2U8YW55PiA9PiB7XG4gIGxldCBycGNzRGlyOiBzdHJpbmc7XG4gIGlmIChkaXIpIHtcbiAgICBycGNzRGlyID0gZGlyO1xuICB9IGVsc2Uge1xuICAgIHJwY3NEaXIgPSBwYXRoLmpvaW4ocmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vcnBjLycpO1xuICB9XG5cbiAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgdHJ5IHtcbiAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHJwY3NEaXIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICBjb25zdCBoYW5kbGVyUGF0aCA9IHBhdGguam9pbihycGNzRGlyLCBoYW5kbGVyTmFtZSk7XG5cbiAgICBpZiAoXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5ycGMudHMnKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICBjb25zdCBoYW5kbGVyOiBIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyhyZXNvdXJjZXMpO1xuXG4gICAgICAgIGlmIChfLmhhcyhycGNzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBycGMgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgICAgICBycGNzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZFJQQyhyZXNvdXJjZXMsIHJwY3MsIHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyByZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcnBjcztcbn07XG5cbmV4cG9ydCB7XG4gIEhhbmRsZXJCYXNlLFxuICBFdmVudEhhbmRsZXJCYXNlLFxuICBUYXNrSGFuZGxlckJhc2UsXG4gIFJQQ0hhbmRsZXJCYXNlLFxuICBsb2FkRXZlbnRzLFxuICBsb2FkVGFza3MsXG4gIGxvYWRSUEMsXG59O1xuIl19