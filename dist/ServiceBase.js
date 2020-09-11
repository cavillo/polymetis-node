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
            rpc: config_1.rpcConf,
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
        // API APP
        this.apiApp = api_1.express();
        this.apiApp.use(api_1.logApiRoute.bind(this, this.resources));
        this.apiApp.use(api_1.express.json());
        this.apiApp.use(api_1.express.urlencoded({ extended: true }));
        this.apiApp.use(cors_1.default());
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
    initRPCProcedures() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loaders_1.loadRPCs(this);
            if (_.isEmpty(this.rpcs)) {
                this.resources.logger.warn('- No RPC\'s loaded...');
            }
        });
    }
    initAPIRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            yield loaders_1.loadRoutes(this);
            if (_.isEmpty(this.routes)) {
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
            const rpcId = handler.procedure;
            if (_.has(this.rpcs, rpcId)) {
                throw new Error(`Duplicated RPC route listener: ${rpcId}`);
            }
            const rpcBaseRoute = _.isEmpty(this.resources.configuration.rpc.baseRoute) ? '' : this.resources.configuration.rpc.baseRoute;
            const routeURL = `${rpcBaseRoute}/${handler.procedure}`;
            this.rpcApp.post(routeURL, handler.routeCallback.bind(handler));
            this.rpcs[rpcId] = handler;
            this.resources.logger.info('-[rpc]', routeURL);
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
            this.resources.logger.info('-[route]', _.toUpper(handler.method), routeURL);
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFFNUIsZ0RBQXdCO0FBRXhCLHNEQUE4QjtBQUM5QiwyQ0FBd0M7QUFDeEMscUNBSXFCO0FBQ3JCLDZDQUt5QjtBQU96QiwyQ0FNd0I7QUFheEIsTUFBcUIsV0FBVztJQVk5QixZQUFZLElBQXFCO1FBQy9CLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzRCxJQUFJLGFBQWEsR0FBa0I7WUFDakMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLG9CQUFXO1lBQ3BCLE1BQU0sRUFBRSxtQkFBVTtZQUNsQixHQUFHLEVBQUUsZ0JBQU87WUFDWixHQUFHLEVBQUUsZ0JBQU87U0FDYixDQUFDO1FBRUYsSUFBSSxJQUFJLEVBQUU7WUFDUixhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FDckIsYUFBYSxFQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FDcEMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRWhFLE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixhQUFhO1lBQ2IsTUFBTTtZQUNOLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDO1FBRUYsVUFBVTtRQUNWLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQUksRUFBRSxDQUFDLENBQUM7UUFFeEIsVUFBVTtRQUNWLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBTyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUJBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQUksRUFBRSxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVLLElBQUk7O1lBQ1Isb0JBQW9CO1lBQ3BCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRUssU0FBUzs7WUFDYixNQUFNLG1CQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7YUFDcEQ7WUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFSyxVQUFVOztZQUNkLE1BQU0sb0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMxQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQzthQUNyRDtZQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ25ELENBQUM7S0FBQTtJQUVLLGlCQUFpQjs7WUFDckIsTUFBTSxrQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQ3JEO1FBQ0gsQ0FBQztLQUFBO0lBRUssYUFBYTs7WUFDakIsTUFBTSxvQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQ3JEO1FBQ0gsQ0FBQztLQUFBO0lBRUssUUFBUTs7WUFDWixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNGLENBQUM7S0FBQTtJQUVLLFNBQVM7O1lBQ2IsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1RixDQUFDO0tBQUE7SUFFSyxPQUFPOztZQUNYLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzNCLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLENBQUM7S0FBQTtJQUVLLFFBQVE7O1lBQ1osTUFBTSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUMvQixNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QixDQUFDO0tBQUE7SUFFSyxTQUFTLENBQUMsT0FBeUI7O1lBQ3ZDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDaEU7WUFFRCxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDdkMsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLE9BQXdCOztZQUNyQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2FBQy9EO1lBRUQsTUFBTSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3RDLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxPQUF1Qjs7WUFDbkMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNoQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUM1RDtZQUVELE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUM7WUFDN0gsTUFBTSxRQUFRLEdBQUcsR0FBRyxZQUFZLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBRXhELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRWhFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLE9BQXlCOztZQUN2QyxNQUFNLE9BQU8sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25ELElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2FBQzlEO1lBRUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUM3SCxNQUFNLFFBQVEsR0FBRyxHQUFHLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFakQsUUFBUSxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUN0QixLQUFLLEtBQUs7b0JBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQy9ELE1BQU07Z0JBQ1IsS0FBSyxNQUFNO29CQUNULElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO29CQUNoRSxNQUFNO2dCQUNSLEtBQUssS0FBSztvQkFDUixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDL0QsTUFBTTtnQkFDUixLQUFLLFFBQVE7b0JBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ2xFLE1BQU07YUFDVDtZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUUsQ0FBQztLQUFBO0NBQ0Y7QUEvS0QsOEJBK0tDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IFJhYmJpdCBmcm9tICcuL3JhYmJpdCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuL3V0aWxzL2xvZ2dlcic7XG5pbXBvcnQge1xuICBleHByZXNzLFxuICBFeHByZXNzLFxuICBsb2dBcGlSb3V0ZSxcbn0gZnJvbSAnLi91dGlscy9hcGknO1xuaW1wb3J0IHtcbiAgbG9hZEV2ZW50cyxcbiAgbG9hZFRhc2tzLFxuICBsb2FkUlBDcyxcbiAgbG9hZFJvdXRlcyxcbn0gZnJvbSAnLi91dGlscy9sb2FkZXJzJztcbmltcG9ydCB7XG4gIEV2ZW50SGFuZGxlckJhc2UsXG4gIFRhc2tIYW5kbGVyQmFzZSxcbiAgUlBDSGFuZGxlckJhc2UsXG4gIFJvdXRlSGFuZGxlckJhc2UsXG59IGZyb20gJy4vaGFuZGxlcnMnO1xuaW1wb3J0IHtcbiAgc2VydmljZUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIGFwaUNvbmYsXG4gIHJwY0NvbmYsXG4gIENvbmZpZ3VyYXRpb24sXG59IGZyb20gJy4vdXRpbHMvY29uZmlnJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUmVzb3VyY2VzIHtcbiAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXQ7XG4gIGxvZ2dlcjogTG9nZ2VyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VPcHRpb25zIHtcbiAgY29uZmlndXJhdGlvbj86IENvbmZpZ3VyYXRpb247XG4gIGxvZ2dlckNhbGxiYWNrPzogRnVuY3Rpb24gfCBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlQmFzZSB7XG4gIHB1YmxpYyBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBhcGlBcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyBycGNBcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogYW55O1xuICBwcm90ZWN0ZWQgdGFza3M6IGFueTtcbiAgcHJvdGVjdGVkIHJvdXRlczogYW55O1xuICBwcm90ZWN0ZWQgcnBjczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM/OiBTZXJ2aWNlT3B0aW9ucykge1xuICAgIGNvbnN0IGNvbmYgPSBfLmdldChvcHRzLCAnY29uZmlndXJhdGlvbicsIG51bGwpO1xuICAgIGNvbnN0IGxvZ2dlckNhbGxiYWNrID0gXy5nZXQob3B0cywgJ2xvZ2dlckNhbGxiYWNrJywgbnVsbCk7XG5cbiAgICBsZXQgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGJhc2VEaXI6IF9fZGlybmFtZSxcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2VDb25mLFxuICAgICAgcmFiYml0OiByYWJiaXRDb25mLFxuICAgICAgYXBpOiBhcGlDb25mLFxuICAgICAgcnBjOiBycGNDb25mLFxuICAgIH07XG5cbiAgICBpZiAoY29uZikge1xuICAgICAgY29uZmlndXJhdGlvbiA9IF8ubWVyZ2UoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIF8ucGljayhjb25mLCBfLmtleXMoY29uZmlndXJhdGlvbikpLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlLCBsb2dnZXJDYWxsYmFjayk7XG5cbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24sIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnJlc291cmNlcyA9IHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICByYWJiaXQsXG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgIH07XG5cbiAgICAvLyBBUEkgQVBQXG4gICAgdGhpcy5hcGlBcHAgPSBleHByZXNzKCk7XG4gICAgdGhpcy5hcGlBcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcbiAgICB0aGlzLmFwaUFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xuICAgIHRoaXMuYXBpQXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XG4gICAgdGhpcy5hcGlBcHAudXNlKGNvcnMoKSk7XG5cbiAgICAvLyBSUEMgQVBQXG4gICAgdGhpcy5ycGNBcHAgPSBleHByZXNzKCk7XG4gICAgdGhpcy5ycGNBcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcbiAgICB0aGlzLnJwY0FwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xuICAgIHRoaXMucnBjQXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSB9KSk7XG4gICAgdGhpcy5ycGNBcHAudXNlKGNvcnMoKSk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIHRoaXMucnBjcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIHJhYmJpdFxuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnJhYmJpdC5pbml0KCk7XG4gIH1cblxuICBhc3luYyBpbml0VGFza3MoKSB7XG4gICAgYXdhaXQgbG9hZFRhc2tzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy50YXNrcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHRhc2tzIGxvYWRlZC4uLicpO1xuICAgIH1cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnVGFza3MgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRFdmVudHMoKSB7XG4gICAgYXdhaXQgbG9hZEV2ZW50cyh0aGlzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMuZXZlbnRzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gZXZlbnRzIGxvYWRlZC4uLicpO1xuICAgIH1cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnRXZlbnRzIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBhc3luYyBpbml0UlBDUHJvY2VkdXJlcygpIHtcbiAgICBhd2FpdCBsb2FkUlBDcyh0aGlzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMucnBjcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIFJQQ1xcJ3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5pdEFQSVJvdXRlcygpIHtcbiAgICBhd2FpdCBsb2FkUm91dGVzKHRoaXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5yb3V0ZXMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyByb3V0ZXMgbG9hZGVkLi4uJyk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgc3RhcnRBUEkoKSB7XG4gICAgYXdhaXQgdGhpcy5hcGlBcHAubGlzdGVuKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdBUEkgc3RhcnRlZCBvbiBwb3J0JywgdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCk7XG4gIH1cblxuICBhc3luYyBzdGFydFJQQ3MoKSB7XG4gICAgYXdhaXQgdGhpcy5ycGNBcHAubGlzdGVuKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24ucnBjLnBvcnQpO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUENzIHN0YXJ0ZWQgb24gcG9ydCcsIHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24ucnBjLnBvcnQpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEFQSSgpIHtcbiAgICBhd2FpdCB0aGlzLmluaXRBUElSb3V0ZXMoKTtcbiAgICBhd2FpdCB0aGlzLnN0YXJ0QVBJKCk7XG4gIH1cblxuICBhc3luYyBpbml0UlBDcygpIHtcbiAgICBhd2FpdCB0aGlzLmluaXRSUENQcm9jZWR1cmVzKCk7XG4gICAgYXdhaXQgdGhpcy5zdGFydFJQQ3MoKTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRFdmVudChoYW5kbGVyOiBFdmVudEhhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKF8uaGFzKHRoaXMuZXZlbnRzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIGV2ZW50IGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgdGhpcy5ldmVudHNbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICB9XG5cbiAgYXN5bmMgbG9hZFRhc2soaGFuZGxlcjogVGFza0hhbmRsZXJCYXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKF8uaGFzKHRoaXMudGFza3MsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgdGFzayBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgIH1cblxuICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgIHRoaXMudGFza3NbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICB9XG5cbiAgYXN5bmMgbG9hZFJQQyhoYW5kbGVyOiBSUENIYW5kbGVyQmFzZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJwY0lkID0gaGFuZGxlci5wcm9jZWR1cmU7XG4gICAgaWYgKF8uaGFzKHRoaXMucnBjcywgcnBjSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgUlBDIHJvdXRlIGxpc3RlbmVyOiAke3JwY0lkfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJwY0Jhc2VSb3V0ZSA9IF8uaXNFbXB0eSh0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnJwYy5iYXNlUm91dGUpID8gJycgOiB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLnJwYy5iYXNlUm91dGU7XG4gICAgY29uc3Qgcm91dGVVUkwgPSBgJHtycGNCYXNlUm91dGV9LyR7aGFuZGxlci5wcm9jZWR1cmV9YDtcblxuICAgIHRoaXMucnBjQXBwLnBvc3Qocm91dGVVUkwsIGhhbmRsZXIucm91dGVDYWxsYmFjay5iaW5kKGhhbmRsZXIpKTtcblxuICAgIHRoaXMucnBjc1tycGNJZF0gPSBoYW5kbGVyO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCctW3JwY10nLCByb3V0ZVVSTCk7XG4gIH1cblxuICBhc3luYyBsb2FkUm91dGUoaGFuZGxlcjogUm91dGVIYW5kbGVyQmFzZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJvdXRlSWQgPSBgJHtoYW5kbGVyLm1ldGhvZH06JHtoYW5kbGVyLnVybH1gO1xuICAgIGlmIChfLmhhcyh0aGlzLnJvdXRlcywgcm91dGVJZCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBBUEkgcm91dGUgbGlzdGVuZXI6ICR7cm91dGVJZH1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcGlCYXNlUm91dGUgPSBfLmlzRW1wdHkodGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkuYmFzZVJvdXRlKSA/ICcnIDogdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkuYmFzZVJvdXRlO1xuICAgIGNvbnN0IHJvdXRlVVJMID0gYCR7YXBpQmFzZVJvdXRlfSR7aGFuZGxlci51cmx9YDtcblxuICAgIHN3aXRjaCAoaGFuZGxlci5tZXRob2QpIHtcbiAgICAgIGNhc2UgJ2dldCc6XG4gICAgICAgIHRoaXMuYXBpQXBwLmdldChyb3V0ZVVSTCwgaGFuZGxlci5yb3V0ZUNhbGxiYWNrLmJpbmQoaGFuZGxlcikpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Bvc3QnOlxuICAgICAgICB0aGlzLmFwaUFwcC5wb3N0KHJvdXRlVVJMLCBoYW5kbGVyLnJvdXRlQ2FsbGJhY2suYmluZChoYW5kbGVyKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncHV0JzpcbiAgICAgICAgdGhpcy5hcGlBcHAucHV0KHJvdXRlVVJMLCBoYW5kbGVyLnJvdXRlQ2FsbGJhY2suYmluZChoYW5kbGVyKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgdGhpcy5hcGlBcHAuZGVsZXRlKHJvdXRlVVJMLCBoYW5kbGVyLnJvdXRlQ2FsbGJhY2suYmluZChoYW5kbGVyKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMucm91dGVzW3JvdXRlSWRdID0gaGFuZGxlcjtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnLVtyb3V0ZV0nLCBfLnRvVXBwZXIoaGFuZGxlci5tZXRob2QpLCByb3V0ZVVSTCk7XG4gIH1cbn1cbiJdfQ==