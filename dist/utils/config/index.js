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
};
exports.configuration = configuration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvY29uZmlnL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1QixtQ0FBaUU7QUFDakUsb0NBQW9DO0FBQ3BDLGVBQTZCLEVBQUUsQ0FBQztBQXdCaEMsTUFBTSxXQUFXLEdBQXlCO0lBQ3hDLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDO0lBQzlDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDO0lBQ3RDLFVBQVUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztDQUMxRCxDQUFDO0FBdUJBLGtDQUFXO0FBdEJiLE1BQU0sT0FBTyxHQUFxQjtJQUNoQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDaEQsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQztDQUNoRCxDQUFDO0FBb0JBLDBCQUFPO0FBbkJULE1BQU0sVUFBVSxHQUF3QjtJQUN0QyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDO0lBQ2pELFFBQVEsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUM7SUFDakQsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUM7SUFDekMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0NBQ3RELENBQUM7QUFlQSxnQ0FBVTtBQWRaLE1BQU0sYUFBYSxHQUFrQjtJQUNuQyxPQUFPLEVBQUUsU0FBUztJQUNsQixPQUFPLEVBQUUsV0FBVztJQUNwQixNQUFNLEVBQUUsVUFBVTtJQUNsQixHQUFHLEVBQUUsT0FBTztDQUNiLENBQUM7QUFVQSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGNvbmZpZyBhcyBjb25maWd1cmVFbnZpcm9ubWVudFZhcmlhYmxlcyB9IGZyb20gJ2RvdGVudic7XG4vLyByZXF1aXJlIG91ciBlbnZpcm9ubWVudCB2YXJpYWJsZXNcbmNvbmZpZ3VyZUVudmlyb25tZW50VmFyaWFibGVzKCk7XG5cbmludGVyZmFjZSBTZXJ2aWNlQ29uZmlndXJhdGlvbiB7XG4gIGVudmlyb25tZW50Pzogc3RyaW5nO1xuICBzZXJ2aWNlPzogc3RyaW5nO1xuICBsb2dnZXJNb2RlPzogbnVtYmVyO1xufVxuaW50ZXJmYWNlIEFwaUNvbmZpZ3VyYXRpb24ge1xuICBwb3J0PzogbnVtYmVyO1xuICBiYXNlUm91dGU/OiBzdHJpbmc7XG59XG5pbnRlcmZhY2UgUmFiYml0Q29uZmlndXJhdGlvbiB7XG4gIGhvc3Q/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG4gIHVzZXJuYW1lPzogc3RyaW5nO1xuICBwYXNzd29yZD86IHN0cmluZztcbn1cbmludGVyZmFjZSBDb25maWd1cmF0aW9uIHtcbiAgYmFzZURpcj86IHN0cmluZztcbiAgc2VydmljZT86IFNlcnZpY2VDb25maWd1cmF0aW9uO1xuICByYWJiaXQ/OiBSYWJiaXRDb25maWd1cmF0aW9uO1xuICBhcGk/OiBBcGlDb25maWd1cmF0aW9uO1xufVxuXG5jb25zdCBzZXJ2aWNlQ29uZjogU2VydmljZUNvbmZpZ3VyYXRpb24gPSB7XG4gIGVudmlyb25tZW50OiBfLmdldChwcm9jZXNzLmVudiwgJ0VOVklST05NRU5UJyksXG4gIHNlcnZpY2U6IF8uZ2V0KHByb2Nlc3MuZW52LCAnU0VSVklDRScpLFxuICBsb2dnZXJNb2RlOiBfLnRvTnVtYmVyKF8uZ2V0KHByb2Nlc3MuZW52LCAnTE9HR0VSX01PREUnKSksXG59O1xuY29uc3QgYXBpQ29uZjogQXBpQ29uZmlndXJhdGlvbiA9IHtcbiAgcG9ydDogXy50b051bWJlcihfLmdldChwcm9jZXNzLmVudiwgJ0FQSV9QT1JUJykpLFxuICBiYXNlUm91dGU6IF8uZ2V0KHByb2Nlc3MuZW52LCAnQVBJX0JBU0VfUk9VVEUnKSxcbn07XG5jb25zdCByYWJiaXRDb25mOiBSYWJiaXRDb25maWd1cmF0aW9uID0ge1xuICB1c2VybmFtZTogXy5nZXQocHJvY2Vzcy5lbnYsICdSQUJCSVRNUV9VU0VSTkFNRScpLFxuICBwYXNzd29yZDogXy5nZXQocHJvY2Vzcy5lbnYsICdSQUJCSVRNUV9QQVNTV09SRCcpLFxuICBob3N0OiBfLmdldChwcm9jZXNzLmVudiwgJ1JBQkJJVE1RX0hPU1QnKSxcbiAgcG9ydDogXy50b051bWJlcihfLmdldChwcm9jZXNzLmVudiwgJ1JBQkJJVE1RX1BPUlQnKSksXG59O1xuY29uc3QgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgYmFzZURpcjogX19kaXJuYW1lLFxuICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgcmFiYml0OiByYWJiaXRDb25mLFxuICBhcGk6IGFwaUNvbmYsXG59O1xuXG5leHBvcnQge1xuICBTZXJ2aWNlQ29uZmlndXJhdGlvbixcbiAgQXBpQ29uZmlndXJhdGlvbixcbiAgUmFiYml0Q29uZmlndXJhdGlvbixcbiAgQ29uZmlndXJhdGlvbixcbiAgc2VydmljZUNvbmYsXG4gIGFwaUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIGNvbmZpZ3VyYXRpb24sXG59OyJdfQ==