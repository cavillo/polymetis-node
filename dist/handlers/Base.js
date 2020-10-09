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
const Helpers_1 = require("../utils/Helpers");
class Base {
    constructor(resources) {
        this.resources = resources;
        this.resources = resources;
    }
    emitEvent(topic, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return Helpers_1.emitEvent(this.resources, topic, data);
        });
    }
    emitTask(task, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Helpers_1.emitTask(this.resources, task, data);
        });
    }
    callRPC(url, data, transactionId = this.generateTransactionId()) {
        return __awaiter(this, void 0, void 0, function* () {
            return Helpers_1.callRPC(this.resources, url, data, transactionId);
        });
    }
    generateTransactionId() {
        return Helpers_1.generateTransactionId();
    }
}
exports.default = Base;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oYW5kbGVycy9CYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSw4Q0FLMEI7QUFHMUIsTUFBcUIsSUFBSTtJQUN2QixZQUFzQixTQUEyQjtRQUEzQixjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRVksU0FBUyxDQUFDLEtBQWEsRUFBRSxJQUFTOztZQUM3QyxPQUFPLG1CQUFTLENBQ2QsSUFBSSxDQUFDLFNBQVMsRUFDZCxLQUFLLEVBQ0wsSUFBSSxDQUNMLENBQUM7UUFDSixDQUFDO0tBQUE7SUFFWSxRQUFRLENBQUMsSUFBWSxFQUFFLElBQVM7O1lBQzNDLGtCQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQztLQUFBO0lBRVksT0FBTyxDQUFJLEdBQVcsRUFBRSxJQUFTLEVBQUUsZ0JBQXdCLElBQUksQ0FBQyxxQkFBcUIsRUFBRTs7WUFDbEcsT0FBTyxpQkFBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUMzRCxDQUFDO0tBQUE7SUFFUyxxQkFBcUI7UUFDN0IsT0FBTywrQkFBcUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQXhCRCx1QkF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgZW1pdEV2ZW50LFxuICBlbWl0VGFzayxcbiAgY2FsbFJQQyxcbiAgZ2VuZXJhdGVUcmFuc2FjdGlvbklkLFxufSBmcm9tICcuLi91dGlscy9IZWxwZXJzJztcbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzKSB7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZXM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZW1pdEV2ZW50KHRvcGljOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIHJldHVybiBlbWl0RXZlbnQoXG4gICAgICB0aGlzLnJlc291cmNlcyxcbiAgICAgIHRvcGljLFxuICAgICAgZGF0YSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGVtaXRUYXNrKHRhc2s6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgZW1pdFRhc2sodGhpcy5yZXNvdXJjZXMsIHRhc2ssIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNhbGxSUEM8VD4odXJsOiBzdHJpbmcsIGRhdGE6IGFueSwgdHJhbnNhY3Rpb25JZDogc3RyaW5nID0gdGhpcy5nZW5lcmF0ZVRyYW5zYWN0aW9uSWQoKSk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiBjYWxsUlBDKHRoaXMucmVzb3VyY2VzLCB1cmwsIGRhdGEsIHRyYW5zYWN0aW9uSWQpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdlbmVyYXRlVHJhbnNhY3Rpb25JZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBnZW5lcmF0ZVRyYW5zYWN0aW9uSWQoKTtcbiAgfVxufVxuIl19