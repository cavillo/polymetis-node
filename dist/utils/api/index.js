"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logApiRoute = exports.express = void 0;
const express_1 = __importDefault(require("express"));
exports.express = express_1.default;
const logApiRoute = (resources, req, res, next) => {
    resources.logger.info(req.method, req.originalUrl);
    const cleanup = () => {
        res.removeListener('finish', logFinish);
    };
    const logFinish = () => {
        cleanup();
        if (res.statusCode >= 500) {
            resources.logger.error(req.method, req.originalUrl, res.statusCode);
        }
        else if (res.statusCode >= 400) {
            resources.logger.error(req.method, req.originalUrl, res.statusCode);
        }
        else if (res.statusCode < 300 && res.statusCode >= 200) {
            resources.logger.info(req.method, req.originalUrl, res.statusCode);
        }
        else {
            resources.logger.info(req.method, req.originalUrl, res.statusCode);
        }
    };
    res.on('finish', logFinish);
    next();
};
exports.logApiRoute = logApiRoute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvYXBpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHNEQUE0RTtBQStCMUUsa0JBL0JLLGlCQUFPLENBK0JMO0FBM0JULE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBMkIsRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtJQUNuRyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUVuRCxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7UUFDbkIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDO0lBRUYsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO1FBQ3JCLE9BQU8sRUFBRSxDQUFDO1FBRVYsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEUsQ0FBQzthQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNqQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7YUFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFLENBQUM7WUFDekQsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyRSxDQUFDO2FBQU0sQ0FBQztZQUNOLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckUsQ0FBQztJQUNILENBQUMsQ0FBQztJQUVGLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTVCLElBQUksRUFBRSxDQUFDO0FBQ1QsQ0FBQyxDQUFDO0FBUUEsa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZXhwcmVzcywgeyBFeHByZXNzLCBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5cbmltcG9ydCB7IFNlcnZpY2VSZXNvdXJjZXMgfSBmcm9tICcuLi8uLi9TZXJ2aWNlQmFzZSc7XG5cbmNvbnN0IGxvZ0FwaVJvdXRlID0gKHJlc291cmNlczogU2VydmljZVJlc291cmNlcywgcmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlLCBuZXh0OiBOZXh0RnVuY3Rpb24pID0+IHtcbiAgcmVzb3VyY2VzLmxvZ2dlci5pbmZvKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCk7XG5cbiAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcbiAgICByZXMucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG4gIH07XG5cbiAgY29uc3QgbG9nRmluaXNoID0gKCkgPT4ge1xuICAgIGNsZWFudXAoKTtcblxuICAgIGlmIChyZXMuc3RhdHVzQ29kZSA+PSA1MDApIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgfSBlbHNlIGlmIChyZXMuc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIuZXJyb3IocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgfSBlbHNlIGlmIChyZXMuc3RhdHVzQ29kZSA8IDMwMCAmJiByZXMuc3RhdHVzQ29kZSA+PSAyMDApIHtcbiAgICAgIHJlc291cmNlcy5sb2dnZXIuaW5mbyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb3VyY2VzLmxvZ2dlci5pbmZvKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIH1cbiAgfTtcblxuICByZXMub24oJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG5cbiAgbmV4dCgpO1xufTtcblxuZXhwb3J0IHtcbiAgZXhwcmVzcyxcbiAgRXhwcmVzcyxcbiAgTmV4dEZ1bmN0aW9uLFxuICBSZXF1ZXN0LFxuICBSZXNwb25zZSxcbiAgbG9nQXBpUm91dGUsXG59O1xuIl19