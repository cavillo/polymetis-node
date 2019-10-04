"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
class HandlerBase extends Base_1.default {
    getName() {
        return this.topic;
    }
    callRPC(service, procedure, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { environment } = this.resources.configuration.service;
            const topic = `${environment}.${service}.rpc.${procedure}`;
            return this.resources.rabbit.callProcedure(topic, data);
        });
    }
}
exports.default = HandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9IYW5kbGVyQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTBCO0FBRTFCLE1BQThCLFdBQVksU0FBUSxjQUFJO0lBTTdDLE9BQU87UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVZLE9BQU8sQ0FBQyxPQUFlLEVBQUUsU0FBaUIsRUFBRSxJQUFTOztZQUNoRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQzdELE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxJQUFJLE9BQU8sUUFBUSxTQUFTLEVBQUUsQ0FBQztZQUMzRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FDeEMsS0FBSyxFQUNMLElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQztLQUFBO0NBQ0Y7QUFsQkQsOEJBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgSGFuZGxlckJhc2UgZXh0ZW5kcyBCYXNlIHtcbiAgcHVibGljIGFic3RyYWN0IHRvcGljOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCBhc3luYyBpbml0KCk6IFByb21pc2U8dm9pZD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBjYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgaGFuZGxlQ2FsbGJhY2soZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPjtcblxuICBwdWJsaWMgZ2V0TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnRvcGljO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNhbGxSUEMoc2VydmljZTogc3RyaW5nLCBwcm9jZWR1cmU6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgY29uc3QgeyBlbnZpcm9ubWVudCB9ID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlO1xuICAgIGNvbnN0IHRvcGljID0gYCR7ZW52aXJvbm1lbnR9LiR7c2VydmljZX0ucnBjLiR7cHJvY2VkdXJlfWA7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJhYmJpdC5jYWxsUHJvY2VkdXJlKFxuICAgICAgdG9waWMsXG4gICAgICBkYXRhLFxuICAgICk7XG4gIH1cbn0iXX0=