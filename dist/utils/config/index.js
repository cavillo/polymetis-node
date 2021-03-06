"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const dotenv_1 = require("dotenv");
// require our environment variables
dotenv_1.config();
const serviceConf = {
    environment: _.get(process.env, 'ENVIRONMENT'),
    service: _.get(process.env, 'SERVICE'),
    loggerMode: _.toNumber(_.get(process.env, 'LOGGER_MODE')),
};
exports.serviceConf = serviceConf;
const apiConf = {
    port: _.toNumber(_.get(process.env, 'API_PORT')),
    baseRoute: _.get(process.env, 'API_BASE_ROUTE'),
};
exports.apiConf = apiConf;
const rpcConf = {
    port: _.toNumber(_.get(process.env, 'RPC_PORT')),
    baseRoute: _.get(process.env, 'RPC_BASE_ROUTE'),
};
exports.rpcConf = rpcConf;
const rabbitConf = {
    username: _.get(process.env, 'RABBITMQ_USERNAME'),
    password: _.get(process.env, 'RABBITMQ_PASSWORD'),
    host: _.get(process.env, 'RABBITMQ_HOST'),
    port: _.toNumber(_.get(process.env, 'RABBITMQ_PORT')),
};
exports.rabbitConf = rabbitConf;
const configuration = {
    baseDir: __dirname,
    service: serviceConf,
    rabbit: rabbitConf,
    api: apiConf,
    rpc: rpcConf,
};
exports.configuration = configuration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY29uZmlnL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixtQ0FBaUU7QUFDakUsb0NBQW9DO0FBQ3BDLGVBQTZCLEVBQUUsQ0FBQztBQTZCaEMsTUFBTSxXQUFXLEdBQXlCO0lBQ3hDLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDO0lBQzlDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDO0lBQ3RDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztDQUMxRCxDQUFDO0FBNEJBLGtDQUFXO0FBM0JiLE1BQU0sT0FBTyxHQUFxQjtJQUNoQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDaEQsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQztDQUNoRCxDQUFDO0FBeUJBLDBCQUFPO0FBeEJULE1BQU0sT0FBTyxHQUFxQjtJQUNoQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDaEQsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQztDQUNoRCxDQUFDO0FBc0JBLDBCQUFPO0FBckJULE1BQU0sVUFBVSxHQUF3QjtJQUN0QyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDO0lBQ2pELFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUM7SUFDakQsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUM7SUFDekMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0NBQ3RELENBQUM7QUFpQkEsZ0NBQVU7QUFoQlosTUFBTSxhQUFhLEdBQWtCO0lBQ25DLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLE9BQU8sRUFBRSxXQUFXO0lBQ3BCLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLEdBQUcsRUFBRSxPQUFPO0lBQ1osR0FBRyxFQUFFLE9BQU87Q0FDYixDQUFDO0FBV0Esc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeyBjb25maWcgYXMgY29uZmlndXJlRW52aXJvbm1lbnRWYXJpYWJsZXMgfSBmcm9tICdkb3RlbnYnO1xuLy8gcmVxdWlyZSBvdXIgZW52aXJvbm1lbnQgdmFyaWFibGVzXG5jb25maWd1cmVFbnZpcm9ubWVudFZhcmlhYmxlcygpO1xuXG5pbnRlcmZhY2UgU2VydmljZUNvbmZpZ3VyYXRpb24ge1xuICBlbnZpcm9ubWVudD86IHN0cmluZztcbiAgc2VydmljZT86IHN0cmluZztcbiAgbG9nZ2VyTW9kZT86IG51bWJlcjtcbn1cbmludGVyZmFjZSBBcGlDb25maWd1cmF0aW9uIHtcbiAgcG9ydD86IG51bWJlcjtcbiAgYmFzZVJvdXRlPzogc3RyaW5nO1xufVxuaW50ZXJmYWNlIFJQQ0NvbmZpZ3VyYXRpb24ge1xuICBwb3J0PzogbnVtYmVyO1xuICBiYXNlUm91dGU/OiBzdHJpbmc7XG59XG5pbnRlcmZhY2UgUmFiYml0Q29uZmlndXJhdGlvbiB7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbn1cbmludGVyZmFjZSBDb25maWd1cmF0aW9uIHtcbiAgYmFzZURpcjogc3RyaW5nO1xuICBzZXJ2aWNlOiBTZXJ2aWNlQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXRDb25maWd1cmF0aW9uO1xuICBhcGk6IEFwaUNvbmZpZ3VyYXRpb247XG4gIHJwYzogUlBDQ29uZmlndXJhdGlvbjtcbn1cblxuY29uc3Qgc2VydmljZUNvbmY6IFNlcnZpY2VDb25maWd1cmF0aW9uID0ge1xuICBlbnZpcm9ubWVudDogXy5nZXQocHJvY2Vzcy5lbnYsICdFTlZJUk9OTUVOVCcpLFxuICBzZXJ2aWNlOiBfLmdldChwcm9jZXNzLmVudiwgJ1NFUlZJQ0UnKSxcbiAgbG9nZ2VyTW9kZTogXy50b051bWJlcihfLmdldChwcm9jZXNzLmVudiwgJ0xPR0dFUl9NT0RFJykpLFxufTtcbmNvbnN0IGFwaUNvbmY6IEFwaUNvbmZpZ3VyYXRpb24gPSB7XG4gIHBvcnQ6IF8udG9OdW1iZXIoXy5nZXQocHJvY2Vzcy5lbnYsICdBUElfUE9SVCcpKSxcbiAgYmFzZVJvdXRlOiBfLmdldChwcm9jZXNzLmVudiwgJ0FQSV9CQVNFX1JPVVRFJyksXG59O1xuY29uc3QgcnBjQ29uZjogUlBDQ29uZmlndXJhdGlvbiA9IHtcbiAgcG9ydDogXy50b051bWJlcihfLmdldChwcm9jZXNzLmVudiwgJ1JQQ19QT1JUJykpLFxuICBiYXNlUm91dGU6IF8uZ2V0KHByb2Nlc3MuZW52LCAnUlBDX0JBU0VfUk9VVEUnKSxcbn07XG5jb25zdCByYWJiaXRDb25mOiBSYWJiaXRDb25maWd1cmF0aW9uID0ge1xuICB1c2VybmFtZTogXy5nZXQocHJvY2Vzcy5lbnYsICdSQUJCSVRNUV9VU0VSTkFNRScpLFxuICBwYXNzd29yZDogXy5nZXQocHJvY2Vzcy5lbnYsICdSQUJCSVRNUV9QQVNTV09SRCcpLFxuICBob3N0OiBfLmdldChwcm9jZXNzLmVudiwgJ1JBQkJJVE1RX0hPU1QnKSxcbiAgcG9ydDogXy50b051bWJlcihfLmdldChwcm9jZXNzLmVudiwgJ1JBQkJJVE1RX1BPUlQnKSksXG59O1xuY29uc3QgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgYmFzZURpcjogX19kaXJuYW1lLFxuICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgcmFiYml0OiByYWJiaXRDb25mLFxuICBhcGk6IGFwaUNvbmYsXG4gIHJwYzogcnBjQ29uZixcbn07XG5cbmV4cG9ydCB7XG4gIFNlcnZpY2VDb25maWd1cmF0aW9uLFxuICBBcGlDb25maWd1cmF0aW9uLFxuICBSYWJiaXRDb25maWd1cmF0aW9uLFxuICBDb25maWd1cmF0aW9uLFxuICBzZXJ2aWNlQ29uZixcbiAgYXBpQ29uZixcbiAgcnBjQ29uZixcbiAgcmFiYml0Q29uZixcbiAgY29uZmlndXJhdGlvbixcbn07Il19