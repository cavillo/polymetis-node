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
class Handler extends polymetis_node_1.EventHandlerBase {
    constructor(resources) {
        super(resources);
        this.topic = 'healthz.audited';
    }
    handleCallback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.emitTask('check.healthz', data);
        });
    }
}
exports.default = Handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhbHRoei5ldmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ldmVudHMvaW50ZXJuYWwvaGVhbHRoei5ldmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsbURBR3dCO0FBRXhCLE1BQXFCLE9BQVEsU0FBUSxpQ0FBZ0I7SUFHbkQsWUFBWSxTQUEyQjtRQUNyQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFIWixVQUFLLEdBQUcsaUJBQWlCLENBQUM7SUFJakMsQ0FBQztJQUVlLGNBQWMsQ0FBQyxJQUFTOztZQUN0QyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLENBQUM7S0FBQTtDQUNGO0FBVkQsMEJBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICBFdmVudEhhbmRsZXJCYXNlLFxuICBTZXJ2aWNlUmVzb3VyY2VzLFxufSBmcm9tICdwb2x5bWV0aXMtbm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhhbmRsZXIgZXh0ZW5kcyBFdmVudEhhbmRsZXJCYXNlIHtcbiAgcHVibGljIHRvcGljID0gJ2hlYWx0aHouYXVkaXRlZCc7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzKSB7XG4gICAgc3VwZXIocmVzb3VyY2VzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBoYW5kbGVDYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmVtaXRUYXNrKCdjaGVjay5oZWFsdGh6JywgZGF0YSk7XG4gIH1cbn0iXX0=