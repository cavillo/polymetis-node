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
const massive_1 = __importDefault(require("massive"));
let db;
class Postgres {
    constructor(conf, logger) {
        this.conf = conf;
        this.logger = logger;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conf
                || !this.conf.host
                || !this.conf.port
                || !this.conf.user
                || !this.conf.password
                || !this.conf.database) {
                this.logger.warn('Postgres: No parameters for initialization. Skiping...');
                return;
            }
            yield this.dbInstance();
            this.logger.ok('Postgres Initialized...');
        });
    }
    dbInstance(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && db) {
                return db;
            }
            const connectionOptions = {
                enhancedFunctions: true,
            };
            db = yield massive_1.default(this.conf, connectionOptions);
            return db;
        });
    }
}
exports.default = Postgres;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGdyZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLHNEQUE4QjtBQU05QixJQUFJLEVBQW9CLENBQUM7QUFFekIsTUFBcUIsUUFBUTtJQUMzQixZQUFzQixJQUEyQixFQUFZLE1BQWM7UUFBckQsU0FBSSxHQUFKLElBQUksQ0FBdUI7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUksQ0FBQztJQUVuRSxJQUFJOztZQUNmLElBQ0ssQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDVixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTttQkFDbkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFDdEI7Z0JBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0RBQXdELENBQUMsQ0FBQztnQkFDM0UsT0FBTzthQUNSO1lBRUQsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMseUJBQXlCLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFWSxVQUFVLENBQUMsS0FBSyxHQUFHLEtBQUs7O1lBQ25DLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxFQUFFO2dCQUNoQixPQUFPLEVBQUUsQ0FBQzthQUNYO1lBRUQsTUFBTSxpQkFBaUIsR0FBUTtnQkFDN0IsaUJBQWlCLEVBQUUsSUFBSTthQUN4QixDQUFDO1lBRUYsRUFBRSxHQUFHLE1BQU0saUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFFakQsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDO0tBQUE7Q0FDRjtBQWpDRCwyQkFpQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgbWFzc2l2ZSBmcm9tICdtYXNzaXZlJztcbmV4cG9ydCB0eXBlIERhdGFiYXNlSW5zdGFuY2UgPSBtYXNzaXZlLkRhdGFiYXNlO1xuXG5pbXBvcnQgeyBQb3N0Z3Jlc0NvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi91dGlscy9TZXJ2aWNlQ29uZic7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4uL3V0aWxzL0xvZ2dlcic7XG5cbmxldCBkYjogRGF0YWJhc2VJbnN0YW5jZTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9zdGdyZXMge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgY29uZjogUG9zdGdyZXNDb25maWd1cmF0aW9uLCBwcm90ZWN0ZWQgbG9nZ2VyOiBMb2dnZXIpIHsgfVxuXG4gIHB1YmxpYyBhc3luYyBpbml0KCkge1xuICAgIGlmIChcbiAgICAgICAgICF0aGlzLmNvbmZcbiAgICAgIHx8ICF0aGlzLmNvbmYuaG9zdFxuICAgICAgfHwgIXRoaXMuY29uZi5wb3J0XG4gICAgICB8fCAhdGhpcy5jb25mLnVzZXJcbiAgICAgIHx8ICF0aGlzLmNvbmYucGFzc3dvcmRcbiAgICAgIHx8ICF0aGlzLmNvbmYuZGF0YWJhc2VcbiAgICApIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ1Bvc3RncmVzOiBObyBwYXJhbWV0ZXJzIGZvciBpbml0aWFsaXphdGlvbi4gU2tpcGluZy4uLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuZGJJbnN0YW5jZSgpO1xuICAgIHRoaXMubG9nZ2VyLm9rKCdQb3N0Z3JlcyBJbml0aWFsaXplZC4uLicpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGRiSW5zdGFuY2UoZm9yY2UgPSBmYWxzZSk6IFByb21pc2U8RGF0YWJhc2VJbnN0YW5jZT4ge1xuICAgIGlmICghZm9yY2UgJiYgZGIpIHtcbiAgICAgIHJldHVybiBkYjtcbiAgICB9XG5cbiAgICBjb25zdCBjb25uZWN0aW9uT3B0aW9uczogYW55ID0ge1xuICAgICAgZW5oYW5jZWRGdW5jdGlvbnM6IHRydWUsXG4gICAgfTtcblxuICAgIGRiID0gYXdhaXQgbWFzc2l2ZSh0aGlzLmNvbmYsIGNvbm5lY3Rpb25PcHRpb25zKTtcblxuICAgIHJldHVybiBkYjtcbiAgfVxufSJdfQ==