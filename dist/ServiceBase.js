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
const lodash_1 = __importDefault(require("lodash"));
const cors_1 = __importDefault(require("cors"));
const rabbit_1 = __importDefault(require("./rabbit"));
const logger_1 = require("./utils/logger");
const api_1 = require("./utils/api");
const loaders_1 = require("./utils/loaders");
const config_1 = require("./utils/config");
class ServiceBase {
    constructor(opts) {
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
        this.apiApp = api_1.express();
        this.apiApp.use(api_1.logApiRoute.bind(this, this.resources));
        // RPC APP
        this.rpcApp = api_1.express();
        this.rpcApp.use(api_1.logApiRoute.bind(this, this.resources));
        this.rpcApp.use(api_1.express.json());
        this.rpcApp.use(api_1.express.urlencoded({ extended: true }));
        this.rpcApp.use(cors_1.default());
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
            yield loaders_1.loadTasks(this);
            if (lodash_1.default.isEmpty(this.tasks)) {
                this.resources.logger.warn('- No tasks loaded...');
            }
            this.resources.logger.info('Tasks initialized');
        });
    }
    initEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loaders_1.loadEvents(this);
            if (lodash_1.default.isEmpty(this.events)) {
                this.resources.logger.warn('- No events loaded...');
            }
            this.resources.logger.info('Events initialized');
        });
    }
    initRPCProcedures() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loaders_1.loadRPCs(this);
            if (lodash_1.default.isEmpty(this.rpcs)) {
                this.resources.logger.warn('- No RPC\'s loaded...');
            }
        });
    }
    initAPIRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loaders_1.loadRoutes(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUF1QjtBQUN2QixnREFBd0I7QUFFeEIsc0RBQThCO0FBQzlCLDJDQUF3QztBQUN4QyxxQ0FJcUI7QUFDckIsNkNBS3lCO0FBT3pCLDJDQU13QjtBQWF4QixNQUFxQixXQUFXO0lBWTlCLFlBQVksSUFBcUI7UUFDL0IsTUFBTSxJQUFJLEdBQUcsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLGNBQWMsR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxhQUFhLEdBQWtCO1lBQ2pDLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxvQkFBVztZQUNwQixNQUFNLEVBQUUsbUJBQVU7WUFDbEIsR0FBRyxFQUFFLGdCQUFPO1lBQ1osR0FBRyxFQUFFLGdCQUFPO1NBQ2IsQ0FBQztRQUVGLElBQUksSUFBSSxFQUFFO1lBQ1IsYUFBYSxHQUFHLGdCQUFDLENBQUMsS0FBSyxDQUNyQixhQUFhLEVBQ2IsZ0JBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGdCQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ3BDLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVoRSxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsU0FBUyxH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QU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLE1BQU07YUFDVDtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlFLENBQUM7S0FBQTtDQUNGO0FBNUtELDhCQTRLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IFJhYmJpdCBmcm9tICcuL3JhYmJpdCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1xuICBleHByZXNzLFxuICBFeHByZXNzLFxuICBsb2dBcGlSb3V0ZSxcbn0gZnJvbSAnLi91dGlscy9hcGknO1xuaW1wb3J0IHtcbiAgbG9hZEV2ZW50cyxcbiAgbG9hZFRhc2tzLFxuICBsb2FkUlBDcyxcbiAgbG9hZFJvdXRlcyxcbn0gZnJvbSAnLi91dGlscy9sb2FkZXJzJztcbmltcG9ydCB7XG4gIEV2ZW50SGFuZGxlckJhc2UsXG4gIFRhc2tIYW5kbGVyQmFzZSxcbiAgUlBDSGFuZGxlckJhc2UsXG4gIFJvdXRlSGFuZGxlckJhc2UsXG59IGZyb20gJy4vaGFuZGxlcnMnO1xuaW1wb3J0IHtcbiAgc2VydmljZUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIGFwaUNvbmYsXG4gIHJwY0NvbmYsXG4gIENvbmZpZ3VyYXRpb24sXG59IGZyb20gJy4vdXRpbHMvY29uZmlnJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUmVzb3VyY2VzIHtcbiAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXQ7XG4gIGxvZ2dlcjogTG9nZ2VyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VPcHRpb25zIHtcbiAgY29uZmlndXJhdGlvbj86IFBhcnRpYWw8Q29uZmlndXJhdGlvbj47XG4gIGxvZ2dlckNhbGxiYWNrPzogRnVuY3Rpb24gfCBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlQmFzZSB7XG4gIHB1YmxpYyBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBhcGlBcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyBycGNBcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogYW55O1xuICBwcm90ZWN0ZWQgdGFza3M6IGFueTtcbiAgcHJvdGVjdGVkIHJvdXRlczogYW55O1xuICBwcm90ZWN0ZWQgcnBjczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM/OiBTZXJ2aWNlT3B0aW9ucykge1xuICAgIGNvbnN0IGNvbmYgPSBfLmdldChvcHRzLCAnY29uZmlndXJhdGlvbicsIG51bGwpO1xuICAgIGNvbnN0IGxvZ2dlckNhbGxiYWNrID0gXy5nZXQob3B0cywgJ2xvZ2dlckNhbGxiYWNrJywgbnVsbCk7XG5cbiAgICBsZXQgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGJhc2VEaXI6IF9fZGlybmFtZSxcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2VDb25mLFxuICAgICAgcmFiYml0OiByYWJiaXRDb25mLFxuICAgICAgYXBpOiBhcGlDb25mLFxuICAgICAgcnBjOiBycGNDb25mLFxuICAgIH07XG5cbiAgICBpZiAoY29uZikge1xuICAgICAgY29uZmlndXJhdGlvbiA9IF8ubWVyZ2UoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIF8ucGljayhjb25mLCBfLmtleXMoY29uZmlndXJhdGlvbikpLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlLCBsb2dnZXJDYWxsYmFjayk7XG5cbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24sIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnJlc291cmNlcyA9IHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICByYWJiaXQsXG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgIH07XG5cbiAgICAvLyBBUEkgQVBQXG4gICAgdGhpcy5hcGlBcHAgPSBleHByZXNzKCk7XG4gICAgdGhpcy5hcGlBcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcblxuICAgIC8vIFJQQyBBUFBcbiAgICB0aGlzLnJwY0FwcCA9IGV4cHJlc3MoKTtcbiAgICB0aGlzLnJwY0FwcC51c2UobG9nQXBpUm91dGUuYmluZCh0aGlzLCB0aGlzLnJlc291cmNlcykpO1xuICAgIHRoaXMucnBjQXBwLnVzZShleHByZXNzLmpzb24oKSk7XG4gICAgdGhpcy5ycGNBcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcbiAgICB0aGlzLnJwY0FwcC51c2UoY29ycygpKTtcblxuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMucm91dGVzID0ge307XG4gICAgdGhpcy5ycGNzID0ge307XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmFiYml0XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRUYXNrcygpIHtcbiAgICBhd2FpdCBsb2FkVGFza3ModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnRhc2tzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gdGFza3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdUYXNrcyBpbml0aWFsaXplZCcpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEV2ZW50cygpIHtcbiAgICBhd2FpdCBsb2FkRXZlbnRzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ldmVudHMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyBldmVudHMgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdFdmVudHMgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRSUENQcm9jZWR1cmVzKCkge1xuICAgIGF3YWl0IGxvYWRSUENzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ycGNzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gUlBDXFwncyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0QVBJUm91dGVzKCkge1xuICAgIGF3YWl0IGxvYWRSb3V0ZXModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJvdXRlcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHJvdXRlcyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdGFydEFQSSgpIHtcbiAgICBhd2FpdCB0aGlzLmFwaUFwcC5saXN0ZW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0FQSSBzdGFydGVkIG9uIHBvcnQnLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0UlBDcygpIHtcbiAgICBhd2FpdCB0aGlzLnJwY0FwcC5saXN0ZW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5ycGMucG9ydCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ1JQQ3Mgc3RhcnRlZCBvbiBwb3J0JywgdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5ycGMucG9ydCk7XG4gIH1cblxuICBhc3luYyBpbml0QVBJKCkge1xuICAgIGF3YWl0IHRoaXMuaW5pdEFQSVJvdXRlcygpO1xuICAgIGF3YWl0IHRoaXMuc3RhcnRBUEkoKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRSUENzKCkge1xuICAgIGF3YWl0IHRoaXMuaW5pdFJQQ1Byb2NlZHVyZXMoKTtcbiAgICBhd2FpdCB0aGlzLnN0YXJ0UlBDcygpO1xuICB9XG5cbiAgYXN5bmMgbG9hZEV2ZW50KGhhbmRsZXI6IEV2ZW50SGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoXy5oYXModGhpcy5ldmVudHMsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgZXZlbnQgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICB0aGlzLmV2ZW50c1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gIH1cblxuICBhc3luYyBsb2FkVGFzayhoYW5kbGVyOiBUYXNrSGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoXy5oYXModGhpcy50YXNrcywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCB0YXNrIGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgdGhpcy50YXNrc1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gIH1cblxuICBhc3luYyBsb2FkUlBDKGhhbmRsZXI6IFJQQ0hhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgcnBjSWQgPSBoYW5kbGVyLnByb2NlZHVyZTtcbiAgICBpZiAoXy5oYXModGhpcy5ycGNzLCBycGNJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBSUEMgcm91dGUgbGlzdGVuZXI6ICR7cnBjSWR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcnBjQmFzZVJvdXRlID0gXy5pc0VtcHR5KHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24ucnBjLmJhc2VSb3V0ZSkgPyAnJyA6IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24ucnBjLmJhc2VSb3V0ZTtcbiAgICBjb25zdCByb3V0ZVVSTCA9IGAke3JwY0Jhc2VSb3V0ZX0vJHtoYW5kbGVyLnByb2NlZHVyZX1gO1xuXG4gICAgdGhpcy5ycGNBcHAucG9zdChyb3V0ZVVSTCwgaGFuZGxlci5yb3V0ZUNhbGxiYWNrLmJpbmQoaGFuZGxlcikpO1xuXG4gICAgdGhpcy5ycGNzW3JwY0lkXSA9IGhhbmRsZXI7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJy1bcnBjXScsIHJvdXRlVVJMKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRSb3V0ZShoYW5kbGVyOiBSb3V0ZUhhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgcm91dGVJZCA9IGAke2hhbmRsZXIubWV0aG9kfToke2hhbmRsZXIudXJsfWA7XG4gICAgaWYgKF8uaGFzKHRoaXMucm91dGVzLCByb3V0ZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIEFQSSByb3V0ZSBsaXN0ZW5lcjogJHtyb3V0ZUlkfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGFwaUJhc2VSb3V0ZSA9IF8uaXNFbXB0eSh0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5iYXNlUm91dGUpID8gJycgOiB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5iYXNlUm91dGU7XG4gICAgY29uc3Qgcm91dGVVUkwgPSBgJHthcGlCYXNlUm91dGV9JHtoYW5kbGVyLnVybH1gO1xuXG4gICAgc3dpdGNoIChoYW5kbGVyLm1ldGhvZCkge1xuICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgdGhpcy5hcGlBcHAuZ2V0KHJvdXRlVVJMLCBoYW5kbGVyLnJvdXRlQ2FsbGJhY2suYmluZChoYW5kbGVyKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgIHRoaXMuYXBpQXBwLnBvc3Qocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwdXQnOlxuICAgICAgICB0aGlzLmFwaUFwcC5wdXQocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICB0aGlzLmFwaUFwcC5kZWxldGUocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5yb3V0ZXNbcm91dGVJZF0gPSBoYW5kbGVyO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCctW3JvdXRlXScsIF8udG9VcHBlcihoYW5kbGVyLm1ldGhvZCksIHJvdXRlVVJMKTtcbiAgfVxufVxuIl19