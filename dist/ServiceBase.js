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
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const ServiceConf_1 = require("./utils/ServiceConf");
const Rabbit_1 = __importDefault(require("./rabbit/Rabbit"));
const Mongo_1 = __importDefault(require("./mongo/Mongo"));
const postgres_1 = __importDefault(require("./postgres"));
const Logger_1 = __importDefault(require("./utils/Logger"));
exports.Logger = Logger_1.default;
const redisService_1 = __importDefault(require("./redisService"));
class ServiceBase {
    constructor(conf) {
        this.logApiRoute = (req, res, next) => {
            this.resources.logger.log(req.method, req.originalUrl);
            const cleanup = () => {
                res.removeListener('finish', logFinish);
            };
            const logFinish = () => {
                cleanup();
                if (res.statusCode >= 500) {
                    this.resources.logger.error(req.method, req.originalUrl, res.statusCode);
                }
                else if (res.statusCode >= 400) {
                    this.resources.logger.error(req.method, req.originalUrl, res.statusCode);
                }
                else if (res.statusCode < 300 && res.statusCode >= 200) {
                    this.resources.logger.log(req.method, req.originalUrl, res.statusCode);
                }
                else {
                    this.resources.logger.log(req.method, req.originalUrl, res.statusCode);
                }
            };
            res.on('finish', logFinish);
            next();
        };
        let configuration = {
            baseDir: __dirname,
            service: ServiceConf_1.serviceConf,
            rabbit: ServiceConf_1.rabbitConf,
            mongo: ServiceConf_1.mongoConf,
            api: ServiceConf_1.apiConf,
            redis: ServiceConf_1.redisConf,
            postgres: ServiceConf_1.postgresConf,
        };
        if (conf) {
            configuration = _.merge(configuration, _.pick(conf, _.keys(configuration)));
        }
        this.configuration = configuration;
        this.logger = new Logger_1.default(configuration.service);
        const rabbit = new Rabbit_1.default(configuration.rabbit, this.logger);
        const mongo = new Mongo_1.default(configuration.mongo, this.logger);
        const redis = new redisService_1.default(configuration, this.logger);
        const pg = new postgres_1.default(configuration.postgres, this.logger);
        this.resources = {
            configuration,
            rabbit,
            mongo,
            redis,
            pg,
            logger: this.logger,
        };
        this.app = express_1.default();
        this.events = {};
        this.tasks = {};
        this.routes = {};
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize infrastructure services
            yield this.resources.rabbit.init();
            yield this.resources.mongo.init();
            yield this.resources.redis.init();
            yield this.resources.pg.init();
            // Events & Tasks
            yield this.loadEvents();
            yield this.loadTasks();
            // API
            this.app.use(this.logApiRoute.bind(this));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors_1.default());
            yield this.loadRoutes();
            yield this.app.listen(this.resources.configuration.api.port, () => this.resources.logger.log('API listening on port:', this.resources.configuration.api.port));
            this.resources.logger.ok('Service initialized...');
        });
    }
    loadEvents(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            let eventsDir;
            if (dir) {
                eventsDir = dir;
            }
            else {
                eventsDir = path.join(this.resources.configuration.baseDir, './events/');
            }
            let handlers;
            try {
                handlers = fs.readdirSync(eventsDir);
            }
            catch (error) {
                return;
            }
            for (const handlerName of handlers) {
                const handlerPath = path.join(eventsDir, handlerName);
                if (_.endsWith(handlerName, '.event.ts')) {
                    try {
                        const handlerSpec = require(handlerPath).default;
                        const handler = new handlerSpec(this.resources);
                        if (_.has(this.events, handler.topic)) {
                            throw new Error(`Duplicated event listener: ${handler.topic}`);
                        }
                        yield handler.init();
                        this.events[handler.topic] = handler;
                    }
                    catch (error) {
                        this.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
                    }
                }
                else {
                    try {
                        // recurse down the directory tree
                        yield this.loadEvents(path.join(handlerPath, '/'));
                    }
                    catch (error) {
                        // this.resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
                        continue;
                    }
                }
            }
        });
    }
    loadTasks(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            let tasksDir;
            if (dir) {
                tasksDir = dir;
            }
            else {
                tasksDir = path.join(this.resources.configuration.baseDir, './tasks/');
            }
            let handlers;
            try {
                handlers = fs.readdirSync(tasksDir);
            }
            catch (error) {
                return;
            }
            for (const handlerName of handlers) {
                const handlerPath = path.join(tasksDir, handlerName);
                if (_.endsWith(handlerName, '.task.ts')) {
                    try {
                        const handlerSpec = require(handlerPath).default;
                        const handler = new handlerSpec(this.resources);
                        if (_.has(this.tasks, handler.topic)) {
                            throw new Error(`Duplicated task listener: ${handler.topic}`);
                        }
                        yield handler.init();
                        this.tasks[handler.topic] = handler;
                    }
                    catch (error) {
                        this.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
                    }
                }
                else {
                    try {
                        // recurse down the directory tree
                        yield this.loadTasks(path.join(handlerPath, '/'));
                    }
                    catch (error) {
                        // this.resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
                    }
                }
            }
        });
    }
    loadRoutes(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const trustedEndpoints = ['get', 'delete', 'put', 'post'];
            let routesDir;
            if (dir) {
                routesDir = dir;
            }
            else {
                routesDir = path.join(this.resources.configuration.baseDir, './api/');
            }
            let handlers;
            try {
                handlers = fs.readdirSync(routesDir);
            }
            catch (error) {
                return;
            }
            for (const handlerName of handlers) {
                const handlerPath = path.join(routesDir, handlerName);
                const method = _.toLower(handlerName.split('.')[0]);
                if (_.endsWith(handlerName, '.route.ts')) {
                    // skip non route ts files
                    // all routes should end in route.ts
                    // all routes should start with the HTTP method to implement followed by a dot
                    // in trustedEndpoints list
                    // eg: post.route.ts
                    // eg: get.allByBusiness.route.ts
                    if (!_.includes(trustedEndpoints, method)) {
                        continue;
                    }
                    try {
                        const routeClass = require(handlerPath).default;
                        const routeInstance = new routeClass(this.resources);
                        const apiPrefix = '/api';
                        const routeURL = `${apiPrefix}${routeInstance.url}`;
                        switch (method) {
                            case 'get':
                                this.app.get(routeURL, routeInstance.routeCallback.bind(routeInstance));
                                break;
                            case 'post':
                                this.app.post(routeURL, routeInstance.routeCallback.bind(routeInstance));
                                break;
                            case 'put':
                                this.app.put(routeURL, routeInstance.routeCallback.bind(routeInstance));
                                break;
                            case 'delete':
                                this.app.delete(routeURL, routeInstance.routeCallback.bind(routeInstance));
                                break;
                        }
                        this.resources.logger.log('  Loaded route: ', method, routeInstance.url);
                    }
                    catch (error) {
                        this.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
                    }
                }
                else {
                    try {
                        // recurse down the directory tree
                        yield this.loadRoutes(path.join(handlerPath, '/'));
                    }
                    catch (error) {
                        // this.resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
                    }
                }
            }
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsc0RBQTRFO0FBQzVFLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFDekIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixxREFjNkI7QUFFN0IsNkRBQXFDO0FBQ3JDLDBEQUFrQztBQUNsQywwREFBa0M7QUFDbEMsNERBQW9DO0FBZ1JsQyxpQkFoUkssZ0JBQU0sQ0FnUkw7QUE5UVIsa0VBQW1DO0FBV25DLE1BQXFCLFdBQVc7SUFVOUIsWUFBWSxJQUFvQjtRQXlOeEIsZ0JBQVcsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV2RCxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7Z0JBQ25CLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQztZQUVGLE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtnQkFDckIsT0FBTyxFQUFFLENBQUM7Z0JBRVYsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRTtvQkFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQzFFO3FCQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFH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LElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dDQUMzRSxNQUFNO3lCQUNUO3dCQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMxRTtvQkFBQyxPQUFPLEtBQUssRUFBRTt3QkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLFdBQVcsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3FCQUNqRjtpQkFDRjtxQkFBTTtvQkFDTCxJQUFJO3dCQUNGLGtDQUFrQzt3QkFDbEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ3BEO29CQUFDLE9BQU8sS0FBSyxFQUFFO3dCQUNkLGlGQUFpRjtxQkFDbEY7aUJBQ0Y7YUFDRjtRQUNILENBQUM7S0FBQTtDQTJCRjtBQTVQRCw4QkE0UEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZXhwcmVzcywgeyBFeHByZXNzLCBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IHtcbiAgc2VydmljZUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIG1vbmdvQ29uZixcbiAgYXBpQ29uZixcbiAgcmVkaXNDb25mLFxuICBwb3N0Z3Jlc0NvbmYsXG4gIENvbmZpZ3VyYXRpb24sXG4gIFNlcnZpY2VDb25maWd1cmF0aW9uLFxuICBNb25nb0NvbmZpZ3VyYXRpb24sXG4gIFBvc3RncmVzQ29uZmlndXJhdGlvbixcbiAgUmFiYml0Q29uZmlndXJhdGlvbixcbiAgQXBpQ29uZmlndXJhdGlvbixcbiAgUmVkaXNDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuL2hhbmRsZXJzL0hhbmRsZXJCYXNlJztcbmltcG9ydCBSYWJiaXQgZnJvbSAnLi9yYWJiaXQvUmFiYml0JztcbmltcG9ydCBNb25nbyBmcm9tICcuL21vbmdvL01vbmdvJztcbmltcG9ydCBQb3N0Z3JlcyBmcm9tICcuL3Bvc3RncmVzJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi91dGlscy9Mb2dnZXInO1xuaW1wb3J0IEFwaVJvdXRlIGZyb20gJy4vYXBpL0FwaVJvdXRlJztcbmltcG9ydCBSZWRpcyBmcm9tICcuL3JlZGlzU2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZVJlc291cmNlcyB7XG4gIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0O1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgbW9uZ286IE1vbmdvO1xuICByZWRpczogUmVkaXM7XG4gIHBnOiBQb3N0Z3Jlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUJhc2Uge1xuICBwdWJsaWMgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwdWJsaWMgYXBwOiBFeHByZXNzO1xuICBwdWJsaWMgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzO1xuXG4gIHByb3RlY3RlZCBldmVudHM6IGFueTtcbiAgcHJvdGVjdGVkIHRhc2tzOiBhbnk7XG4gIHByb3RlY3RlZCByb3V0ZXM6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25mPzogQ29uZmlndXJhdGlvbikge1xuICAgIGxldCBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uID0ge1xuICAgICAgYmFzZURpcjogX19kaXJuYW1lLFxuICAgICAgc2VydmljZTogc2VydmljZUNvbmYsXG4gICAgICByYWJiaXQ6IHJhYmJpdENvbmYsXG4gICAgICBtb25nbzogbW9uZ29Db25mLFxuICAgICAgYXBpOiBhcGlDb25mLFxuICAgICAgcmVkaXM6IHJlZGlzQ29uZixcbiAgICAgIHBvc3RncmVzOiBwb3N0Z3Jlc0NvbmYsXG4gICAgfTtcbiAgICBpZiAoY29uZikge1xuICAgICAgY29uZmlndXJhdGlvbiA9IF8ubWVyZ2UoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIF8ucGljayhjb25mLCBfLmtleXMoY29uZmlndXJhdGlvbikpLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlKTtcbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24ucmFiYml0LCB0aGlzLmxvZ2dlcik7XG4gICAgY29uc3QgbW9uZ28gPSBuZXcgTW9uZ28oY29uZmlndXJhdGlvbi5tb25nbywgdGhpcy5sb2dnZXIpO1xuICAgIGNvbnN0IHJlZGlzID0gbmV3IFJlZGlzKGNvbmZpZ3VyYXRpb24sIHRoaXMubG9nZ2VyKTtcbiAgICBjb25zdCBwZyA9IG5ldyBQb3N0Z3Jlcyhjb25maWd1cmF0aW9uLnBvc3RncmVzLCB0aGlzLmxvZ2dlcik7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB7XG4gICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgcmFiYml0LFxuICAgICAgbW9uZ28sXG4gICAgICByZWRpcyxcbiAgICAgIHBnLFxuICAgICAgbG9nZ2VyOiB0aGlzLmxvZ2dlcixcbiAgICB9O1xuXG4gICAgdGhpcy5hcHAgPSBleHByZXNzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIGluZnJhc3RydWN0dXJlIHNlcnZpY2VzXG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5tb25nby5pbml0KCk7XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmVkaXMuaW5pdCgpO1xuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnBnLmluaXQoKTtcblxuICAgIC8vIEV2ZW50cyAmIFRhc2tzXG4gICAgYXdhaXQgdGhpcy5sb2FkRXZlbnRzKCk7XG4gICAgYXdhaXQgdGhpcy5sb2FkVGFza3MoKTtcblxuICAgIC8vIEFQSVxuICAgIHRoaXMuYXBwLnVzZSh0aGlzLmxvZ0FwaVJvdXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XG4gICAgdGhpcy5hcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSk7XG4gICAgdGhpcy5hcHAudXNlKGNvcnMoKSk7XG4gICAgYXdhaXQgdGhpcy5sb2FkUm91dGVzKCk7XG4gICAgYXdhaXQgdGhpcy5hcHAubGlzdGVuKFxuICAgICAgdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCxcbiAgICAgICgpID0+IHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJ0FQSSBsaXN0ZW5pbmcgb24gcG9ydDonLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KSxcbiAgICApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLm9rKCdTZXJ2aWNlIGluaXRpYWxpemVkLi4uJyk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxvYWRFdmVudHMoZGlyPzogc3RyaW5nKSB7XG4gICAgbGV0IGV2ZW50c0Rpcjogc3RyaW5nO1xuICAgIGlmIChkaXIpIHtcbiAgICAgIGV2ZW50c0RpciA9IGRpcjtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnRzRGlyID0gcGF0aC5qb2luKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vZXZlbnRzLycpO1xuICAgIH1cblxuICAgIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMoZXZlbnRzRGlyKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKGV2ZW50c0RpciwgaGFuZGxlck5hbWUpO1xuICAgICAgaWYgKF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcuZXZlbnQudHMnKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyOiBIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyh0aGlzLnJlc291cmNlcyk7XG5cbiAgICAgICAgICBpZiAoXy5oYXModGhpcy5ldmVudHMsIGhhbmRsZXIudG9waWMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYER1cGxpY2F0ZWQgZXZlbnQgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICAgICAgICB0aGlzLmV2ZW50c1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRXZlbnRzKHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxvYWRUYXNrcyhkaXI/OiBzdHJpbmcpIHtcbiAgICBsZXQgdGFza3NEaXI6IHN0cmluZztcbiAgICBpZiAoZGlyKSB7XG4gICAgICB0YXNrc0RpciA9IGRpcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFza3NEaXIgPSBwYXRoLmpvaW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi90YXNrcy8nKTtcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICAgIHRyeSB7XG4gICAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHRhc2tzRGlyKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHRhc2tzRGlyLCBoYW5kbGVyTmFtZSk7XG5cbiAgICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnRhc2sudHMnKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyOiBIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyh0aGlzLnJlc291cmNlcyk7XG5cbiAgICAgICAgICBpZiAoXy5oYXModGhpcy50YXNrcywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCB0YXNrIGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgICAgICAgdGhpcy50YXNrc1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgICAgYXdhaXQgdGhpcy5sb2FkVGFza3MocGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAvLyB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJyZWN1cnNpbmcgZG93biAke2hhbmRsZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbG9hZFJvdXRlcyhkaXI/OiBzdHJpbmcpIHtcbiAgICBjb25zdCB0cnVzdGVkRW5kcG9pbnRzID0gWydnZXQnLCAnZGVsZXRlJywgJ3B1dCcsICdwb3N0J107XG4gICAgbGV0IHJvdXRlc0Rpcjogc3RyaW5nO1xuICAgIGlmIChkaXIpIHtcbiAgICAgIHJvdXRlc0RpciA9IGRpcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGVzRGlyID0gcGF0aC5qb2luKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vYXBpLycpO1xuICAgIH1cblxuICAgIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMocm91dGVzRGlyKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHJvdXRlc0RpciwgaGFuZGxlck5hbWUpO1xuICAgICAgY29uc3QgbWV0aG9kID0gXy50b0xvd2VyKGhhbmRsZXJOYW1lLnNwbGl0KCcuJylbMF0pO1xuXG4gICAgICBpZiAoXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5yb3V0ZS50cycpKSB7XG4gICAgICAgIC8vIHNraXAgbm9uIHJvdXRlIHRzIGZpbGVzXG4gICAgICAgIC8vIGFsbCByb3V0ZXMgc2hvdWxkIGVuZCBpbiByb3V0ZS50c1xuICAgICAgICAvLyBhbGwgcm91dGVzIHNob3VsZCBzdGFydCB3aXRoIHRoZSBIVFRQIG1ldGhvZCB0byBpbXBsZW1lbnQgZm9sbG93ZWQgYnkgYSBkb3RcbiAgICAgICAgLy8gaW4gdHJ1c3RlZEVuZHBvaW50cyBsaXN0XG4gICAgICAgIC8vIGVnOiBwb3N0LnJvdXRlLnRzXG4gICAgICAgIC8vIGVnOiBnZXQuYWxsQnlCdXNpbmVzcy5yb3V0ZS50c1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIV8uaW5jbHVkZXModHJ1c3RlZEVuZHBvaW50cywgbWV0aG9kKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJvdXRlQ2xhc3MgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICAgIGNvbnN0IHJvdXRlSW5zdGFuY2U6IEFwaVJvdXRlID0gbmV3IHJvdXRlQ2xhc3ModGhpcy5yZXNvdXJjZXMpO1xuXG4gICAgICAgICAgY29uc3QgYXBpUHJlZml4ID0gJy9hcGknO1xuICAgICAgICAgIGNvbnN0IHJvdXRlVVJMID0gYCR7YXBpUHJlZml4fSR7cm91dGVJbnN0YW5jZS51cmx9YDtcblxuICAgICAgICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgICAgICBjYXNlICdnZXQnOlxuICAgICAgICAgICAgICB0aGlzLmFwcC5nZXQocm91dGVVUkwsIHJvdXRlSW5zdGFuY2Uucm91dGVDYWxsYmFjay5iaW5kKHJvdXRlSW5zdGFuY2UpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwb3N0JzpcbiAgICAgICAgICAgICAgdGhpcy5hcHAucG9zdChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3B1dCc6XG4gICAgICAgICAgICAgIHRoaXMuYXBwLnB1dChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuYXBwLmRlbGV0ZShyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnICBMb2FkZWQgcm91dGU6ICcsIG1ldGhvZCwgcm91dGVJbnN0YW5jZS51cmwpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUmVnaXN0ZXJpbmcgRXZlbnQgJHtoYW5kbGVyTmFtZX06ICR7ZXJyb3J9YCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gcmVjdXJzZSBkb3duIHRoZSBkaXJlY3RvcnkgdHJlZVxuICAgICAgICAgIGF3YWl0IHRoaXMubG9hZFJvdXRlcyhwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIC8vIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUnJlY3Vyc2luZyBkb3duICR7aGFuZGxlclBhdGh9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2dBcGlSb3V0ZSA9IChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbikgPT4ge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2cocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsKTtcblxuICAgIGNvbnN0IGNsZWFudXAgPSAoKSA9PiB7XG4gICAgICByZXMucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG4gICAgfTtcblxuICAgIGNvbnN0IGxvZ0ZpbmlzaCA9ICgpID0+IHtcbiAgICAgIGNsZWFudXAoKTtcblxuICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID49IDUwMCkge1xuICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlID49IDQwMCkge1xuICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlIDwgMzAwICYmIHJlcy5zdGF0dXNDb2RlID49IDIwMCkge1xuICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmVzLm9uKCdmaW5pc2gnLCBsb2dGaW5pc2gpO1xuXG4gICAgbmV4dCgpO1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIENvbmZpZ3VyYXRpb24sXG4gIEV4cHJlc3MsXG4gIFJlc3BvbnNlLFxuICBSZXF1ZXN0LFxuICBMb2dnZXIsXG4gIFNlcnZpY2VDb25maWd1cmF0aW9uLFxuICBNb25nb0NvbmZpZ3VyYXRpb24sXG4gIFBvc3RncmVzQ29uZmlndXJhdGlvbixcbiAgUmFiYml0Q29uZmlndXJhdGlvbixcbiAgQXBpQ29uZmlndXJhdGlvbixcbiAgUmVkaXNDb25maWd1cmF0aW9uLFxufTtcbiJdfQ==