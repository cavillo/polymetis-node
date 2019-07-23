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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const HandlerBase_1 = __importDefault(require("../handlers/HandlerBase"));
class RPCHandlerBase extends HandlerBase_1.default {
    constructor(resources) {
        super(resources);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const environment = this.resources.configuration.service.environment;
            const service = this.resources.configuration.service.service;
            yield this.resources.rabbit.registerProcedure(`${environment}.${service}.rpc.${this.topic}`, // topic
            this.callback.bind(this));
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.log('Handling rpc', this.topic);
            const data = _.get(payload, 'content', {});
            return yield this.handleCallback(data);
        });
    }
}
exports.default = RPCHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlBDSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFuZGxlcnMvUlBDSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsMEVBQWtEO0FBR2xELE1BQThCLGNBQWUsU0FBUSxxQkFBVztJQUc5RCxZQUFZLFNBQTJCO1FBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVksSUFBSTs7WUFDZixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ3JFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFFN0QsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FDM0MsR0FBRyxXQUFXLElBQUksT0FBTyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBSyxRQUFRO1lBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN6QixDQUFDO1FBQ0osQ0FBQztLQUFBO0lBRWUsUUFBUSxDQUFDLE9BQVk7O1lBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMzQyxPQUFPLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDO0tBQUE7Q0FJRjtBQXpCRCxpQ0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgSGFuZGxlckJhc2UgZnJvbSAnLi4vaGFuZGxlcnMvSGFuZGxlckJhc2UnO1xuaW1wb3J0IHsgU2VydmljZVJlc291cmNlcyB9IGZyb20gJy4uL1NlcnZpY2VCYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgUlBDSGFuZGxlckJhc2UgZXh0ZW5kcyBIYW5kbGVyQmFzZXtcbiAgcHVibGljIGFic3RyYWN0IHRvcGljOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzKSB7XG4gICAgc3VwZXIocmVzb3VyY2VzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5zZXJ2aWNlLmVudmlyb25tZW50O1xuICAgIGNvbnN0IHNlcnZpY2UgPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2Uuc2VydmljZTtcblxuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnJhYmJpdC5yZWdpc3RlclByb2NlZHVyZShcbiAgICAgIGAke2Vudmlyb25tZW50fS4ke3NlcnZpY2V9LnJwYy4ke3RoaXMudG9waWN9YCwgICAgLy8gdG9waWNcbiAgICAgIHRoaXMuY2FsbGJhY2suYmluZCh0aGlzKSwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbGJhY2tcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGFzeW5jIGNhbGxiYWNrKHBheWxvYWQ6IGFueSkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJ0hhbmRsaW5nIHJwYycsIHRoaXMudG9waWMpO1xuICAgIGNvbnN0IGRhdGEgPSBfLmdldChwYXlsb2FkLCAnY29udGVudCcsIHt9KTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5oYW5kbGVDYWxsYmFjayhkYXRhKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBhc3luYyBoYW5kbGVDYWxsYmFjayhkYXRhOiBhbnkpOiBQcm9taXNlPGFueT47XG5cbn0iXX0=