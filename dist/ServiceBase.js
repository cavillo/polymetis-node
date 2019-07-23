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
        this.rpcs = {};
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Initialize infrastructure services
            yield this.resources.rabbit.init();
            yield this.resources.mongo.init();
            yield this.resources.redis.init();
            yield this.resources.pg.init();
            // Events & Tasks
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service EVENTS');
            yield this.loadEvents();
            if (_.isEmpty(this.events)) {
                this.resources.logger.log('- No events loaded...');
            }
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service TASKS');
            yield this.loadTasks();
            if (_.isEmpty(this.tasks)) {
                this.resources.logger.log('- No tasks loaded...');
            }
            // RPCs
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service RPC\'s');
            yield this.loadRPC();
            if (_.isEmpty(this.rpcs)) {
                this.resources.logger.log('- No rpcs loaded...');
            }
            // API
            this.app.use(this.logApiRoute.bind(this));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors_1.default());
            yield this.app.listen(this.resources.configuration.api.port, () => this.resources.logger.log('API listening on port:', this.resources.configuration.api.port));
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service API ROUTES');
            yield this.loadRoutes();
            if (_.isEmpty(this.routes)) {
                this.resources.logger.log('- No routes loaded...');
            }
            this.resources.logger.newLine();
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
                        this.resources.logger.log('-', handler.getName());
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
                        this.resources.logger.log('-', handler.getName());
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
    loadRPC(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            let rpcsDir;
            if (dir) {
                rpcsDir = dir;
            }
            else {
                rpcsDir = path.join(this.resources.configuration.baseDir, './rpc/');
            }
            let handlers;
            try {
                handlers = fs.readdirSync(rpcsDir);
            }
            catch (error) {
                return;
            }
            for (const handlerName of handlers) {
                const handlerPath = path.join(rpcsDir, handlerName);
                if (_.endsWith(handlerName, '.rpc.ts')) {
                    try {
                        const handlerSpec = require(handlerPath).default;
                        const handler = new handlerSpec(this.resources);
                        if (_.has(this.rpcs, handler.topic)) {
                            throw new Error(`Duplicated rpc listener: ${handler.topic}`);
                        }
                        yield handler.init();
                        this.rpcs[handler.topic] = handler;
                        this.resources.logger.log('-', handler.getName());
                    }
                    catch (error) {
                        this.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
                    }
                }
                else {
                    try {
                        // recurse down the directory tree
                        yield this.loadRPC(path.join(handlerPath, '/'));
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
                        this.routes[routeInstance.url] = routeInstance;
                        this.resources.logger.log('-', `${_.toUpper(method)}`, routeInstance.url);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsc0RBQTRFO0FBQzVFLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFDekIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixxREFjNkI7QUFFN0IsNkRBQXFDO0FBQ3JDLDBEQUFrQztBQUNsQywwREFBa0M7QUFDbEMsNERBQW9DO0FBOFZsQyxpQkE5VkssZ0JBQU0sQ0E4Vkw7QUE1VlIsa0VBQW1DO0FBV25DLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFvQjtRQXNTeEIsZ0JBQVcsR0FBRyxDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1lBQ3hFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUV2RCxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7Z0JBQ25CLEdBQUcsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQztZQUVGLE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtnQkFDckIsT0FBTyxFQUFFLENBQUM7Z0JBRVYsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRTtvQkFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQzFFO3FCQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7b0JBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFH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Q0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMzRTtvQkFBQyxPQUFPLEtBQUssRUFBRTt3QkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLFdBQVcsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3FCQUNqRjtpQkFDRjtxQkFBTTtvQkFDTCxJQUFJO3dCQUNGLGtDQUFrQzt3QkFDbEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ3BEO29CQUFDLE9BQU8sS0FBSyxFQUFFO3dCQUNkLGlGQUFpRjtxQkFDbEY7aUJBQ0Y7YUFDRjtRQUNILENBQUM7S0FBQTtDQTJCRjtBQTFVRCw4QkEwVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZXhwcmVzcywgeyBFeHByZXNzLCBOZXh0RnVuY3Rpb24sIFJlcXVlc3QsIFJlc3BvbnNlIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IHtcbiAgc2VydmljZUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIG1vbmdvQ29uZixcbiAgYXBpQ29uZixcbiAgcmVkaXNDb25mLFxuICBwb3N0Z3Jlc0NvbmYsXG4gIENvbmZpZ3VyYXRpb24sXG4gIFNlcnZpY2VDb25maWd1cmF0aW9uLFxuICBNb25nb0NvbmZpZ3VyYXRpb24sXG4gIFBvc3RncmVzQ29uZmlndXJhdGlvbixcbiAgUmFiYml0Q29uZmlndXJhdGlvbixcbiAgQXBpQ29uZmlndXJhdGlvbixcbiAgUmVkaXNDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuL2hhbmRsZXJzL0hhbmRsZXJCYXNlJztcbmltcG9ydCBSYWJiaXQgZnJvbSAnLi9yYWJiaXQvUmFiYml0JztcbmltcG9ydCBNb25nbyBmcm9tICcuL21vbmdvL01vbmdvJztcbmltcG9ydCBQb3N0Z3JlcyBmcm9tICcuL3Bvc3RncmVzJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi91dGlscy9Mb2dnZXInO1xuaW1wb3J0IEFwaVJvdXRlIGZyb20gJy4vYXBpL0FwaVJvdXRlJztcbmltcG9ydCBSZWRpcyBmcm9tICcuL3JlZGlzU2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZVJlc291cmNlcyB7XG4gIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0O1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgbW9uZ286IE1vbmdvO1xuICByZWRpczogUmVkaXM7XG4gIHBnOiBQb3N0Z3Jlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUJhc2Uge1xuICBwdWJsaWMgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwdWJsaWMgYXBwOiBFeHByZXNzO1xuICBwdWJsaWMgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzO1xuXG4gIHByb3RlY3RlZCBldmVudHM6IGFueTtcbiAgcHJvdGVjdGVkIHRhc2tzOiBhbnk7XG4gIHByb3RlY3RlZCByb3V0ZXM6IGFueTtcbiAgcHJvdGVjdGVkIHJwY3M6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25mPzogQ29uZmlndXJhdGlvbikge1xuICAgIGxldCBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uID0ge1xuICAgICAgYmFzZURpcjogX19kaXJuYW1lLFxuICAgICAgc2VydmljZTogc2VydmljZUNvbmYsXG4gICAgICByYWJiaXQ6IHJhYmJpdENvbmYsXG4gICAgICBtb25nbzogbW9uZ29Db25mLFxuICAgICAgYXBpOiBhcGlDb25mLFxuICAgICAgcmVkaXM6IHJlZGlzQ29uZixcbiAgICAgIHBvc3RncmVzOiBwb3N0Z3Jlc0NvbmYsXG4gICAgfTtcbiAgICBpZiAoY29uZikge1xuICAgICAgY29uZmlndXJhdGlvbiA9IF8ubWVyZ2UoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIF8ucGljayhjb25mLCBfLmtleXMoY29uZmlndXJhdGlvbikpLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlKTtcbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24ucmFiYml0LCB0aGlzLmxvZ2dlcik7XG4gICAgY29uc3QgbW9uZ28gPSBuZXcgTW9uZ28oY29uZmlndXJhdGlvbi5tb25nbywgdGhpcy5sb2dnZXIpO1xuICAgIGNvbnN0IHJlZGlzID0gbmV3IFJlZGlzKGNvbmZpZ3VyYXRpb24sIHRoaXMubG9nZ2VyKTtcbiAgICBjb25zdCBwZyA9IG5ldyBQb3N0Z3Jlcyhjb25maWd1cmF0aW9uLnBvc3RncmVzLCB0aGlzLmxvZ2dlcik7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB7XG4gICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgcmFiYml0LFxuICAgICAgbW9uZ28sXG4gICAgICByZWRpcyxcbiAgICAgIHBnLFxuICAgICAgbG9nZ2VyOiB0aGlzLmxvZ2dlcixcbiAgICB9O1xuXG4gICAgdGhpcy5hcHAgPSBleHByZXNzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIHRoaXMucnBjcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIGluZnJhc3RydWN0dXJlIHNlcnZpY2VzXG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5tb25nby5pbml0KCk7XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmVkaXMuaW5pdCgpO1xuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnBnLmluaXQoKTtcblxuICAgIC8vIEV2ZW50cyAmIFRhc2tzXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLm5ld0xpbmUoKTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCdMb2FkaW5nIHNlcnZpY2UgRVZFTlRTJyk7XG4gICAgYXdhaXQgdGhpcy5sb2FkRXZlbnRzKCk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLmV2ZW50cykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJy0gTm8gZXZlbnRzIGxvYWRlZC4uLicpO1xuICAgIH1cblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5uZXdMaW5lKCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnTG9hZGluZyBzZXJ2aWNlIFRBU0tTJyk7XG4gICAgYXdhaXQgdGhpcy5sb2FkVGFza3MoKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMudGFza3MpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCctIE5vIHRhc2tzIGxvYWRlZC4uLicpO1xuICAgIH1cblxuICAgIC8vIFJQQ3NcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubmV3TGluZSgpO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJ0xvYWRpbmcgc2VydmljZSBSUENcXCdzJyk7XG4gICAgYXdhaXQgdGhpcy5sb2FkUlBDKCk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJwY3MpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCctIE5vIHJwY3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIC8vIEFQSVxuXG4gICAgdGhpcy5hcHAudXNlKHRoaXMubG9nQXBpUm91dGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKTtcbiAgICB0aGlzLmFwcC51c2UoY29ycygpKTtcblxuICAgIGF3YWl0IHRoaXMuYXBwLmxpc3RlbihcbiAgICAgIHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQsXG4gICAgICAoKSA9PiB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCdBUEkgbGlzdGVuaW5nIG9uIHBvcnQ6JywgdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCksXG4gICAgKTtcblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5uZXdMaW5lKCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnTG9hZGluZyBzZXJ2aWNlIEFQSSBST1VURVMnKTtcbiAgICBhd2FpdCB0aGlzLmxvYWRSb3V0ZXMoKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMucm91dGVzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnLSBObyByb3V0ZXMgbG9hZGVkLi4uJyk7XG4gICAgfVxuXG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubmV3TGluZSgpO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5vaygnU2VydmljZSBpbml0aWFsaXplZC4uLicpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkRXZlbnRzKGRpcj86IHN0cmluZykge1xuICAgIGxldCBldmVudHNEaXI6IHN0cmluZztcbiAgICBpZiAoZGlyKSB7XG4gICAgICBldmVudHNEaXIgPSBkaXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50c0RpciA9IHBhdGguam9pbih0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL2V2ZW50cy8nKTtcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICAgIHRyeSB7XG4gICAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKGV2ZW50c0Rpcik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGhhbmRsZXJOYW1lIG9mIGhhbmRsZXJzKSB7XG4gICAgICBjb25zdCBoYW5kbGVyUGF0aCA9IHBhdGguam9pbihldmVudHNEaXIsIGhhbmRsZXJOYW1lKTtcbiAgICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLmV2ZW50LnRzJykpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyU3BlYyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgICAgY29uc3QgaGFuZGxlcjogSGFuZGxlckJhc2UgPSBuZXcgaGFuZGxlclNwZWModGhpcy5yZXNvdXJjZXMpO1xuXG4gICAgICAgICAgaWYgKF8uaGFzKHRoaXMuZXZlbnRzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIGV2ZW50IGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgICAgICAgdGhpcy5ldmVudHNbaGFuZGxlci50b3BpY10gPSBoYW5kbGVyO1xuICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJy0nLCBoYW5kbGVyLmdldE5hbWUoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgICAgYXdhaXQgdGhpcy5sb2FkRXZlbnRzKHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxvYWRUYXNrcyhkaXI/OiBzdHJpbmcpIHtcbiAgICBsZXQgdGFza3NEaXI6IHN0cmluZztcbiAgICBpZiAoZGlyKSB7XG4gICAgICB0YXNrc0RpciA9IGRpcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFza3NEaXIgPSBwYXRoLmpvaW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi90YXNrcy8nKTtcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICAgIHRyeSB7XG4gICAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHRhc2tzRGlyKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHRhc2tzRGlyLCBoYW5kbGVyTmFtZSk7XG5cbiAgICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnRhc2sudHMnKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyOiBIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyh0aGlzLnJlc291cmNlcyk7XG5cbiAgICAgICAgICBpZiAoXy5oYXModGhpcy50YXNrcywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCB0YXNrIGxpc3RlbmVyOiAke2hhbmRsZXIudG9waWN9YCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXdhaXQgaGFuZGxlci5pbml0KCk7XG4gICAgICAgICAgdGhpcy50YXNrc1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnLScsIGhhbmRsZXIuZ2V0TmFtZSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRUYXNrcyhwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIC8vIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUnJlY3Vyc2luZyBkb3duICR7aGFuZGxlclBhdGh9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkUlBDKGRpcj86IHN0cmluZykge1xuICAgIGxldCBycGNzRGlyOiBzdHJpbmc7XG4gICAgaWYgKGRpcikge1xuICAgICAgcnBjc0RpciA9IGRpcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcnBjc0RpciA9IHBhdGguam9pbih0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL3JwYy8nKTtcbiAgICB9XG5cbiAgICBsZXQgaGFuZGxlcnM6IHN0cmluZ1tdO1xuICAgIHRyeSB7XG4gICAgICBoYW5kbGVycyA9IGZzLnJlYWRkaXJTeW5jKHJwY3NEaXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4ocnBjc0RpciwgaGFuZGxlck5hbWUpO1xuXG4gICAgICBpZiAoXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5ycGMudHMnKSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXJTcGVjID0gcmVxdWlyZShoYW5kbGVyUGF0aCkuZGVmYXVsdDtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyOiBIYW5kbGVyQmFzZSA9IG5ldyBoYW5kbGVyU3BlYyh0aGlzLnJlc291cmNlcyk7XG5cbiAgICAgICAgICBpZiAoXy5oYXModGhpcy5ycGNzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIHJwYyBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgICAgICAgIHRoaXMucnBjc1toYW5kbGVyLnRvcGljXSA9IGhhbmRsZXI7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnLScsIGhhbmRsZXIuZ2V0TmFtZSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRSUEMocGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAvLyB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJyZWN1cnNpbmcgZG93biAke2hhbmRsZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbG9hZFJvdXRlcyhkaXI/OiBzdHJpbmcpIHtcbiAgICBjb25zdCB0cnVzdGVkRW5kcG9pbnRzID0gWydnZXQnLCAnZGVsZXRlJywgJ3B1dCcsICdwb3N0J107XG4gICAgbGV0IHJvdXRlc0Rpcjogc3RyaW5nO1xuICAgIGlmIChkaXIpIHtcbiAgICAgIHJvdXRlc0RpciA9IGRpcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGVzRGlyID0gcGF0aC5qb2luKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYmFzZURpciwgJy4vYXBpLycpO1xuICAgIH1cblxuICAgIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmMocm91dGVzRGlyKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaGFuZGxlck5hbWUgb2YgaGFuZGxlcnMpIHtcbiAgICAgIGNvbnN0IGhhbmRsZXJQYXRoID0gcGF0aC5qb2luKHJvdXRlc0RpciwgaGFuZGxlck5hbWUpO1xuICAgICAgY29uc3QgbWV0aG9kID0gXy50b0xvd2VyKGhhbmRsZXJOYW1lLnNwbGl0KCcuJylbMF0pO1xuXG4gICAgICBpZiAoXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5yb3V0ZS50cycpKSB7XG4gICAgICAgIC8vIHNraXAgbm9uIHJvdXRlIHRzIGZpbGVzXG4gICAgICAgIC8vIGFsbCByb3V0ZXMgc2hvdWxkIGVuZCBpbiByb3V0ZS50c1xuICAgICAgICAvLyBhbGwgcm91dGVzIHNob3VsZCBzdGFydCB3aXRoIHRoZSBIVFRQIG1ldGhvZCB0byBpbXBsZW1lbnQgZm9sbG93ZWQgYnkgYSBkb3RcbiAgICAgICAgLy8gaW4gdHJ1c3RlZEVuZHBvaW50cyBsaXN0XG4gICAgICAgIC8vIGVnOiBwb3N0LnJvdXRlLnRzXG4gICAgICAgIC8vIGVnOiBnZXQuYWxsQnlCdXNpbmVzcy5yb3V0ZS50c1xuICAgICAgICBpZiAoXG4gICAgICAgICAgIV8uaW5jbHVkZXModHJ1c3RlZEVuZHBvaW50cywgbWV0aG9kKVxuICAgICAgICApIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJvdXRlQ2xhc3MgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICAgIGNvbnN0IHJvdXRlSW5zdGFuY2U6IEFwaVJvdXRlID0gbmV3IHJvdXRlQ2xhc3ModGhpcy5yZXNvdXJjZXMpO1xuXG4gICAgICAgICAgY29uc3QgYXBpUHJlZml4ID0gJy9hcGknO1xuICAgICAgICAgIGNvbnN0IHJvdXRlVVJMID0gYCR7YXBpUHJlZml4fSR7cm91dGVJbnN0YW5jZS51cmx9YDtcblxuICAgICAgICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICAgICAgICBjYXNlICdnZXQnOlxuICAgICAgICAgICAgICB0aGlzLmFwcC5nZXQocm91dGVVUkwsIHJvdXRlSW5zdGFuY2Uucm91dGVDYWxsYmFjay5iaW5kKHJvdXRlSW5zdGFuY2UpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdwb3N0JzpcbiAgICAgICAgICAgICAgdGhpcy5hcHAucG9zdChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3B1dCc6XG4gICAgICAgICAgICAgIHRoaXMuYXBwLnB1dChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgICAgIHRoaXMuYXBwLmRlbGV0ZShyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnJvdXRlc1tyb3V0ZUluc3RhbmNlLnVybF0gPSByb3V0ZUluc3RhbmNlO1xuICAgICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJy0nLCBgJHtfLnRvVXBwZXIobWV0aG9kKX1gLCByb3V0ZUluc3RhbmNlLnVybCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgICAgYXdhaXQgdGhpcy5sb2FkUm91dGVzKHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvZ0FwaVJvdXRlID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwpO1xuXG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcbiAgICAgIHJlcy5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgbG9nRmluaXNoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbG9nRmluaXNoID0gKCkgPT4ge1xuICAgICAgY2xlYW51cCgpO1xuXG4gICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNTAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPCAzMDAgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2cocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXMub24oJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG5cbiAgICBuZXh0KCk7XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgQ29uZmlndXJhdGlvbixcbiAgRXhwcmVzcyxcbiAgUmVzcG9uc2UsXG4gIFJlcXVlc3QsXG4gIExvZ2dlcixcbiAgU2VydmljZUNvbmZpZ3VyYXRpb24sXG4gIE1vbmdvQ29uZmlndXJhdGlvbixcbiAgUG9zdGdyZXNDb25maWd1cmF0aW9uLFxuICBSYWJiaXRDb25maWd1cmF0aW9uLFxuICBBcGlDb25maWd1cmF0aW9uLFxuICBSZWRpc0NvbmZpZ3VyYXRpb24sXG59O1xuIl19