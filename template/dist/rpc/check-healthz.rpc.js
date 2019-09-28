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
class Handler extends polymetis_node_1.RPCHandlerBase {
    constructor(resources) {
        super(resources);
        this.topic = 'check-healthz';
    }
    handleCallback(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Im ok!';
        });
    }
}
exports.default = Handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2staGVhbHRoei5ycGMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcnBjL2NoZWNrLWhlYWx0aHoucnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSxtREFBa0U7QUFFbEUsTUFBcUIsT0FBUSxTQUFRLCtCQUFjO0lBR2pELFlBQVksU0FBMkI7UUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBSFosVUFBSyxHQUFHLGVBQWUsQ0FBQztJQUkvQixDQUFDO0lBRWUsY0FBYyxDQUFDLElBQVM7O1lBQ3RDLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUM7S0FBQTtDQUNGO0FBVkQsMEJBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBTZXJ2aWNlUmVzb3VyY2VzLCBSUENIYW5kbGVyQmFzZSB9IGZyb20gJ3BvbHltZXRpcy1ub2RlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGFuZGxlciBleHRlbmRzIFJQQ0hhbmRsZXJCYXNlIHtcbiAgcHVibGljIHRvcGljID0gJ2NoZWNrLWhlYWx0aHonO1xuXG4gIGNvbnN0cnVjdG9yKHJlc291cmNlczogU2VydmljZVJlc291cmNlcykge1xuICAgIHN1cGVyKHJlc291cmNlcyk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYXN5bmMgaGFuZGxlQ2FsbGJhY2soZGF0YTogYW55KTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gJ0ltIG9rISc7XG4gIH1cbn1cbiJdfQ==