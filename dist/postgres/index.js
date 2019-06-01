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
    constructor(configuration, logger) {
        this.configuration = configuration;
        this.logger = logger;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
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
            db = yield massive_1.default(this.configuration, connectionOptions);
            return db;
        });
    }
}
exports.default = Postgres;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGdyZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLHNEQUE4QjtBQU05QixJQUFJLEVBQW9CLENBQUM7QUFFekIsTUFBcUIsUUFBUTtJQUMzQixZQUFzQixhQUFvQyxFQUFZLE1BQWM7UUFBOUQsa0JBQWEsR0FBYixhQUFhLENBQXVCO1FBQVksV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFJLENBQUM7SUFFNUUsSUFBSTs7WUFDZixNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FBQTtJQUVZLFVBQVUsQ0FBQyxLQUFLLEdBQUcsS0FBSzs7WUFDbkMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxNQUFNLGlCQUFpQixHQUFRO2dCQUM3QixpQkFBaUIsRUFBRSxJQUFJO2FBQ3hCLENBQUM7WUFFRixFQUFFLEdBQUcsTUFBTSxpQkFBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUUxRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FBQTtDQUNGO0FBckJELDJCQXFCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBtYXNzaXZlIGZyb20gJ21hc3NpdmUnO1xuZXhwb3J0IHR5cGUgRGF0YWJhc2VJbnN0YW5jZSA9IG1hc3NpdmUuRGF0YWJhc2U7XG5cbmltcG9ydCB7IFBvc3RncmVzQ29uZmlndXJhdGlvbiB9IGZyb20gJy4uL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRpbHMvTG9nZ2VyJztcblxubGV0IGRiOiBEYXRhYmFzZUluc3RhbmNlO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3N0Z3JlcyB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBjb25maWd1cmF0aW9uOiBQb3N0Z3Jlc0NvbmZpZ3VyYXRpb24sIHByb3RlY3RlZCBsb2dnZXI6IExvZ2dlcikgeyB9XG5cbiAgcHVibGljIGFzeW5jIGluaXQoKSB7XG4gICAgYXdhaXQgdGhpcy5kYkluc3RhbmNlKCk7XG4gICAgdGhpcy5sb2dnZXIub2soJ1Bvc3RncmVzIEluaXRpYWxpemVkLi4uJyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGJJbnN0YW5jZShmb3JjZSA9IGZhbHNlKTogUHJvbWlzZTxEYXRhYmFzZUluc3RhbmNlPiB7XG4gICAgaWYgKCFmb3JjZSAmJiBkYikge1xuICAgICAgcmV0dXJuIGRiO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbm5lY3Rpb25PcHRpb25zOiBhbnkgPSB7XG4gICAgICBlbmhhbmNlZEZ1bmN0aW9uczogdHJ1ZSxcbiAgICB9O1xuXG4gICAgZGIgPSBhd2FpdCBtYXNzaXZlKHRoaXMuY29uZmlndXJhdGlvbiwgY29ubmVjdGlvbk9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGRiO1xuICB9XG59Il19