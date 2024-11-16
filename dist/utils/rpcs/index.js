"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = void 0;
const axios_1 = __importDefault(require("axios"));
const post = (url, data) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.post = post;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvcnBjcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBNkM7QUFRdEMsTUFBTSxJQUFJLEdBQUcsQ0FDbEIsR0FBVyxFQUNYLElBR0MsRUFDNEIsRUFBRTtJQUMvQixJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBc0MsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVoRixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPO1lBQ0wsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhO1lBQ2pDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTztTQUNyQixDQUFDO0lBQ0osQ0FBQztBQUNILENBQUMsQ0FBQSxDQUFDO0FBakJXLFFBQUEsSUFBSSxRQWlCZiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcywgeyBBeGlvc1Jlc3BvbnNlIH0gZnJvbSAnYXhpb3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJQQ1Jlc3BvbnNlUGF5bG9hZCB7XG4gIHRyYW5zYWN0aW9uSWQ6IHN0cmluZztcbiAgZGF0YT86IGFueTtcbiAgZXJyb3I/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBwb3N0ID0gYXN5bmMgKFxuICB1cmw6IHN0cmluZyxcbiAgZGF0YToge1xuICAgIHRyYW5zYWN0aW9uSWQ6IHN0cmluZyxcbiAgICBwYXlsb2FkOiB7IFtrZXk6IHN0cmluZ106IGFueSB9LFxuICB9LFxuKTogUHJvbWlzZTxSUENSZXNwb25zZVBheWxvYWQ+ID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZTogQXhpb3NSZXNwb25zZTxSUENSZXNwb25zZVBheWxvYWQ+ID0gYXdhaXQgYXhpb3MucG9zdCh1cmwsIGRhdGEpO1xuXG4gICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zYWN0aW9uSWQ6IGRhdGEudHJhbnNhY3Rpb25JZCxcbiAgICAgIGVycm9yOiBlcnJvci5tZXNzYWdlLFxuICAgIH07XG4gIH1cbn07XG4iXX0=