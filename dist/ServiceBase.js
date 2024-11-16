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
const lodash_1 = __importDefault(require("lodash"));
const cors_1 = __importDefault(require("cors"));
const rabbit_1 = __importDefault(require("./rabbit"));
const logger_1 = require("./utils/logger");
const api_1 = require("./utils/api");
const loaders_1 = require("./utils/loaders");
const config_1 = require("./utils/config");
class ServiceBase {
    constructor(opts) {
        this.events = {};
        this.tasks = {};
        this.routes = {};
        this.rpcs = {};
        const conf = lodash_1.default.get(opts, 'configuration', null);
        const loggerCallback = lodash_1.default.get(opts, 'loggerCallback', null);
        let configuration = {
            baseDir: __dirname,
            service: config_1.serviceConf,
            rabbit: config_1.rabbitConf,
            api: config_1.apiConf,
            rpc: config_1.rpcConf,
        };
        if (conf) {
            configuration = lodash_1.default.merge(configuration, lodash_1.default.pick(conf, lodash_1.default.keys(configuration)));
        }
        this.configuration = configuration;
        this.logger = new logger_1.Logger(configuration.service, loggerCallback);
        const rabbit = new rabbit_1.default(configuration, this.logger);
        this.resources = {
            configuration,
            rabbit,
            logger: this.logger,
        };
        // API APP
        this.apiApp = (0, api_1.express)();
        this.apiApp.use(api_1.logApiRoute.bind(this, this.resources));
        // RPC APP
        this.rpcApp = (0, api_1.express)();
        this.rpcApp.use(api_1.logApiRoute.bind(this, this.resources));
        this.rpcApp.use(api_1.express.json());
        this.rpcApp.use(api_1.express.urlencoded({ extended: true }));
        this.rpcApp.use((0, cors_1.default)());
        this.events = {};
        this.tasks = {};
        this.routes = {};
        this.rpcs = {};
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize rabbit
            yield this.resources.rabbit.init();
        });
    }
    initTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, loaders_1.loadTasks)(this);
            if (lodash_1.default.isEmpty(this.tasks)) {
                this.resources.logger.warn('- No tasks loaded...');
            }
            this.resources.logger.info('Tasks initialized');
        });
    }
    initEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, loaders_1.loadEvents)(this);
            if (lodash_1.default.isEmpty(this.events)) {
                this.resources.logger.warn('- No events loaded...');
            }
            this.resources.logger.info('Events initialized');
        });
    }
    initRPCProcedures() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, loaders_1.loadRPCs)(this);
            if (lodash_1.default.isEmpty(this.rpcs)) {
                this.resources.logger.warn('- No RPC\'s loaded...');
            }
        });
    }
    initAPIRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, loaders_1.loadRoutes)(this);
            if (lodash_1.default.isEmpty(this.routes)) {
                this.resources.logger.warn('- No routes loaded...');
            }
        });
    }
    startAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.apiApp.listen(this.resources.configuration.api.port);
            this.resources.logger.info('API started on port', this.resources.configuration.api.port);
        });
    }
    startRPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.rpcApp.listen(this.resources.configuration.rpc.port);
            this.resources.logger.info('RPCs started on port', this.resources.configuration.rpc.port);
        });
    }
    initAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initAPIRoutes();
            yield this.startAPI();
        });
    }
    initRPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initRPCProcedures();
            yield this.startRPCs();
        });
    }
    loadEvent(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lodash_1.default.has(this.events, handler.topic)) {
                throw new Error(`Duplicated event listener: ${handler.topic}`);
            }
            yield handler.init();
            this.events[handler.topic] = handler;
        });
    }
    loadTask(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            if (lodash_1.default.has(this.tasks, handler.topic)) {
                throw new Error(`Duplicated task listener: ${handler.topic}`);
            }
            yield handler.init();
            this.tasks[handler.topic] = handler;
        });
    }
    loadRPC(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const rpcId = handler.procedure;
            if (lodash_1.default.has(this.rpcs, rpcId)) {
                throw new Error(`Duplicated RPC route listener: ${rpcId}`);
            }
            const rpcBaseRoute = lodash_1.default.isEmpty(this.resources.configuration.rpc.baseRoute) ? '' : this.resources.configuration.rpc.baseRoute;
            const routeURL = `${rpcBaseRoute}/${handler.procedure}`;
            this.rpcApp.post(routeURL, handler.routeCallback.bind(handler));
            this.rpcs[rpcId] = handler;
            this.resources.logger.info('-[rpc]', routeURL);
        });
    }
    loadRoute(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeId = `${handler.method}:${handler.url}`;
            if (lodash_1.default.has(this.routes, routeId)) {
                throw new Error(`Duplicated API route listener: ${routeId}`);
            }
            const apiBaseRoute = lodash_1.default.isEmpty(this.resources.configuration.api.baseRoute) ? '' : this.resources.configuration.api.baseRoute;
            const routeURL = `${apiBaseRoute}${handler.url}`;
            switch (handler.method) {
                case 'get':
                    this.apiApp.get(routeURL, handler.routeCallback.bind(handler));
                    break;
                case 'post':
                    this.apiApp.post(routeURL, handler.routeCallback.bind(handler));
                    break;
                case 'put':
                    this.apiApp.put(routeURL, handler.routeCallback.bind(handler));
                    break;
                case 'delete':
                    this.apiApp.delete(routeURL, handler.routeCallback.bind(handler));
                    break;
            }
            this.routes[routeId] = handler;
            this.resources.logger.info('-[route]', lodash_1.default.toUpper(handler.method), routeURL);
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBdUI7QUFDdkIsZ0RBQXdCO0FBRXhCLHNEQUE4QjtBQUM5QiwyQ0FBd0M7QUFDeEMscUNBSXFCO0FBQ3JCLDZDQUt5QjtBQU96QiwyQ0FNd0I7QUFheEIsTUFBcUIsV0FBVztJQWE5QixZQUFZLElBQXFCO1FBTHZCLFdBQU0sR0FBd0MsRUFBRSxDQUFDO1FBQ2pELFVBQUssR0FBdUMsRUFBRSxDQUFDO1FBQy9DLFdBQU0sR0FBd0MsRUFBRSxDQUFDO1FBQ2pELFNBQUksR0FBc0MsRUFBRSxDQUFDO1FBR3JELE1BQU0sSUFBSSxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQUcsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTNELElBQUksYUFBYSxHQUFrQjtZQUNqQyxPQUFPLEVBQUUsU0FBUztZQUNsQixPQUFPLEVBQUUsb0JBQVc7WUFDcEIsTUFBTSxFQUFFLG1CQUFVO1lBQ2xCLEdBQUcsRUFBRSxnQkFBTztZQUNaLEdBQUcsRUFBRSxnQkFBTztTQUNiLENBQUM7UUFFRixJQUFJLElBQUksRUFBRSxDQUFDO1lBQ1QsYUFBYSxHQUFHLGdCQUFDLENBQUMsS0FBSyxDQUNyQixhQUFhLEVBQ2IsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGdCQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ3BDLENBQUM7UUFDSixDQUFDO1FBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxhQUFhLENBQUMs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QUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2hFLE1BQU07Z0JBQ1IsS0FBSyxLQUFLO29CQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxNQUFNO2dCQUNSLEtBQUssUUFBUTtvQkFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTTtZQUNWLENBQUM7WUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5RSxDQUFDO0tBQUE7Q0FDRjtBQTlLRCw4QkE4S0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XG5cbmltcG9ydCBSYWJiaXQgZnJvbSAnLi9yYWJiaXQnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtcbiAgZXhwcmVzcyxcbiAgRXhwcmVzcyxcbiAgbG9nQXBpUm91dGUsXG59IGZyb20gJy4vdXRpbHMvYXBpJztcbmltcG9ydCB7XG4gIGxvYWRFdmVudHMsXG4gIGxvYWRUYXNrcyxcbiAgbG9hZFJQQ3MsXG4gIGxvYWRSb3V0ZXMsXG59IGZyb20gJy4vdXRpbHMvbG9hZGVycyc7XG5pbXBvcnQge1xuICBFdmVudEhhbmRsZXJCYXNlLFxuICBUYXNrSGFuZGxlckJhc2UsXG4gIFJQQ0hhbmRsZXJCYXNlLFxuICBSb3V0ZUhhbmRsZXJCYXNlLFxufSBmcm9tICcuL2hhbmRsZXJzJztcbmltcG9ydCB7XG4gIHNlcnZpY2VDb25mLFxuICByYWJiaXRDb25mLFxuICBhcGlDb25mLFxuICBycGNDb25mLFxuICBDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL2NvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZVJlc291cmNlcyB7XG4gIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0O1xuICBsb2dnZXI6IExvZ2dlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlT3B0aW9ucyB7XG4gIGNvbmZpZ3VyYXRpb24/OiBQYXJ0aWFsPENvbmZpZ3VyYXRpb24+O1xuICBsb2dnZXJDYWxsYmFjaz86IEZ1bmN0aW9uIHwgbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUJhc2Uge1xuICBwdWJsaWMgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcHVibGljIHJlc291cmNlczogU2VydmljZVJlc291cmNlcztcblxuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBhcGlBcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyBycGNBcHA6IEV4cHJlc3M7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogeyBba2V5OiBzdHJpbmddOiBFdmVudEhhbmRsZXJCYXNlIH0gPSB7fTtcbiAgcHJvdGVjdGVkIHRhc2tzOiB7IFtrZXk6IHN0cmluZ106IFRhc2tIYW5kbGVyQmFzZSB9ID0ge307XG4gIHByb3RlY3RlZCByb3V0ZXM6IHsgW2tleTogc3RyaW5nXTogUm91dGVIYW5kbGVyQmFzZSB9ID0ge307XG4gIHByb3RlY3RlZCBycGNzOiB7IFtrZXk6IHN0cmluZ106IFJQQ0hhbmRsZXJCYXNlIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihvcHRzPzogU2VydmljZU9wdGlvbnMpIHtcbiAgICBjb25zdCBjb25mID0gXy5nZXQob3B0cywgJ2NvbmZpZ3VyYXRpb24nLCBudWxsKTtcbiAgICBjb25zdCBsb2dnZXJDYWxsYmFjayA9IF8uZ2V0KG9wdHMsICdsb2dnZXJDYWxsYmFjaycsIG51bGwpO1xuXG4gICAgbGV0IGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICBiYXNlRGlyOiBfX2Rpcm5hbWUsXG4gICAgICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgICAgIHJhYmJpdDogcmFiYml0Q29uZixcbiAgICAgIGFwaTogYXBpQ29uZixcbiAgICAgIHJwYzogcnBjQ29uZixcbiAgICB9O1xuXG4gICAgaWYgKGNvbmYpIHtcbiAgICAgIGNvbmZpZ3VyYXRpb24gPSBfLm1lcmdlKFxuICAgICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgICBfLnBpY2soY29uZiwgXy5rZXlzKGNvbmZpZ3VyYXRpb24pKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlLCBsb2dnZXJDYWxsYmFjayk7XG5cbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24sIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnJlc291cmNlcyA9IHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICByYWJiaXQsXG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgIH07XG5cbiAgICAvLyBBUEkgQVBQXG4gICAgdGhpcy5hcGlBcHAgPSBleHByZXNzKCk7XG4gICAgdGhpcy5hcGlBcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcblxuICAgIC8vIFJQQyBBUFBcbiAgICB0aGlzLnJwY0FwcCA9IGV4cHJlc3MoKTtcbiAgICB0aGlzLnJwY0FwcC51c2UobG9nQXBpUm91dGUuYmluZCh0aGlzLCB0aGlzLnJlc291cmNlcykpO1xuICAgIHRoaXMucnBjQXBwLnVzZShleHByZXNzLmpzb24oKSk7XG4gICAgdGhpcy5ycGNBcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcbiAgICB0aGlzLnJwY0FwcC51c2UoY29ycygpKTtcblxuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMucm91dGVzID0ge307XG4gICAgdGhpcy5ycGNzID0ge307XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmFiYml0XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRUYXNrcygpIHtcbiAgICBhd2FpdCBsb2FkVGFza3ModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnRhc2tzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gdGFza3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdUYXNrcyBpbml0aWFsaXplZCcpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEV2ZW50cygpIHtcbiAgICBhd2FpdCBsb2FkRXZlbnRzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ldmVudHMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyBldmVudHMgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdFdmVudHMgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRSUENQcm9jZWR1cmVzKCkge1xuICAgIGF3YWl0IGxvYWRSUENzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ycGNzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gUlBDXFwncyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0QVBJUm91dGVzKCkge1xuICAgIGF3YWl0IGxvYWRSb3V0ZXModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJvdXRlcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHJvdXRlcyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdGFydEFQSSgpIHtcbiAgICBhd2FpdCB0aGlzLmFwaUFwcC5saXN0ZW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0FQSSBzdGFydGVkIG9uIHBvcnQnLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0UlBDcygpIHtcbiAgICBhd2FpdCB0aGlzLnJwY0FwcC5saXN0ZW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5ycGMucG9ydCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ1JQQ3Mgc3RhcnRlZCBvbiBwb3J0JywgdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5ycGMucG9ydCk7XG4gIH1cblxuICBhc3luYyBpbml0QVBJKCkge1xuICAgIGF3YWl0IHRoaXMuaW5pdEFQSVJvdXRlcygpO1xuICAgIGF3YWl0IHRoaXMuc3RhcnRBUEkoKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRSUENzKCkge1xuICAgIGF3YWl0IHRoaXMuaW5pdFJQQ1Byb2NlZHVyZXMoKTtcbiAgICBhd2FpdCB0aGlzLnN0YXJ0UlBDcygpO1xuICB9XG5cbiAgYXN5bmMgbG9hZEV2ZW50KGhhbmRsZXI6IEV2ZW50SGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoXy5oYXModGhpcy5ldmVudHMsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgZXZlbnQgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICB0aGlzLmV2ZW50c1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gIH1cblxuICBhc3luYyBsb2FkVGFzayhoYW5kbGVyOiBUYXNrSGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoXy5oYXModGhpcy50YXNrcywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCB0YXNrIGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgdGhpcy50YXNrc1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gIH1cblxuICBhc3luYyBsb2FkUlBDKGhhbmRsZXI6IFJQQ0hhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcnBjSWQgPSBoYW5kbGVyLnByb2NlZHVyZTtcbiAgICBpZiAoXy5oYXModGhpcy5ycGNzLCBycGNJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBSUEMgcm91dGUgbGlzdGVuZXI6ICR7cnBjSWR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcnBjQmFzZVJvdXRlID0gXy5pc0VtcHR5KHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24ucnBjLmJhc2VSb3V0ZSkgPyAnJyA6IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24ucnBjLmJhc2VSb3V0ZTtcbiAgICBjb25zdCByb3V0ZVVSTCA9IGAke3JwY0Jhc2VSb3V0ZX0vJHtoYW5kbGVyLnByb2NlZHVyZX1gO1xuXG4gICAgdGhpcy5ycGNBcHAucG9zdChyb3V0ZVVSTCwgaGFuZGxlci5yb3V0ZUNhbGxiYWNrLmJpbmQoaGFuZGxlcikpO1xuXG4gICAgdGhpcy5ycGNzW3JwY0lkXSA9IGhhbmRsZXI7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJy1bcnBjXScsIHJvdXRlVVJMKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRSb3V0ZShoYW5kbGVyOiBSb3V0ZUhhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgcm91dGVJZCA9IGAke2hhbmRsZXIubWV0aG9kfToke2hhbmRsZXIudXJsfWA7XG4gICAgaWYgKF8uaGFzKHRoaXMucm91dGVzLCByb3V0ZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIEFQSSByb3V0ZSBsaXN0ZW5lcjogJHtyb3V0ZUlkfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGFwaUJhc2VSb3V0ZSA9IF8uaXNFbXB0eSh0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5iYXNlUm91dGUpID8gJycgOiB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5iYXNlUm91dGU7XG4gICAgY29uc3Qgcm91dGVVUkwgPSBgJHthcGlCYXNlUm91dGV9JHtoYW5kbGVyLnVybH1gO1xuXG4gICAgc3dpdGNoIChoYW5kbGVyLm1ldGhvZCkge1xuICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgdGhpcy5hcGlBcHAuZ2V0KHJvdXRlVVJMLCBoYW5kbGVyLnJvdXRlQ2FsbGJhY2suYmluZChoYW5kbGVyKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgIHRoaXMuYXBpQXBwLnBvc3Qocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwdXQnOlxuICAgICAgICB0aGlzLmFwaUFwcC5wdXQocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICB0aGlzLmFwaUFwcC5kZWxldGUocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5yb3V0ZXNbcm91dGVJZF0gPSBoYW5kbGVyO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCctW3JvdXRlXScsIF8udG9VcHBlcihoYW5kbGVyLm1ldGhvZCksIHJvdXRlVVJMKTtcbiAgfVxufVxuIl19