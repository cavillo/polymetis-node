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
                yield loadEvents(service, path.join(handlerPath, '/'));
            }
            catch (error) {
                continue;
            }
        }
    }
});
exports.loadEvents = loadEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2xvYWRlcnMvZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFLekIsTUFBTSxVQUFVLEdBQUcsQ0FBTyxPQUFvQixFQUFFLEdBQVksRUFBaUIsRUFBRTtJQUM3RSxJQUFJLFNBQWlCLENBQUM7SUFDdEIsSUFBSSxHQUFHLEVBQUU7UUFDUCxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ2pCO1NBQU07UUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDN0U7SUFFRCxJQUFJLFFBQWtCLENBQUM7SUFDdkIsSUFBSTtRQUNGLFFBQVEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3RDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxPQUFPO0tBQ1I7SUFFRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFFBQVEsRUFBRTtRQUNsQyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0RCxJQUNFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLGNBQWM7ZUFDaEQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsYUFBYTtVQUNyRDtZQUNBLElBQUk7Z0JBQ0YsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDakQsTUFBTSxPQUFPLEdBQXFCLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFckUsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixXQUFXLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQzthQUNwRjtTQUNGO2FBQU07WUFDTCxJQUFJO2dCQUNGLGtDQUFrQztnQkFDbEMsTUFBTSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxTQUFTO2FBQ1Y7U0FDRjtLQUNGO0FBQ0gsQ0FBQyxDQUFBLENBQUM7QUFHQSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5cbmltcG9ydCBFdmVudEhhbmRsZXJCYXNlIGZyb20gJy4uLy4uL2hhbmRsZXJzL0V2ZW50SGFuZGxlckJhc2UnO1xuaW1wb3J0IFNlcnZpY2VCYXNlIGZyb20gJy4uLy4uL1NlcnZpY2VCYXNlJztcblxuY29uc3QgbG9hZEV2ZW50cyA9IGFzeW5jIChzZXJ2aWNlOiBTZXJ2aWNlQmFzZSwgZGlyPzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGxldCBldmVudHNEaXI6IHN0cmluZztcbiAgaWYgKGRpcikge1xuICAgIGV2ZW50c0RpciA9IGRpcjtcbiAgfSBlbHNlIHtcbiAgICBldmVudHNEaXIgPSBwYXRoLmpvaW4oc2VydmljZS5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9ldmVudHMvJyk7XG4gIH1cblxuICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICB0cnkge1xuICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMoZXZlbnRzRGlyKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4oZXZlbnRzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgaWYgKFxuICAgICAgXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5ldmVudC50cycpIC8vIFR5c3BlU2NyaXB0XG4gICAgICB8fCBfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLmV2ZW50LmpzJykgLy8gSmF2YVNjcmlwdFxuICAgICkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICBjb25zdCBoYW5kbGVyOiBFdmVudEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHNlcnZpY2UucmVzb3VyY2VzKTtcblxuICAgICAgICBhd2FpdCBzZXJ2aWNlLmxvYWRFdmVudChoYW5kbGVyKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNlcnZpY2UucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgRXZlbnQgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgYXdhaXQgbG9hZEV2ZW50cyhzZXJ2aWNlLCBwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQge1xuICBsb2FkRXZlbnRzLFxufTtcbiJdfQ==