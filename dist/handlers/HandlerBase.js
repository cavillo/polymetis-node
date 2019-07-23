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
class HandlerBase {
    constructor(resources) {
        this.resources = resources;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFuZGxlcnMvSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLE1BQThCLFdBQVc7SUFJdkMsWUFBWSxTQUEyQjtRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBTU0sT0FBTztRQUNaLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRVksT0FBTyxDQUFDLE9BQWUsRUFBRSxTQUFpQixFQUFFLElBQVM7O1lBQ2hFLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7WUFDN0QsTUFBTSxLQUFLLEdBQUcsR0FBRyxXQUFXLElBQUksT0FBTyxRQUFRLFNBQVMsRUFBRSxDQUFDO1lBQzNELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUN4QyxLQUFLLEVBQ0wsSUFBSSxDQUNMLENBQUM7UUFDSixDQUFDO0tBQUE7Q0FDRjtBQXhCRCw4QkF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzIH0gZnJvbSAnLi4vU2VydmljZUJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBIYW5kbGVyQmFzZSB7XG4gIHByb3RlY3RlZCByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG4gIHB1YmxpYyBhYnN0cmFjdCB0b3BpYzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHJlc291cmNlczogU2VydmljZVJlc291cmNlcykge1xuICAgIHRoaXMucmVzb3VyY2VzID0gcmVzb3VyY2VzO1xuICB9XG5cbiAgcHVibGljIGFic3RyYWN0IGFzeW5jIGluaXQoKTogUHJvbWlzZTx2b2lkPjtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IGFzeW5jIGNhbGxiYWNrKGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD47XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBoYW5kbGVDYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuXG4gIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudG9waWM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2FsbFJQQyhzZXJ2aWNlOiBzdHJpbmcsIHByb2NlZHVyZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB7IGVudmlyb25tZW50IH0gPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2U7XG4gICAgY29uc3QgdG9waWMgPSBgJHtlbnZpcm9ubWVudH0uJHtzZXJ2aWNlfS5ycGMuJHtwcm9jZWR1cmV9YDtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucmFiYml0LmNhbGxQcm9jZWR1cmUoXG4gICAgICB0b3BpYyxcbiAgICAgIGRhdGEsXG4gICAgKTtcbiAgfVxufSJdfQ==