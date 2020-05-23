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
                yield this.loadTasks(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadTasks = loadTasks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvbG9hZGVycy90YXNrcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBS3pCLE1BQU0sU0FBUyxHQUFHLENBQU8sT0FBb0IsRUFBRSxHQUFZLEVBQWlCLEVBQUU7SUFDNUUsSUFBSSxRQUFnQixDQUFDO0lBQ3JCLElBQUksR0FBRyxFQUFFO1FBQ1AsUUFBUSxHQUFHLEdBQUcsQ0FBQztLQUNoQjtTQUFNO1FBQ0wsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQzNFO0lBRUQsSUFBSSxRQUFrQixDQUFDO0lBQ3ZCLElBQUk7UUFDRixRQUFRLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTztLQUNSO0lBRUQsS0FBSyxNQUFNLFdBQVcsSUFBSSxRQUFRLEVBQUU7UUFDbEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFckQsSUFDRSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxjQUFjO2VBQy9DLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDLGFBQWE7VUFDcEQ7WUFDQSxJQUFJO2dCQUNGLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pELE1BQU0sT0FBTyxHQUFvQixJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBRXBFLE1BQU0sT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNqQztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsV0FBVyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDbkY7U0FDRjthQUFNO1lBQ0wsSUFBSTtnQkFDRixrQ0FBa0M7Z0JBQ2xDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUM1RDtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLFNBQVM7YUFDVjtTQUNGO0tBQ0Y7QUFDSCxDQUFDLENBQUEsQ0FBQztBQUdBLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuaW1wb3J0IFRhc2tIYW5kbGVyQmFzZSBmcm9tICcuLi8uLi9oYW5kbGVycy9UYXNrSGFuZGxlckJhc2UnO1xuaW1wb3J0IFNlcnZpY2VCYXNlIGZyb20gJy4uLy4uL1NlcnZpY2VCYXNlJztcblxuY29uc3QgbG9hZFRhc2tzID0gYXN5bmMgKHNlcnZpY2U6IFNlcnZpY2VCYXNlLCBkaXI/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgbGV0IHRhc2tzRGlyOiBzdHJpbmc7XG4gIGlmIChkaXIpIHtcbiAgICB0YXNrc0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICB0YXNrc0RpciA9IHBhdGguam9pbihzZXJ2aWNlLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL3Rhc2tzLycpO1xuICB9XG5cbiAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgdHJ5IHtcbiAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHRhc2tzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4odGFza3NEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgIGlmIChcbiAgICAgIF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcudGFzay50cycpIC8vIFR5c3BlU2NyaXB0XG4gICAgICB8fCBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnRhc2suanMnKSAvLyBKYXZhU2NyaXB0XG4gICAgKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoYW5kbGVyU3BlYyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgIGNvbnN0IGhhbmRsZXI6IFRhc2tIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyhzZXJ2aWNlLnJlc291cmNlcyk7XG5cbiAgICAgICAgYXdhaXQgc2VydmljZS5sb2FkVGFzayhoYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlcnZpY2UucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgVGFzayAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmVjdXJzZSBkb3duIHRoZSBkaXJlY3RvcnkgdHJlZVxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRUYXNrcyhzZXJ2aWNlLCBwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge1xuICBsb2FkVGFza3MsXG59O1xuIl19