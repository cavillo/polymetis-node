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
const massive_1 = __importStar(require("massive"));
exports.DatabaseInstance = massive_1.Database;
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
            this.instance = yield this.dbInstance();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGdyZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxtREFBZ0U7QUFHOUQsMkJBSDRCLGtCQUFnQixDQUc1QjtBQU1sQixJQUFJLEVBQW9CLENBQUM7QUFFekIsTUFBcUIsUUFBUTtJQUUzQixZQUFzQixJQUEyQixFQUFZLE1BQWM7UUFBckQsU0FBSSxHQUFKLElBQUksQ0FBdUI7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUksQ0FBQztJQUVuRSxJQUFJOztZQUNmLElBQ0ssQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDVixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTttQkFDZixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTttQkFDbkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFDdEI7Z0JBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0RBQXdELENBQUMsQ0FBQztnQkFDM0UsT0FBTzthQUNSO1lBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FBQTtJQUVZLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSzs7WUFDbkMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxNQUFNLGlCQUFpQixHQUFRO2dCQUM3QixpQkFBaUIsRUFBRSxJQUFJO2FBQ3hCLENBQUM7WUFFRixFQUFFLEdBQUcsTUFBTSxpQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUVqRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtDQUNGO0FBbENELDJCQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBtYXNzaXZlLCB7IERhdGFiYXNlIGFzIERhdGFiYXNlSW5zdGFuY2UgfSBmcm9tICdtYXNzaXZlJztcblxuZXhwb3J0IHtcbiAgRGF0YWJhc2VJbnN0YW5jZSxcbn07XG5cbmltcG9ydCB7IFBvc3RncmVzQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRpbHMvTG9nZ2VyJztcblxubGV0IGRiOiBEYXRhYmFzZUluc3RhbmNlO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3N0Z3JlcyB7XG4gIHB1YmxpYyBpbnN0YW5jZTogRGF0YWJhc2VJbnN0YW5jZTtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGNvbmY6IFBvc3RncmVzQ29uZmlndXJhdGlvbiwgcHJvdGVjdGVkIGxvZ2dlcjogTG9nZ2VyKSB7IH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpIHtcbiAgICBpZiAoXG4gICAgICAgICAhdGhpcy5jb25mXG4gICAgICB8fCAhdGhpcy5jb25mLmhvc3RcbiAgICAgIHx8ICF0aGlzLmNvbmYucG9ydFxuICAgICAgfHwgIXRoaXMuY29uZi51c2VyXG4gICAgICB8fCAhdGhpcy5jb25mLnBhc3N3b3JkXG4gICAgICB8fCAhdGhpcy5jb25mLmRhdGFiYXNlXG4gICAgKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKCdQb3N0Z3JlczogTm8gcGFyYW1ldGVycyBmb3IgaW5pdGlhbGl6YXRpb24uIFNraXBpbmcuLi4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmluc3RhbmNlID0gYXdhaXQgdGhpcy5kYkluc3RhbmNlKCk7XG4gICAgdGhpcy5sb2dnZXIub2soJ1Bvc3RncmVzIEluaXRpYWxpemVkLi4uJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGJJbnN0YW5jZShmb3JjZSA9IGZhbHNlKTogUHJvbWlzZTxEYXRhYmFzZUluc3RhbmNlPiB7XG4gICAgaWYgKCFmb3JjZSAmJiBkYikge1xuICAgICAgcmV0dXJuIGRiO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbm5lY3Rpb25PcHRpb25zOiBhbnkgPSB7XG4gICAgICBlbmhhbmNlZEZ1bmN0aW9uczogdHJ1ZSxcbiAgICB9O1xuXG4gICAgZGIgPSBhd2FpdCBtYXNzaXZlKHRoaXMuY29uZiwgY29ubmVjdGlvbk9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGRiO1xuICB9XG59Il19