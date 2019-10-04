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
class Base {
    constructor(resources) {
        this.resources = resources;
        this.resources = resources;
    }
    emitEvent(topic, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.resources.rabbit.emit(topic, data);
        });
    }
    callRPC(service, procedure, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { environment } = this.resources.configuration.service;
            const topic = `${environment}.${service}.rpc.${procedure}`;
            return this.resources.rabbit.callProcedure(topic, data);
        });
    }
}
exports.default = Base;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9iYXNlL0Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLE1BQThCLElBQUk7SUFDaEMsWUFBc0IsU0FBMkI7UUFBM0IsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDN0IsQ0FBQztJQUVZLFNBQVMsQ0FBQyxLQUFhLEVBQUUsSUFBUzs7WUFDN0MsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQy9CLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxPQUFlLEVBQUUsU0FBaUIsRUFBRSxJQUFTOztZQUNoRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQzdELE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxJQUFJLE9BQU8sUUFBUSxTQUFTLEVBQUUsQ0FBQztZQUMzRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FDeEMsS0FBSyxFQUNMLElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQztLQUFBO0NBQ0Y7QUFwQkQsdUJBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZVJlc291cmNlcyB9IGZyb20gJy4uJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMpIHtcbiAgICB0aGlzLnJlc291cmNlcyA9IHJlc291cmNlcztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBlbWl0RXZlbnQodG9waWM6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJhYmJpdC5lbWl0KFxuICAgICAgdG9waWMsXG4gICAgICBkYXRhLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2FsbFJQQyhzZXJ2aWNlOiBzdHJpbmcsIHByb2NlZHVyZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB7IGVudmlyb25tZW50IH0gPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2U7XG4gICAgY29uc3QgdG9waWMgPSBgJHtlbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS5ycGMuJHtwcm9jZWR1cmV9YDtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucmFiYml0LmNhbGxQcm9jZWR1cmUoXG4gICAgICB0b3BpYyxcbiAgICAgIGRhdGEsXG4gICAgKTtcbiAgfVxufVxuIl19