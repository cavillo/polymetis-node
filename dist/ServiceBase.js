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
const logger_1 = require("./utils/logger");
const api_1 = require("./utils/api");
const loaders_1 = require("./utils/loaders");
const config_1 = require("./utils/config");
class ServiceBase {
    constructor(opts) {
        const conf = _.get(opts, 'configuration', null);
        const loggerCallback = _.get(opts, 'loggerCallback', null);
        let configuration = {
            baseDir: __dirname,
            service: config_1.serviceConf,
            rabbit: config_1.rabbitConf,
            api: config_1.apiConf,
        };
        if (conf) {
            configuration = _.merge(configuration, _.pick(conf, _.keys(configuration)));
        }
        this.configuration = configuration;
        this.logger = new logger_1.Logger(configuration.service, loggerCallback);
        const rabbit = new rabbit_1.default(configuration, this.logger);
        this.resources = {
            configuration,
            rabbit,
            logger: this.logger,
        };
        this.app = api_1.express();
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
            if (_.isEmpty(this.tasks)) {
                this.resources.logger.warn('- No tasks loaded...');
            }
            this.resources.logger.info('Tasks initialized');
        });
    }
    initEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loaders_1.loadEvents(this);
            if (_.isEmpty(this.events)) {
                this.resources.logger.warn('- No events loaded...');
            }
            this.resources.logger.info('Events initialized');
        });
    }
    initRPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loaders_1.loadRPCs(this);
            if (_.isEmpty(this.rpcs)) {
                this.resources.logger.warn('- No RPC\'s loaded...');
            }
            this.resources.logger.info('RPC\'s initialized');
        });
    }
    initAPIRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(api_1.logApiRoute.bind(this, this.resources));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors_1.default());
            yield loaders_1.loadRoutes(this);
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
    loadRoute(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const routeId = `${handler.method}:${handler.url}`;
            if (_.has(this.routes, routeId)) {
                throw new Error(`Duplicated API route listener: ${routeId}`);
            }
            const apiBaseRoute = _.isEmpty(this.resources.configuration.api.baseRoute) ? '' : this.resources.configuration.api.baseRoute;
            const routeURL = `${apiBaseRoute}${handler.url}`;
            switch (handler.method) {
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
            this.routes[`${handler.method}:${handler.url}`] = handler;
            this.resources.logger.info('-[route]', _.toUpper(handler.method), routeURL);
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsMkNBQXdDO0FBQ3hDLHFDQUlxQjtBQUNyQiw2Q0FLeUI7QUFPekIsMkNBS3dCO0FBYXhCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFxQjtRQUMvQixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxhQUFhLEdBQWtCO1lBQ2pDLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSxvQkFBVztZQUNwQixNQUFNLEVBQUUsbUJBQVU7WUFDbEIsR0FBRyxFQUFFLGdCQUFPO1NBQ2IsQ0FBQztRQUVGLElBQUksSUFBSSxFQUFFO1lBQ1IsYUFBYSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQ3JCLGFBQWEsRUFDYixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ3BDLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVoRSxNQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsU0FBUyxHQUFHO1lB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LENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDNUQsTUFBTTtnQkFDUixLQUFLLFFBQVE7b0JBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQy9ELE1BQU07YUFDVDtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUMxRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlFLENBQUM7S0FBQTtDQUNGO0FBdkpELDhCQXVKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XG5cbmltcG9ydCBSYWJiaXQgZnJvbSAnLi9yYWJiaXQnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi91dGlscy9sb2dnZXInO1xuaW1wb3J0IHtcbiAgZXhwcmVzcyxcbiAgRXhwcmVzcyxcbiAgbG9nQXBpUm91dGUsXG59IGZyb20gJy4vdXRpbHMvYXBpJztcbmltcG9ydCB7XG4gIGxvYWRFdmVudHMsXG4gIGxvYWRUYXNrcyxcbiAgbG9hZFJQQ3MsXG4gIGxvYWRSb3V0ZXMsXG59IGZyb20gJy4vdXRpbHMvbG9hZGVycyc7XG5pbXBvcnQge1xuICBFdmVudEhhbmRsZXJCYXNlLFxuICBUYXNrSGFuZGxlckJhc2UsXG4gIFJQQ0hhbmRsZXJCYXNlLFxuICBSb3V0ZUhhbmRsZXJCYXNlLFxufSBmcm9tICcuL2hhbmRsZXJzJztcbmltcG9ydCB7XG4gIHNlcnZpY2VDb25mLFxuICByYWJiaXRDb25mLFxuICBhcGlDb25mLFxuICBDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL2NvbmZpZyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZVJlc291cmNlcyB7XG4gIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0O1xuICBsb2dnZXI6IExvZ2dlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlT3B0aW9ucyB7XG4gIGNvbmZpZ3VyYXRpb24/OiBDb25maWd1cmF0aW9uO1xuICBsb2dnZXJDYWxsYmFjaz86IEZ1bmN0aW9uIHwgbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUJhc2Uge1xuICBwdWJsaWMgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwdWJsaWMgYXBwOiBFeHByZXNzO1xuICBwdWJsaWMgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzO1xuXG4gIHByb3RlY3RlZCBldmVudHM6IGFueTtcbiAgcHJvdGVjdGVkIHRhc2tzOiBhbnk7XG4gIHByb3RlY3RlZCByb3V0ZXM6IGFueTtcbiAgcHJvdGVjdGVkIHJwY3M6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvcHRzPzogU2VydmljZU9wdGlvbnMpIHtcbiAgICBjb25zdCBjb25mID0gXy5nZXQob3B0cywgJ2NvbmZpZ3VyYXRpb24nLCBudWxsKTtcbiAgICBjb25zdCBsb2dnZXJDYWxsYmFjayA9IF8uZ2V0KG9wdHMsICdsb2dnZXJDYWxsYmFjaycsIG51bGwpO1xuXG4gICAgbGV0IGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICBiYXNlRGlyOiBfX2Rpcm5hbWUsXG4gICAgICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgICAgIHJhYmJpdDogcmFiYml0Q29uZixcbiAgICAgIGFwaTogYXBpQ29uZixcbiAgICB9O1xuXG4gICAgaWYgKGNvbmYpIHtcbiAgICAgIGNvbmZpZ3VyYXRpb24gPSBfLm1lcmdlKFxuICAgICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgICBfLnBpY2soY29uZiwgXy5rZXlzKGNvbmZpZ3VyYXRpb24pKSxcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb247XG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGNvbmZpZ3VyYXRpb24uc2VydmljZSwgbG9nZ2VyQ2FsbGJhY2spO1xuXG4gICAgY29uc3QgcmFiYml0ID0gbmV3IFJhYmJpdChjb25maWd1cmF0aW9uLCB0aGlzLmxvZ2dlcik7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB7XG4gICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgcmFiYml0LFxuICAgICAgbG9nZ2VyOiB0aGlzLmxvZ2dlcixcbiAgICB9O1xuXG4gICAgdGhpcy5hcHAgPSBleHByZXNzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIHRoaXMucnBjcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIHJhYmJpdFxuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnJhYmJpdC5pbml0KCk7XG4gIH1cblxuICBhc3luYyBpbml0VGFza3MoKSB7XG4gICAgYXdhaXQgbG9hZFRhc2tzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy50YXNrcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHRhc2tzIGxvYWRlZC4uLicpO1xuICAgIH1cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnVGFza3MgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRFdmVudHMoKSB7XG4gICAgYXdhaXQgbG9hZEV2ZW50cyh0aGlzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMuZXZlbnRzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gZXZlbnRzIGxvYWRlZC4uLicpO1xuICAgIH1cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnRXZlbnRzIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBhc3luYyBpbml0UlBDcygpIHtcbiAgICBhd2FpdCBsb2FkUlBDcyh0aGlzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMucnBjcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIFJQQ1xcJ3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUENcXCdzIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBhc3luYyBpbml0QVBJUm91dGVzKCkge1xuICAgIHRoaXMuYXBwLnVzZShsb2dBcGlSb3V0ZS5iaW5kKHRoaXMsIHRoaXMucmVzb3VyY2VzKSk7XG4gICAgdGhpcy5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKTtcbiAgICB0aGlzLmFwcC51c2UoY29ycygpKTtcblxuICAgIGF3YWl0IGxvYWRSb3V0ZXModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJvdXRlcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHJvdXRlcyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdGFydEFQSSgpIHtcbiAgICBhd2FpdCB0aGlzLmFwcC5saXN0ZW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0FQSSBzdGFydGVkIG9uIHBvcnQnLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgfVxuXG4gIGFzeW5jIGluaXRBUEkoKSB7XG4gICAgYXdhaXQgdGhpcy5pbml0QVBJUm91dGVzKCk7XG4gICAgYXdhaXQgdGhpcy5zdGFydEFQSSgpO1xuICB9XG5cbiAgYXN5bmMgbG9hZEV2ZW50KGhhbmRsZXI6IEV2ZW50SGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoXy5oYXModGhpcy5ldmVudHMsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgZXZlbnQgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICB9XG5cbiAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICB0aGlzLmV2ZW50c1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gIH1cblxuICBhc3luYyBsb2FkVGFzayhoYW5kbGVyOiBUYXNrSGFuZGxlckJhc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoXy5oYXModGhpcy50YXNrcywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCB0YXNrIGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgdGhpcy50YXNrc1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gIH1cblxuICBhc3luYyBsb2FkUlBDKGhhbmRsZXI6IFJQQ0hhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKF8uaGFzKHRoaXMucnBjcywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBycGNzIGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgdGhpcy5ycGNzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgfVxuXG4gIGFzeW5jIGxvYWRSb3V0ZShoYW5kbGVyOiBSb3V0ZUhhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgcm91dGVJZCA9IGAke2hhbmRsZXIubWV0aG9kfToke2hhbmRsZXIudXJsfWA7XG4gICAgaWYgKF8uaGFzKHRoaXMucm91dGVzLCByb3V0ZUlkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIEFQSSByb3V0ZSBsaXN0ZW5lcjogJHtyb3V0ZUlkfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGFwaUJhc2VSb3V0ZSA9IF8uaXNFbXB0eSh0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5iYXNlUm91dGUpID8gJycgOiB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5iYXNlUm91dGU7XG4gICAgY29uc3Qgcm91dGVVUkwgPSBgJHthcGlCYXNlUm91dGV9JHtoYW5kbGVyLnVybH1gO1xuXG4gICAgc3dpdGNoIChoYW5kbGVyLm1ldGhvZCkge1xuICAgICAgY2FzZSAnZ2V0JzpcbiAgICAgICAgdGhpcy5hcHAuZ2V0KHJvdXRlVVJMLCBoYW5kbGVyLnJvdXRlQ2FsbGJhY2suYmluZChoYW5kbGVyKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncG9zdCc6XG4gICAgICAgIHRoaXMuYXBwLnBvc3Qocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwdXQnOlxuICAgICAgICB0aGlzLmFwcC5wdXQocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkZWxldGUnOlxuICAgICAgICB0aGlzLmFwcC5kZWxldGUocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5yb3V0ZXNbYCR7aGFuZGxlci5tZXRob2R9OiR7aGFuZGxlci51cmx9YF0gPSBoYW5kbGVyO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCctW3JvdXRlXScsIF8udG9VcHBlcihoYW5kbGVyLm1ldGhvZCksIHJvdXRlVVJMKTtcbiAgfVxufVxuIl19