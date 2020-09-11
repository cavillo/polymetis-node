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
const axios_1 = __importDefault(require("axios"));
exports.post = (url, data) => __awaiter(this, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(url, data);
        return response.data;
    }
    catch (error) {
        return {
            transactionId: data.transactionId,
            error: error.message,
        };
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcnBjcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQTZDO0FBUWhDLFFBQUEsSUFBSSxHQUFHLENBQ2xCLEdBQVcsRUFDWCxJQUdDLEVBQzRCLEVBQUU7SUFDL0IsSUFBSTtRQUNGLE1BQU0sUUFBUSxHQUFzQyxNQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWhGLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQztLQUN0QjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsT0FBTztZQUNMLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDckIsQ0FBQztLQUNIO0FBQ0gsQ0FBQyxDQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXhpb3MsIHsgQXhpb3NSZXNwb25zZSB9IGZyb20gJ2F4aW9zJztcblxuZXhwb3J0IGludGVyZmFjZSBSUENSZXNwb25zZVBheWxvYWQge1xuICB0cmFuc2FjdGlvbklkOiBzdHJpbmc7XG4gIGRhdGE/OiBhbnk7XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgcG9zdCA9IGFzeW5jIChcbiAgdXJsOiBzdHJpbmcsXG4gIGRhdGE6IHtcbiAgICB0cmFuc2FjdGlvbklkOiBzdHJpbmcsXG4gICAgcGF5bG9hZDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgfSxcbik6IFByb21pc2U8UlBDUmVzcG9uc2VQYXlsb2FkPiA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2U6IEF4aW9zUmVzcG9uc2U8UlBDUmVzcG9uc2VQYXlsb2FkPiA9IGF3YWl0IGF4aW9zLnBvc3QodXJsLCBkYXRhKTtcblxuICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2FjdGlvbklkOiBkYXRhLnRyYW5zYWN0aW9uSWQsXG4gICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSxcbiAgICB9O1xuICB9XG59O1xuIl19