"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const rabbit_1 = __importDefault(require("./rabbit"));
const Logger_1 = __importDefault(require("./utils/Logger"));
const API_1 = require("./utils/API");
const base_1 = require("./base");
const ServiceConf_1 = require("./utils/ServiceConf");
class ServiceBase {
    constructor(opts) {
        const conf = _.get(opts, 'configuration', null);
        const loggerCallback = _.get(opts, 'loggerCallback', null);
        let configuration = {
            baseDir: __dirname,
            service: ServiceConf_1.serviceConf,
            rabbit: ServiceConf_1.rabbitConf,
            api: ServiceConf_1.apiConf,
        };
        if (conf) {
            configuration = _.merge(configuration, _.pick(conf, _.keys(configuration)));
        }
        this.configuration = configuration;
        this.logger = new Logger_1.default(configuration.service, loggerCallback);
        const rabbit = new rabbit_1.default(configuration, this.logger);
        this.resources = {
            configuration,
            rabbit,
            logger: this.logger,
        };
        this.app = API_1.express();
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
            yield base_1.loadTasks(this);
            if (_.isEmpty(this.tasks)) {
                this.resources.logger.warn('- No tasks loaded...');
            }
            this.resources.logger.info('Tasks initialized');
        });
    }
    initEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            yield base_1.loadEvents(this);
            if (_.isEmpty(this.events)) {
                this.resources.logger.warn('- No events loaded...');
            }
            this.resources.logger.info('Events initialized');
        });
    }
    initRPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield base_1.loadRPCs(this);
            if (_.isEmpty(this.rpcs)) {
                this.resources.logger.warn('- No RPC\'s loaded...');
            }
            this.resources.logger.info('RPC\'s initialized');
        });
    }
    initAPIRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(API_1.logApiRoute.bind(this, this.resources));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors_1.default());
            yield API_1.loadRoutes(this);
            if (_.isEmpty(this.routes)) {
                this.resources.logger.warn('- No routes loaded...');
            }
        });
    }
    startAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.resources.configuration.api.port);
            this.resources.logger.info('API started on port', this.resources.configuration.api.port);
        });
    }
    initAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initAPIRoutes();
            yield this.startAPI();
        });
    }
    loadEvent(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_.has(this.events, handler.topic)) {
                throw new Error(`Duplicated event listener: ${handler.topic}`);
            }
            yield handler.init();
            this.events[handler.topic] = handler;
        });
    }
    loadTask(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_.has(this.tasks, handler.topic)) {
                throw new Error(`Duplicated task listener: ${handler.topic}`);
            }
            yield handler.init();
            this.tasks[handler.topic] = handler;
        });
    }
    loadRPC(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            if (_.has(this.rpcs, handler.topic)) {
                throw new Error(`Duplicated rpcs listener: ${handler.topic}`);
            }
            yield handler.init();
            this.rpcs[handler.topic] = handler;
        });
    }
    loadRoute(handler, method) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeId = `${method}:${handler.url}`;
            if (_.has(this.routes, routeId)) {
                throw new Error(`Duplicated API route listener: ${routeId}`);
            }
            const apiBaseRoute = _.isEmpty(this.resources.configuration.api.baseRoute) ? '' : this.resources.configuration.api.baseRoute;
            const routeURL = `${apiBaseRoute}${handler.url}`;
            switch (method) {
                case 'get':
                    this.app.get(routeURL, handler.routeCallback.bind(handler));
                    break;
                case 'post':
                    this.app.post(routeURL, handler.routeCallback.bind(handler));
                    break;
                case 'put':
                    this.app.put(routeURL, handler.routeCallback.bind(handler));
                    break;
                case 'delete':
                    this.app.delete(routeURL, handler.routeCallback.bind(handler));
                    break;
            }
            this.routes[`${method}:${handler.url}`] = handler;
            this.resources.logger.info('-[route]', _.toUpper(method), routeURL);
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsNERBQW9DO0FBQ3BDLHFDQU1xQjtBQUNyQixpQ0FRZ0I7QUFDaEIscURBSzZCO0FBYTdCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFxQjtRQUMvQixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxhQUFhLEdBQWtCO1lBQ2pDLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSx5QkFBVztZQUNwQixNQUFNLEVBQUUsd0JBQVU7WUFDbEIsR0FBRyxFQUFFLHFCQUFPO1NBQ2IsQ0FBQztRQUVGLElBQUksSUFBSSxFQUFFO1lBQ1IsYUFBYSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQ3JCLGFBQWEsRUFDYixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ3BDLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFaEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFNBQVMsR0FBRztZ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LENBQUMsQ0FBQyxDQUFDO29CQUM1RCxNQUFNO2dCQUNSLEtBQUssUUFBUTtvQkFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsTUFBTTthQUNUO1lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7S0FBQTtDQUNGO0FBdkpELDhCQXVKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XG5cbmltcG9ydCBSYWJiaXQgZnJvbSAnLi9yYWJiaXQnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL3V0aWxzL0xvZ2dlcic7XG5pbXBvcnQge1xuICBleHByZXNzLFxuICBFeHByZXNzLFxuICBsb2FkUm91dGVzLFxuICBsb2dBcGlSb3V0ZSxcbiAgVHJ1c3RlZEVuZHBvaW50cyxcbn0gZnJvbSAnLi91dGlscy9BUEknO1xuaW1wb3J0IHtcbiAgbG9hZEV2ZW50cyxcbiAgbG9hZFRhc2tzLFxuICBsb2FkUlBDcyxcbiAgRXZlbnRIYW5kbGVyQmFzZSxcbiAgVGFza0hhbmRsZXJCYXNlLFxuICBSUENIYW5kbGVyQmFzZSxcbiAgUm91dGVIYW5kbGVyQmFzZSxcbn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7XG4gIHNlcnZpY2VDb25mLFxuICByYWJiaXRDb25mLFxuICBhcGlDb25mLFxuICBDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL1NlcnZpY2VDb25mJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUmVzb3VyY2VzIHtcbiAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXQ7XG4gIGxvZ2dlcjogTG9nZ2VyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VPcHRpb25zIHtcbiAgY29uZmlndXJhdGlvbj86IENvbmZpZ3VyYXRpb247XG4gIGxvZ2dlckNhbGxiYWNrPzogRnVuY3Rpb24gfCBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlQmFzZSB7XG4gIHB1YmxpYyBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBhcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogYW55O1xuICBwcm90ZWN0ZWQgdGFza3M6IGFueTtcbiAgcHJvdGVjdGVkIHJvdXRlczogYW55O1xuICBwcm90ZWN0ZWQgcnBjczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM/OiBTZXJ2aWNlT3B0aW9ucykge1xuICAgIGNvbnN0IGNvbmYgPSBfLmdldChvcHRzLCAnY29uZmlndXJhdGlvbicsIG51bGwpO1xuICAgIGNvbnN0IGxvZ2dlckNhbGxiYWNrID0gXy5nZXQob3B0cywgJ2xvZ2dlckNhbGxiYWNrJywgbnVsbCk7XG5cbiAgICBsZXQgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGJhc2VEaXI6IF9fZGlybmFtZSxcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2VDb25mLFxuICAgICAgcmFiYml0OiByYWJiaXRDb25mLFxuICAgICAgYXBpOiBhcGlDb25mLFxuICAgIH07XG5cbiAgICBpZiAoY29uZikge1xuICAgICAgY29uZmlndXJhdGlvbiA9IF8ubWVyZ2UoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIF8ucGljayhjb25mLCBfLmtleXMoY29uZmlndXJhdGlvbikpLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlLCBsb2dnZXJDYWxsYmFjayk7XG5cbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24sIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnJlc291cmNlcyA9IHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICByYWJiaXQsXG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgIH07XG5cbiAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcblxuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMucm91dGVzID0ge307XG4gICAgdGhpcy5ycGNzID0ge307XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmFiYml0XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRUYXNrcygpIHtcbiAgICBhd2FpdCBsb2FkVGFza3ModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnRhc2tzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gdGFza3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdUYXNrcyBpbml0aWFsaXplZCcpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEV2ZW50cygpIHtcbiAgICBhd2FpdCBsb2FkRXZlbnRzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ldmVudHMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyBldmVudHMgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdFdmVudHMgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRSUENzKCkge1xuICAgIGF3YWl0IGxvYWRSUENzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ycGNzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gUlBDXFwncyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ1JQQ1xcJ3MgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRBUElSb3V0ZXMoKSB7XG4gICAgdGhpcy5hcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuICAgIHRoaXMuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xuICAgIHRoaXMuYXBwLnVzZShjb3JzKCkpO1xuXG4gICAgYXdhaXQgbG9hZFJvdXRlcyh0aGlzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMucm91dGVzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gcm91dGVzIGxvYWRlZC4uLicpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHN0YXJ0QVBJKCkge1xuICAgIGF3YWl0IHRoaXMuYXBwLmxpc3Rlbih0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnQVBJIHN0YXJ0ZWQgb24gcG9ydCcsIHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEFQSSgpIHtcbiAgICBhd2FpdCB0aGlzLmluaXRBUElSb3V0ZXMoKTtcbiAgICBhd2FpdCB0aGlzLnN0YXJ0QVBJKCk7XG4gIH1cblxuICBhc3luYyBsb2FkRXZlbnQoaGFuZGxlcjogRXZlbnRIYW5kbGVyQmFzZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChfLmhhcyh0aGlzLmV2ZW50cywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBldmVudCBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgIH1cblxuICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgIHRoaXMuZXZlbnRzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgfVxuXG4gIGFzeW5jIGxvYWRUYXNrKGhhbmRsZXI6IFRhc2tIYW5kbGVyQmFzZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChfLmhhcyh0aGlzLnRhc2tzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIHRhc2sgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICB0aGlzLnRhc2tzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgfVxuXG4gIGFzeW5jIGxvYWRSUEMoaGFuZGxlcjogUlBDSGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoXy5oYXModGhpcy5ycGNzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIHJwY3MgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICB0aGlzLnJwY3NbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICB9XG5cbiAgYXN5bmMgbG9hZFJvdXRlKGhhbmRsZXI6IFJvdXRlSGFuZGxlckJhc2UsIG1ldGhvZDogVHJ1c3RlZEVuZHBvaW50cyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJvdXRlSWQgPSBgJHttZXRob2R9OiR7aGFuZGxlci51cmx9YDtcbiAgICBpZiAoXy5oYXModGhpcy5yb3V0ZXMsIHJvdXRlSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgQVBJIHJvdXRlIGxpc3RlbmVyOiAke3JvdXRlSWR9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXBpQmFzZVJvdXRlID0gXy5pc0VtcHR5KHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLmJhc2VSb3V0ZSkgPyAnJyA6IHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLmJhc2VSb3V0ZTtcbiAgICBjb25zdCByb3V0ZVVSTCA9IGAke2FwaUJhc2VSb3V0ZX0ke2hhbmRsZXIudXJsfWA7XG5cbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgdGhpcy5hcHAuZ2V0KHJvdXRlVVJMLCBoYW5kbGVyLnJvdXRlQ2FsbGJhY2suYmluZChoYW5kbGVyKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgIHRoaXMuYXBwLnBvc3Qocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwdXQnOlxuICAgICAgICB0aGlzLmFwcC5wdXQocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICB0aGlzLmFwcC5kZWxldGUocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5yb3V0ZXNbYCR7bWV0aG9kfToke2hhbmRsZXIudXJsfWBdID0gaGFuZGxlcjtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnLVtyb3V0ZV0nLCBfLnRvVXBwZXIobWV0aG9kKSwgcm91dGVVUkwpO1xuICB9XG59XG4iXX0=