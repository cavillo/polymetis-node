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
const polymetis_node_1 = require("polymetis-node");
class ApiRouteImpl extends polymetis_node_1.ApiRoute {
    constructor(resources) {
        super(resources);
        this.url = '/healthz';
    }
    callback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resources.rabbit.emit('healthz.audited', {});
            const response = yield this.callRPC(this.resources.configuration.service.service, 'check-healthz', {});
            res.status(200).send(_.get(response, 'data', 'Something is not ok'));
        });
    }
}
exports.default = ApiRouteImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LnJvdXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaS9oZWFsdGh6L2dldC5yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixtREFLd0I7QUFFeEIsTUFBcUIsWUFBYSxTQUFRLHlCQUFRO0lBR2hELFlBQVksU0FBMkI7UUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBSFosUUFBRyxHQUFXLFVBQVUsQ0FBQztJQUloQyxDQUFDO0lBRVksUUFBUSxDQUFDLEdBQVksRUFBRSxHQUFhOztZQUMvQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUV4RCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFdkcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQztRQUN2RSxDQUFDO0tBQUE7Q0FDRjtBQWRELCtCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgUmVxdWVzdCxcbiAgUmVzcG9uc2UsXG4gIEFwaVJvdXRlLFxuICBTZXJ2aWNlUmVzb3VyY2VzLFxufSBmcm9tICdwb2x5bWV0aXMtbm9kZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwaVJvdXRlSW1wbCBleHRlbmRzIEFwaVJvdXRlIHtcbiAgcHVibGljIHVybDogc3RyaW5nID0gJy9oZWFsdGh6JztcblxuICBjb25zdHJ1Y3RvcihyZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXMpIHtcbiAgICBzdXBlcihyZXNvdXJjZXMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNhbGxiYWNrKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSk6IFByb21pc2U8YW55PiB7XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmVtaXQoJ2hlYWx0aHouYXVkaXRlZCcsIHt9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5jYWxsUlBDKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uc2VydmljZS5zZXJ2aWNlLCAnY2hlY2staGVhbHRoeicsIHt9KTtcblxuICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKF8uZ2V0KHJlc3BvbnNlLCAnZGF0YScsICdTb21ldGhpbmcgaXMgbm90IG9rJykpO1xuICB9XG59Il19