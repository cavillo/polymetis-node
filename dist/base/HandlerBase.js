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
const _base_1 = __importDefault(require("./.base"));
class HandlerBase extends _base_1.default {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmFzZS9IYW5kbGVyQmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTJCO0FBRTNCLE1BQThCLFdBQVksU0FBUSxlQUFJO0lBTTdDLE9BQU87UUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVZLE9BQU8sQ0FBQyxPQUFlLEVBQUUsU0FBaUIsRUFBRSxJQUFTOztZQUNoRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1lBQzdELE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxJQUFJLE9BQU8sUUFBUSxTQUFTLEVBQUUsQ0FBQztZQUMzRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FDeEMsS0FBSyxFQUNMLElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQztLQUFBO0NBQ0Y7QUFsQkQsOEJBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2UgZnJvbSAnLi8uYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEhhbmRsZXJCYXNlIGV4dGVuZHMgQmFzZSB7XG4gIHB1YmxpYyBhYnN0cmFjdCB0b3BpYzogc3RyaW5nO1xuICBwdWJsaWMgYWJzdHJhY3QgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgY2FsbGJhY2soZGF0YTogYW55KTogUHJvbWlzZTx2b2lkPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGhhbmRsZUNhbGxiYWNrKGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD47XG5cbiAgcHVibGljIGdldE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50b3BpYztcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjYWxsUlBDKHNlcnZpY2U6IHN0cmluZywgcHJvY2VkdXJlOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IHsgZW52aXJvbm1lbnQgfSA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZTtcbiAgICBjb25zdCB0b3BpYyA9IGAke2Vudmlyb25tZW50fS4ke3NlcnZpY2V9LnJwYy4ke3Byb2NlZHVyZX1gO1xuICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5yYWJiaXQuY2FsbFByb2NlZHVyZShcbiAgICAgIHRvcGljLFxuICAgICAgZGF0YSxcbiAgICApO1xuICB9XG59Il19