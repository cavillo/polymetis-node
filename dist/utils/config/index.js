"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = exports.rabbitConf = exports.rpcConf = exports.apiConf = exports.serviceConf = void 0;
const _ = __importStar(require("lodash"));
const dotenv_1 = require("dotenv");
// require our environment variables
(0, dotenv_1.config)();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY29uZmlnL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLG1DQUFpRTtBQUNqRSxvQ0FBb0M7QUFDcEMsSUFBQSxlQUE2QixHQUFFLENBQUM7QUE2QmhDLE1BQU0sV0FBVyxHQUF5QjtJQUN4QyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQztJQUM5QyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQztJQUN0QyxVQUFVLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7Q0FDMUQsQ0FBQztBQTRCQSxrQ0FBVztBQTNCYixNQUFNLE9BQU8sR0FBcUI7SUFDaEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELFNBQVMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUM7Q0FDaEQsQ0FBQztBQXlCQSwwQkFBTztBQXhCVCxNQUFNLE9BQU8sR0FBcUI7SUFDaEMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELFNBQVMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUM7Q0FDaEQsQ0FBQztBQXNCQSwwQkFBTztBQXJCVCxNQUFNLFVBQVUsR0FBd0I7SUFDdEMsUUFBUSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQztJQUNqRCxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDO0lBQ2pELElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDO0lBQ3pDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztDQUN0RCxDQUFDO0FBaUJBLGdDQUFVO0FBaEJaLE1BQU0sYUFBYSxHQUFrQjtJQUNuQyxPQUFPLEVBQUUsU0FBUztJQUNsQixPQUFPLEVBQUUsV0FBVztJQUNwQixNQUFNLEVBQUUsVUFBVTtJQUNsQixHQUFHLEVBQUUsT0FBTztJQUNaLEdBQUcsRUFBRSxPQUFPO0NBQ2IsQ0FBQztBQVdBLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgY29uZmlnIGFzIGNvbmZpZ3VyZUVudmlyb25tZW50VmFyaWFibGVzIH0gZnJvbSAnZG90ZW52Jztcbi8vIHJlcXVpcmUgb3VyIGVudmlyb25tZW50IHZhcmlhYmxlc1xuY29uZmlndXJlRW52aXJvbm1lbnRWYXJpYWJsZXMoKTtcblxuaW50ZXJmYWNlIFNlcnZpY2VDb25maWd1cmF0aW9uIHtcbiAgZW52aXJvbm1lbnQ/OiBzdHJpbmc7XG4gIHNlcnZpY2U/OiBzdHJpbmc7XG4gIGxvZ2dlck1vZGU/OiBudW1iZXI7XG59XG5pbnRlcmZhY2UgQXBpQ29uZmlndXJhdGlvbiB7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIGJhc2VSb3V0ZT86IHN0cmluZztcbn1cbmludGVyZmFjZSBSUENDb25maWd1cmF0aW9uIHtcbiAgcG9ydD86IG51bWJlcjtcbiAgYmFzZVJvdXRlPzogc3RyaW5nO1xufVxuaW50ZXJmYWNlIFJhYmJpdENvbmZpZ3VyYXRpb24ge1xuICBob3N0Pzogc3RyaW5nO1xuICBwb3J0PzogbnVtYmVyO1xuICB1c2VybmFtZT86IHN0cmluZztcbiAgcGFzc3dvcmQ/OiBzdHJpbmc7XG59XG5pbnRlcmZhY2UgQ29uZmlndXJhdGlvbiB7XG4gIGJhc2VEaXI6IHN0cmluZztcbiAgc2VydmljZTogU2VydmljZUNvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0Q29uZmlndXJhdGlvbjtcbiAgYXBpOiBBcGlDb25maWd1cmF0aW9uO1xuICBycGM6IFJQQ0NvbmZpZ3VyYXRpb247XG59XG5cbmNvbnN0IHNlcnZpY2VDb25mOiBTZXJ2aWNlQ29uZmlndXJhdGlvbiA9IHtcbiAgZW52aXJvbm1lbnQ6IF8uZ2V0KHByb2Nlc3MuZW52LCAnRU5WSVJPTk1FTlQnKSxcbiAgc2VydmljZTogXy5nZXQocHJvY2Vzcy5lbnYsICdTRVJWSUNFJyksXG4gIGxvZ2dlck1vZGU6IF8udG9OdW1iZXIoXy5nZXQocHJvY2Vzcy5lbnYsICdMT0dHRVJfTU9ERScpKSxcbn07XG5jb25zdCBhcGlDb25mOiBBcGlDb25maWd1cmF0aW9uID0ge1xuICBwb3J0OiBfLnRvTnVtYmVyKF8uZ2V0KHByb2Nlc3MuZW52LCAnQVBJX1BPUlQnKSksXG4gIGJhc2VSb3V0ZTogXy5nZXQocHJvY2Vzcy5lbnYsICdBUElfQkFTRV9ST1VURScpLFxufTtcbmNvbnN0IHJwY0NvbmY6IFJQQ0NvbmZpZ3VyYXRpb24gPSB7XG4gIHBvcnQ6IF8udG9OdW1iZXIoXy5nZXQocHJvY2Vzcy5lbnYsICdSUENfUE9SVCcpKSxcbiAgYmFzZVJvdXRlOiBfLmdldChwcm9jZXNzLmVudiwgJ1JQQ19CQVNFX1JPVVRFJyksXG59O1xuY29uc3QgcmFiYml0Q29uZjogUmFiYml0Q29uZmlndXJhdGlvbiA9IHtcbiAgdXNlcm5hbWU6IF8uZ2V0KHByb2Nlc3MuZW52LCAnUkFCQklUTVFfVVNFUk5BTUUnKSxcbiAgcGFzc3dvcmQ6IF8uZ2V0KHByb2Nlc3MuZW52LCAnUkFCQklUTVFfUEFTU1dPUkQnKSxcbiAgaG9zdDogXy5nZXQocHJvY2Vzcy5lbnYsICdSQUJCSVRNUV9IT1NUJyksXG4gIHBvcnQ6IF8udG9OdW1iZXIoXy5nZXQocHJvY2Vzcy5lbnYsICdSQUJCSVRNUV9QT1JUJykpLFxufTtcbmNvbnN0IGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG4gIGJhc2VEaXI6IF9fZGlybmFtZSxcbiAgc2VydmljZTogc2VydmljZUNvbmYsXG4gIHJhYmJpdDogcmFiYml0Q29uZixcbiAgYXBpOiBhcGlDb25mLFxuICBycGM6IHJwY0NvbmYsXG59O1xuXG5leHBvcnQge1xuICBTZXJ2aWNlQ29uZmlndXJhdGlvbixcbiAgQXBpQ29uZmlndXJhdGlvbixcbiAgUmFiYml0Q29uZmlndXJhdGlvbixcbiAgQ29uZmlndXJhdGlvbixcbiAgc2VydmljZUNvbmYsXG4gIGFwaUNvbmYsXG4gIHJwY0NvbmYsXG4gIHJhYmJpdENvbmYsXG4gIGNvbmZpZ3VyYXRpb24sXG59OyJdfQ==