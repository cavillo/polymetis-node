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
            this.resources.logger.info('Loading TASKS');
            yield base_1.loadTasks(this);
            if (_.isEmpty(this.tasks)) {
                this.resources.logger.warn('- No tasks loaded...');
            }
            this.resources.logger.info('Tasks initialized');
        });
    }
    initEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('Loading EVENTS');
            yield base_1.loadEvents(this);
            if (_.isEmpty(this.events)) {
                this.resources.logger.warn('- No events loaded...');
            }
            this.resources.logger.info('Events initialized');
        });
    }
    initRPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('Loading RPC\'s');
            yield base_1.loadRPC(this);
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
            this.resources.logger.info('Loading API routes');
            yield API_1.loadRoutes(this);
            if (_.isEmpty(this.routes)) {
                this.resources.logger.warn('- No routes loaded...');
            }
        });
    }
    initAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.app.listen(this.resources.configuration.api.port);
            this.resources.logger.info('API initialized on port', this.resources.configuration.api.port);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsNERBQW9DO0FBQ3BDLHFDQU1xQjtBQUNyQixpQ0FRZ0I7QUFDaEIscURBSzZCO0FBYTdCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFxQjtRQUMvQixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxhQUFhLEdBQWtCO1lBQ2pDLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSx5QkFBVztZQUNwQixNQUFNLEVBQUUsd0JBQVU7WUFDbEIsR0FBRyxFQUFFLHFCQUFPO1NBQ2IsQ0FBQztRQUVGLElBQUksSUFBSSxFQUFFO1lBQ1IsYUFBYSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQ3JCLGFBQWEsRUFDYixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ3BDLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFaEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNmLGFBQWE7WUFDYixNQUFNO1lBQ04sTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3BCLENBQUM7UUFFRixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQU8sRUFBRSxDQUFDO1FBRXJCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFSyxJQUFJOztZQUNSLG9CQUFvQjtZQUNwQixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JDLENBQUM7S0FBQTtJQUVLLFNBQVM7O1lBQ2IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sZ0JBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQzthQUNwRDtZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FBQTtJQUVLLFVBQVU7O1lBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDN0MsTUFBTSxpQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQ3JEO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbkQsQ0FBQztLQUFBO0lBRUssUUFBUTs7WUFDWixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM3QyxNQUFNLGNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQzthQUNyRDtZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ25ELENBQUM7S0FBQTtJQUVLLGFBQWE7O1lBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRXJCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sZ0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQzthQUNyRDtRQUNILENBQUM7S0FBQTtJQUVLLE9BQU87O1lBQ1gsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRixDQUFDO0tBQUE7SUFFSyxTQUFTLENBQUMsT0FBeUI7O1lBQ3ZDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDaEU7WUFFRCxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDdkMsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLE9BQXdCOztZQUNyQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQy9EO1lBRUQsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3RDLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxPQUF1Qjs7WUFDbkMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUMvRDtZQUVELE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFSyxTQUFTLENBQUMsT0FBeUIsRUFBRSxNQUF3Qjs7WUFDakUsTUFBTSxPQUFPLEdBQUcsR0FBRyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQzlEO1lBRUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUM3SCxNQUFNLFFBQVEsR0FBRyxHQUFHLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFakQsUUFBUSxNQUFNLEVBQUU7Z0JBQ2QsS0FBSyxLQUFLO29CQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxNQUFNO2dCQUNSLEtBQUssTUFBTTtvQkFDVCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDN0QsTUFBTTtnQkFDUixLQUFLLEtBQUs7b0JBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQzVELE1BQU07Z0JBQ1IsS0FBSyxRQUFRO29CQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUMvRCxNQUFNO2FBQ1Q7WUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEUsQ0FBQztLQUFBO0NBQ0Y7QUF0SkQsOEJBc0pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IFJhYmJpdCBmcm9tICcuL3JhYmJpdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vdXRpbHMvTG9nZ2VyJztcbmltcG9ydCB7XG4gIGV4cHJlc3MsXG4gIEV4cHJlc3MsXG4gIGxvYWRSb3V0ZXMsXG4gIGxvZ0FwaVJvdXRlLFxuICBUcnVzdGVkRW5kcG9pbnRzLFxufSBmcm9tICcuL3V0aWxzL0FQSSc7XG5pbXBvcnQge1xuICBsb2FkRXZlbnRzLFxuICBsb2FkVGFza3MsXG4gIGxvYWRSUEMsXG4gIEV2ZW50SGFuZGxlckJhc2UsXG4gIFRhc2tIYW5kbGVyQmFzZSxcbiAgUlBDSGFuZGxlckJhc2UsXG4gIFJvdXRlSGFuZGxlckJhc2UsXG59IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge1xuICBzZXJ2aWNlQ29uZixcbiAgcmFiYml0Q29uZixcbiAgYXBpQ29uZixcbiAgQ29uZmlndXJhdGlvbixcbn0gZnJvbSAnLi91dGlscy9TZXJ2aWNlQ29uZic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZVJlc291cmNlcyB7XG4gIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0O1xuICBsb2dnZXI6IExvZ2dlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlT3B0aW9ucyB7XG4gIGNvbmZpZ3VyYXRpb24/OiBDb25maWd1cmF0aW9uO1xuICBsb2dnZXJDYWxsYmFjaz86IEZ1bmN0aW9uIHwgbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUJhc2Uge1xuICBwdWJsaWMgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwdWJsaWMgYXBwOiBFeHByZXNzO1xuICBwdWJsaWMgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzO1xuXG4gIHByb3RlY3RlZCBldmVudHM6IGFueTtcbiAgcHJvdGVjdGVkIHRhc2tzOiBhbnk7XG4gIHByb3RlY3RlZCByb3V0ZXM6IGFueTtcbiAgcHJvdGVjdGVkIHJwY3M6IGFueTtcblxuICBjb25zdHJ1Y3RvcihvcHRzPzogU2VydmljZU9wdGlvbnMpIHtcbiAgICBjb25zdCBjb25mID0gXy5nZXQob3B0cywgJ2NvbmZpZ3VyYXRpb24nLCBudWxsKTtcbiAgICBjb25zdCBsb2dnZXJDYWxsYmFjayA9IF8uZ2V0KG9wdHMsICdsb2dnZXJDYWxsYmFjaycsIG51bGwpO1xuXG4gICAgbGV0IGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICBiYXNlRGlyOiBfX2Rpcm5hbWUsXG4gICAgICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgICAgIHJhYmJpdDogcmFiYml0Q29uZixcbiAgICAgIGFwaTogYXBpQ29uZixcbiAgICB9O1xuXG4gICAgaWYgKGNvbmYpIHtcbiAgICAgIGNvbmZpZ3VyYXRpb24gPSBfLm1lcmdlKFxuICAgICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgICBfLnBpY2soY29uZiwgXy5rZXlzKGNvbmZpZ3VyYXRpb24pKSxcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb247XG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGNvbmZpZ3VyYXRpb24uc2VydmljZSwgbG9nZ2VyQ2FsbGJhY2spO1xuXG4gICAgY29uc3QgcmFiYml0ID0gbmV3IFJhYmJpdChjb25maWd1cmF0aW9uLCB0aGlzLmxvZ2dlcik7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB7XG4gICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgcmFiYml0LFxuICAgICAgbG9nZ2VyOiB0aGlzLmxvZ2dlcixcbiAgICB9O1xuXG4gICAgdGhpcy5hcHAgPSBleHByZXNzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIHRoaXMucnBjcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIHJhYmJpdFxuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnJhYmJpdC5pbml0KCk7XG4gIH1cblxuICBhc3luYyBpbml0VGFza3MoKSB7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgVEFTS1MnKTtcbiAgICBhd2FpdCBsb2FkVGFza3ModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnRhc2tzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gdGFza3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdUYXNrcyBpbml0aWFsaXplZCcpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEV2ZW50cygpIHtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnTG9hZGluZyBFVkVOVFMnKTtcbiAgICBhd2FpdCBsb2FkRXZlbnRzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ldmVudHMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyBldmVudHMgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdFdmVudHMgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRSUENzKCkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdMb2FkaW5nIFJQQ1xcJ3MnKTtcbiAgICBhd2FpdCBsb2FkUlBDKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ycGNzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gUlBDXFwncyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ1JQQ1xcJ3MgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRBUElSb3V0ZXMoKSB7XG4gICAgdGhpcy5hcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuICAgIHRoaXMuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xuICAgIHRoaXMuYXBwLnVzZShjb3JzKCkpO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgQVBJIHJvdXRlcycpO1xuICAgIGF3YWl0IGxvYWRSb3V0ZXModGhpcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJvdXRlcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHJvdXRlcyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0QVBJKCkge1xuICAgIGF3YWl0IHRoaXMuYXBwLmxpc3Rlbih0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnQVBJIGluaXRpYWxpemVkIG9uIHBvcnQnLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRFdmVudChoYW5kbGVyOiBFdmVudEhhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKF8uaGFzKHRoaXMuZXZlbnRzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIGV2ZW50IGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgdGhpcy5ldmVudHNbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICB9XG5cbiAgYXN5bmMgbG9hZFRhc2soaGFuZGxlcjogVGFza0hhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKF8uaGFzKHRoaXMudGFza3MsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgdGFzayBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgIH1cblxuICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgIHRoaXMudGFza3NbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICB9XG5cbiAgYXN5bmMgbG9hZFJQQyhoYW5kbGVyOiBSUENIYW5kbGVyQmFzZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChfLmhhcyh0aGlzLnJwY3MsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgcnBjcyBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgIH1cblxuICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgIHRoaXMucnBjc1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gIH1cblxuICBhc3luYyBsb2FkUm91dGUoaGFuZGxlcjogUm91dGVIYW5kbGVyQmFzZSwgbWV0aG9kOiBUcnVzdGVkRW5kcG9pbnRzKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgcm91dGVJZCA9IGAke21ldGhvZH06JHtoYW5kbGVyLnVybH1gO1xuICAgIGlmIChfLmhhcyh0aGlzLnJvdXRlcywgcm91dGVJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBBUEkgcm91dGUgbGlzdGVuZXI6ICR7cm91dGVJZH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcGlCYXNlUm91dGUgPSBfLmlzRW1wdHkodGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkuYmFzZVJvdXRlKSA/ICcnIDogdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkuYmFzZVJvdXRlO1xuICAgIGNvbnN0IHJvdXRlVVJMID0gYCR7YXBpQmFzZVJvdXRlfSR7aGFuZGxlci51cmx9YDtcblxuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlICdnZXQnOlxuICAgICAgICB0aGlzLmFwcC5nZXQocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdwb3N0JzpcbiAgICAgICAgdGhpcy5hcHAucG9zdChyb3V0ZVVSTCwgaGFuZGxlci5yb3V0ZUNhbGxiYWNrLmJpbmQoaGFuZGxlcikpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3B1dCc6XG4gICAgICAgIHRoaXMuYXBwLnB1dChyb3V0ZVVSTCwgaGFuZGxlci5yb3V0ZUNhbGxiYWNrLmJpbmQoaGFuZGxlcikpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgIHRoaXMuYXBwLmRlbGV0ZShyb3V0ZVVSTCwgaGFuZGxlci5yb3V0ZUNhbGxiYWNrLmJpbmQoaGFuZGxlcikpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLnJvdXRlc1tgJHttZXRob2R9OiR7aGFuZGxlci51cmx9YF0gPSBoYW5kbGVyO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCctW3JvdXRlXScsIF8udG9VcHBlcihtZXRob2QpLCByb3V0ZVVSTCk7XG4gIH1cbn1cbiJdfQ==