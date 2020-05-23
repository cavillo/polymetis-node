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
    emitTask(task, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const topic = `${this.resources.configuration.service.service}.${task}`;
            this.resources.rabbit.emit(topic, data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9CYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFHQSxNQUFxQixJQUFJO0lBQ3ZCLFlBQXNCLFNBQTJCO1FBQTNCLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQy9DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFWSxTQUFTLENBQUMsS0FBYSxFQUFFLElBQVM7O1lBQzdDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUMvQixLQUFLLEVBQ0wsSUFBSSxDQUNMLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsSUFBWSxFQUFFLElBQVM7O1lBQzNDLE1BQU0sS0FBSyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQ3hCLEtBQUssRUFDTCxJQUFJLENBQ0wsQ0FBQztRQUNKLENBQUM7S0FBQTtJQUVZLE9BQU8sQ0FBQyxPQUFlLEVBQUUsU0FBaUIsRUFBRSxJQUFTOztZQUNoRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQzdELE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxJQUFJLE9BQU8sUUFBUSxTQUFTLEVBQUUsQ0FBQztZQUMzRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FDeEMsS0FBSyxFQUNMLElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQztLQUFBO0NBQ0Y7QUE1QkQsdUJBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZVJlc291cmNlcyB9IGZyb20gJy4uJztcbmltcG9ydCB7IFJQQ1Jlc3BvbnNlUGF5bG9hZCB9IGZyb20gJy4uL3JhYmJpdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzKSB7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZXM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZW1pdEV2ZW50KHRvcGljOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5yYWJiaXQuZW1pdChcbiAgICAgIHRvcGljLFxuICAgICAgZGF0YSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGVtaXRUYXNrKHRhc2s6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgY29uc3QgdG9waWMgPSBgJHt0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2Uuc2VydmljZX0uJHt0YXNrfWA7XG4gICAgdGhpcy5yZXNvdXJjZXMucmFiYml0LmVtaXQoXG4gICAgICB0b3BpYyxcbiAgICAgIGRhdGEsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjYWxsUlBDKHNlcnZpY2U6IHN0cmluZywgcHJvY2VkdXJlOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UlBDUmVzcG9uc2VQYXlsb2FkPiB7XG4gICAgY29uc3QgeyBlbnZpcm9ubWVudCB9ID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlO1xuICAgIGNvbnN0IHRvcGljID0gYCR7ZW52aXJvbm1lbnR9LiR7c2VydmljZX0ucnBjLiR7cHJvY2VkdXJlfWA7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJhYmJpdC5jYWxsUHJvY2VkdXJlKFxuICAgICAgdG9waWMsXG4gICAgICBkYXRhLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==