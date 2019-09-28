"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const polymetis_node_1 = require("polymetis-node");
class Handler extends polymetis_node_1.TaskHandlerBase {
    constructor(resources) {
        super(resources);
        this.topic = 'check.healthz';
    }
    handleCallback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('=> Check ok');
        });
    }
}
exports.default = Handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoei50YXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rhc2tzL2ludGVybmFsL2hlYWx0aHoudGFzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsbURBR3dCO0FBRXhCLE1BQXFCLE9BQVEsU0FBUSxnQ0FBZTtJQUdsRCxZQUFZLFNBQTJCO1FBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUhaLFVBQUssR0FBRyxlQUFlLENBQUM7SUFJL0IsQ0FBQztJQUVlLGNBQWMsQ0FBQyxJQUFTOztZQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUFBO0NBQ0Y7QUFWRCwwQkFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7XG4gIFNlcnZpY2VSZXNvdXJjZXMsXG4gIFRhc2tIYW5kbGVyQmFzZVxufSBmcm9tICdwb2x5bWV0aXMtbm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhhbmRsZXIgZXh0ZW5kcyBUYXNrSGFuZGxlckJhc2Uge1xuICBwdWJsaWMgdG9waWMgPSAnY2hlY2suaGVhbHRoeic7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzKSB7XG4gICAgc3VwZXIocmVzb3VyY2VzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBoYW5kbGVDYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnPT4gQ2hlY2sgb2snKTtcbiAgfVxufSJdfQ==