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
                yield loadTasks(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadTasks = loadTasks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvbG9hZGVycy90YXNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBS3pCLE1BQU0sU0FBUyxHQUFHLENBQU8sT0FBb0IsRUFBRSxHQUFZLEVBQWlCLEVBQUU7SUFDNUUsSUFBSSxRQUFnQixDQUFDO0lBQ3JCLElBQUksR0FBRyxFQUFFO1FBQ1AsUUFBUSxHQUFHLEdBQUcsQ0FBQztLQUNoQjtTQUFNO1FBQ0wsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzNFO0lBRUQsSUFBSSxRQUFrQixDQUFDO0lBQ3ZCLElBQUk7UUFDRixRQUFRLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTztLQUNSO0lBRUQsS0FBSyxNQUFNLFdBQVcsSUFBSSxRQUFRLEVBQUU7UUFDbEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFckQsSUFDRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxjQUFjO2VBQy9DLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLGFBQWE7VUFDcEQ7WUFDQSxJQUFJO2dCQUNGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pELE1BQU0sT0FBTyxHQUFvQixJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXBFLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNqQztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsV0FBVyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDbkY7U0FDRjthQUFNO1lBQ0wsSUFBSTtnQkFDRixrQ0FBa0M7Z0JBQ2xDLE1BQU0sU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3ZEO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsU0FBUzthQUNWO1NBQ0Y7S0FDRjtBQUNILENBQUMsQ0FBQSxDQUFDO0FBR0EsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuXG5pbXBvcnQgVGFza0hhbmRsZXJCYXNlIGZyb20gJy4uLy4uL2hhbmRsZXJzL1Rhc2tIYW5kbGVyQmFzZSc7XG5pbXBvcnQgU2VydmljZUJhc2UgZnJvbSAnLi4vLi4vU2VydmljZUJhc2UnO1xuXG5jb25zdCBsb2FkVGFza3MgPSBhc3luYyAoc2VydmljZTogU2VydmljZUJhc2UsIGRpcj86IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICBsZXQgdGFza3NEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIHRhc2tzRGlyID0gZGlyO1xuICB9IGVsc2Uge1xuICAgIHRhc2tzRGlyID0gcGF0aC5qb2luKHNlcnZpY2UucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vdGFza3MvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmModGFza3NEaXIpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICBjb25zdCBoYW5kbGVyUGF0aCA9IHBhdGguam9pbih0YXNrc0RpciwgaGFuZGxlck5hbWUpO1xuXG4gICAgaWYgKFxuICAgICAgXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy50YXNrLnRzJykgLy8gVHlzcGVTY3JpcHRcbiAgICAgIHx8IF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcudGFzay5qcycpIC8vIEphdmFTY3JpcHRcbiAgICApIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgY29uc3QgaGFuZGxlcjogVGFza0hhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHNlcnZpY2UucmVzb3VyY2VzKTtcblxuICAgICAgICBhd2FpdCBzZXJ2aWNlLmxvYWRUYXNrKGhhbmRsZXIpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgc2VydmljZS5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBUYXNrICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgIGF3YWl0IGxvYWRUYXNrcyhzZXJ2aWNlLCBwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge1xuICBsb2FkVGFza3MsXG59O1xuIl19