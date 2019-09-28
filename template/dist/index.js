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
// Initializing service
const conf = {
    baseDir: __dirname,
};
const service = new polymetis_node_1.ServiceBase(conf);
service.init()
    .then(() => __awaiter(this, void 0, void 0, function* () {
    service.logger.info('Initialized...');
}))
    .catch((error) => {
    service.logger.error('Exiting', error);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLG1EQUE0RDtBQUc1RCx1QkFBdUI7QUFDdkIsTUFBTSxJQUFJLEdBQWtCO0lBQzFCLE9BQU8sRUFBRSxTQUFTO0NBQ25CLENBQUM7QUFFRixNQUFNLE9BQU8sR0FBRyxJQUFJLDRCQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdEMsT0FBTyxDQUFDLElBQUksRUFBRTtLQUNYLElBQUksQ0FBQyxHQUFTLEVBQUU7SUFDZixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQSxDQUFDO0tBQ0QsS0FBSyxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUU7SUFDcEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3pDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmljZUJhc2UsIENvbmZpZ3VyYXRpb24gfSBmcm9tICdwb2x5bWV0aXMtbm9kZSc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8vIEluaXRpYWxpemluZyBzZXJ2aWNlXG5jb25zdCBjb25mOiBDb25maWd1cmF0aW9uID0ge1xuICBiYXNlRGlyOiBfX2Rpcm5hbWUsXG59O1xuXG5jb25zdCBzZXJ2aWNlID0gbmV3IFNlcnZpY2VCYXNlKGNvbmYpO1xuXG5zZXJ2aWNlLmluaXQoKVxuICAudGhlbihhc3luYyAoKSA9PiB7XG4gICAgc2VydmljZS5sb2dnZXIuaW5mbygnSW5pdGlhbGl6ZWQuLi4nKTtcbiAgfSlcbiAgLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XG4gICAgc2VydmljZS5sb2dnZXIuZXJyb3IoJ0V4aXRpbmcnLCBlcnJvcik7XG4gIH0pO1xuIl19