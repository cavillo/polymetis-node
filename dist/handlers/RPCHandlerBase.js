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
            this.resources.logger.log(this.getName(), 'Initialized...');
        });
    }
    callback(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.log('Handling rpc', this.topic);
            const data = _.get(payload, 'content', {});
            return yield this.handleCallback(data);
        });
    }
    getName() {
        return `RPC Handler ${this.topic}`;
    }
}
exports.default = RPCHandlerBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlBDSGFuZGxlckJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaGFuZGxlcnMvUlBDSGFuZGxlckJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsMEVBQWtEO0FBR2xELE1BQThCLGNBQWUsU0FBUSxxQkFBVztJQUc5RCxZQUFZLFNBQTJCO1FBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBRVksSUFBSTs7WUFDZixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ3JFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFFN0QsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FDM0MsR0FBRyxXQUFXLElBQUksT0FBTyxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBSyxRQUFRO1lBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN6QixDQUFDO1lBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzlELENBQUM7S0FBQTtJQUVlLFFBQVEsQ0FBQyxPQUFZOztZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDM0MsT0FBTyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsQ0FBQztLQUFBO0lBSU0sT0FBTztRQUNaLE9BQU8sZUFBZSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztDQUNGO0FBOUJELGlDQThCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuLi9oYW5kbGVycy9IYW5kbGVyQmFzZSc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzIH0gZnJvbSAnLi4vU2VydmljZUJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBSUENIYW5kbGVyQmFzZSBleHRlbmRzIEhhbmRsZXJCYXNle1xuICBwdWJsaWMgYWJzdHJhY3QgdG9waWM6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMpIHtcbiAgICBzdXBlcihyZXNvdXJjZXMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnNlcnZpY2UuZW52aXJvbm1lbnQ7XG4gICAgY29uc3Qgc2VydmljZSA9IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5zZXJ2aWNlO1xuXG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LnJlZ2lzdGVyUHJvY2VkdXJlKFxuICAgICAgYCR7ZW52aXJvbm1lbnR9LiR7c2VydmljZX0ucnBjLiR7dGhpcy50b3BpY31gLCAgICAvLyB0b3BpY1xuICAgICAgdGhpcy5jYWxsYmFjay5iaW5kKHRoaXMpLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxsYmFja1xuICAgICk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKHRoaXMuZ2V0TmFtZSgpLCAnSW5pdGlhbGl6ZWQuLi4nKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBhc3luYyBjYWxsYmFjayhwYXlsb2FkOiBhbnkpIHtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCdIYW5kbGluZyBycGMnLCB0aGlzLnRvcGljKTtcbiAgICBjb25zdCBkYXRhID0gXy5nZXQocGF5bG9hZCwgJ2NvbnRlbnQnLCB7fSk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuaGFuZGxlQ2FsbGJhY2soZGF0YSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYWJzdHJhY3QgYXN5bmMgaGFuZGxlQ2FsbGJhY2soZGF0YTogYW55KTogUHJvbWlzZTxhbnk+O1xuXG4gIHB1YmxpYyBnZXROYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGBSUEMgSGFuZGxlciAke3RoaXMudG9waWN9YDtcbiAgfVxufSJdfQ==