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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsc0RBQTRFO0FBQzVFLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFDekIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQVF4QixxREFRNkI7QUFFN0IsNkRBQXFDO0FBQ3JDLDBEQUFrQztBQUNsQywwREFBa0M7QUFDbEMsNERBQW9DO0FBRXBDLGtFQUFtQztBQVduQyxNQUFxQixXQUFXO0lBUzlCLFlBQVksSUFBMEI7UUF3TjlCLGdCQUFXLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtZQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFdkQsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUNuQixHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUM7WUFFRixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxDQUFDO2dCQUVWLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUMxRTtxQkFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO29CQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMs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QUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztnQ0FDM0UsTUFBTTt5QkFDVDt3QkFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDMUU7b0JBQUMsT0FBTyxLQUFLLEVBQUU7d0JBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixXQUFXLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQztxQkFDakY7aUJBQ0Y7cUJBQU07b0JBQ0wsSUFBSTt3QkFDRixrQ0FBa0M7d0JBQ2xDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNwRDtvQkFBQyxPQUFPLEtBQUssRUFBRTt3QkFDZCxpRkFBaUY7cUJBQ2xGO2lCQUNGO2FBQ0Y7UUFDSCxDQUFDO0tBQUE7Q0EyQkY7QUExUEQsOEJBMFBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGV4cHJlc3MsIHsgRXhwcmVzcywgTmV4dEZ1bmN0aW9uLCBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XG5cbmV4cG9ydCB7XG4gIENvbmZpZ3VyYXRpb24sXG4gIFJlc3BvbnNlLFxuICBSZXF1ZXN0LFxufTtcblxuaW1wb3J0IHtcbiAgc2VydmljZUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIG1vbmdvQ29uZixcbiAgYXBpQ29uZixcbiAgcmVkaXNDb25mLFxuICBwb3N0Z3Jlc0NvbmYsXG4gIENvbmZpZ3VyYXRpb24sXG59IGZyb20gJy4vdXRpbHMvU2VydmljZUNvbmYnO1xuaW1wb3J0IEhhbmRsZXJCYXNlIGZyb20gJy4vaGFuZGxlcnMvSGFuZGxlckJhc2UnO1xuaW1wb3J0IFJhYmJpdCBmcm9tICcuL3JhYmJpdC9SYWJiaXQnO1xuaW1wb3J0IE1vbmdvIGZyb20gJy4vbW9uZ28vTW9uZ28nO1xuaW1wb3J0IFBvc3RncmVzIGZyb20gJy4vcG9zdGdyZXMnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL3V0aWxzL0xvZ2dlcic7XG5pbXBvcnQgQXBpUm91dGUgZnJvbSAnLi9hcGkvQXBpUm91dGUnO1xuaW1wb3J0IFJlZGlzIGZyb20gJy4vcmVkaXNTZXJ2aWNlJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUmVzb3VyY2VzIHtcbiAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXQ7XG4gIGxvZ2dlcjogTG9nZ2VyO1xuICBtb25nbzogTW9uZ287XG4gIHJlZGlzOiBSZWRpcztcbiAgcGc6IFBvc3RncmVzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlQmFzZSB7XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcbiAgcHJvdGVjdGVkIHJlc291cmNlczogU2VydmljZVJlc291cmNlcztcbiAgcHJvdGVjdGVkIGFwcDogRXhwcmVzcztcblxuICBwcm90ZWN0ZWQgZXZlbnRzOiBhbnk7XG4gIHByb3RlY3RlZCB0YXNrczogYW55O1xuICBwcm90ZWN0ZWQgcm91dGVzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoY29uZj86IENvbmZpZ3VyYXRpb24gfCBhbnkpIHtcbiAgICBsZXQgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGJhc2VEaXI6IF9fZGlybmFtZSxcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2VDb25mLFxuICAgICAgcmFiYml0OiByYWJiaXRDb25mLFxuICAgICAgbW9uZ286IG1vbmdvQ29uZixcbiAgICAgIGFwaTogYXBpQ29uZixcbiAgICAgIHJlZGlzOiByZWRpc0NvbmYsXG4gICAgICBwb3N0Z3JlczogcG9zdGdyZXNDb25mLFxuICAgIH07XG4gICAgaWYgKGNvbmYpIHtcbiAgICAgIGNvbmZpZ3VyYXRpb24gPSBfLm1lcmdlKFxuICAgICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgICBfLnBpY2soY29uZiwgXy5rZXlzKGNvbmZpZ3VyYXRpb24pKSxcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihjb25maWd1cmF0aW9uLnNlcnZpY2UpO1xuICAgIGNvbnN0IHJhYmJpdCA9IG5ldyBSYWJiaXQoY29uZmlndXJhdGlvbi5yYWJiaXQsIHRoaXMubG9nZ2VyKTtcbiAgICBjb25zdCBtb25nbyA9IG5ldyBNb25nbyhjb25maWd1cmF0aW9uLm1vbmdvLCB0aGlzLmxvZ2dlcik7XG4gICAgY29uc3QgcmVkaXMgPSBuZXcgUmVkaXMoY29uZmlndXJhdGlvbiwgdGhpcy5sb2dnZXIpO1xuICAgIGNvbnN0IHBnID0gbmV3IFBvc3RncmVzKGNvbmZpZ3VyYXRpb24ucG9zdGdyZXMsIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnJlc291cmNlcyA9IHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICByYWJiaXQsXG4gICAgICBtb25nbyxcbiAgICAgIHJlZGlzLFxuICAgICAgcGcsXG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgIH07XG5cbiAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcblxuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMucm91dGVzID0ge307XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgaW5mcmFzdHJ1Y3R1cmUgc2VydmljZXNcbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yYWJiaXQuaW5pdCgpO1xuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLm1vbmdvLmluaXQoKTtcbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yZWRpcy5pbml0KCk7XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucGcuaW5pdCgpO1xuXG4gICAgLy8gRXZlbnRzICYgVGFza3NcbiAgICBhd2FpdCB0aGlzLmxvYWRFdmVudHMoKTtcbiAgICBhd2FpdCB0aGlzLmxvYWRUYXNrcygpO1xuXG4gICAgLy8gQVBJXG4gICAgdGhpcy5hcHAudXNlKHRoaXMubG9nQXBpUm91dGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKTtcbiAgICB0aGlzLmFwcC51c2UoY29ycygpKTtcbiAgICBhd2FpdCB0aGlzLmxvYWRSb3V0ZXMoKTtcbiAgICBhd2FpdCB0aGlzLmFwcC5saXN0ZW4oXG4gICAgICB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0LFxuICAgICAgKCkgPT4gdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnQVBJIGxpc3RlbmluZyBvbiBwb3J0OicsIHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpLFxuICAgICk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIub2soJ1NlcnZpY2UgaW5pdGlhbGl6ZWQuLi4nKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbG9hZEV2ZW50cyhkaXI/OiBzdHJpbmcpIHtcbiAgICBsZXQgZXZlbnRzRGlyOiBzdHJpbmc7XG4gICAgaWYgKGRpcikge1xuICAgICAgZXZlbnRzRGlyID0gZGlyO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudHNEaXIgPSBwYXRoLmpvaW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9ldmVudHMvJyk7XG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgICB0cnkge1xuICAgICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyhldmVudHNEaXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4oZXZlbnRzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgICBpZiAoXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5ldmVudC50cycpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXI6IEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHRoaXMucmVzb3VyY2VzKTtcblxuICAgICAgICAgIGlmIChfLmhhcyh0aGlzLmV2ZW50cywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBldmVudCBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRFdmVudHMocGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAvLyB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJyZWN1cnNpbmcgZG93biAke2hhbmRsZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbG9hZFRhc2tzKGRpcj86IHN0cmluZykge1xuICAgIGxldCB0YXNrc0Rpcjogc3RyaW5nO1xuICAgIGlmIChkaXIpIHtcbiAgICAgIHRhc2tzRGlyID0gZGlyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXNrc0RpciA9IHBhdGguam9pbih0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL3Rhc2tzLycpO1xuICAgIH1cblxuICAgIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmModGFza3NEaXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4odGFza3NEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgICAgaWYgKF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcudGFzay50cycpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXI6IEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHRoaXMucmVzb3VyY2VzKTtcblxuICAgICAgICAgIGlmIChfLmhhcyh0aGlzLnRhc2tzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIHRhc2sgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICAgICAgICB0aGlzLnRhc2tzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRUYXNrcyhwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIC8vIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUnJlY3Vyc2luZyBkb3duICR7aGFuZGxlclBhdGh9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkUm91dGVzKGRpcj86IHN0cmluZykge1xuICAgIGNvbnN0IHRydXN0ZWRFbmRwb2ludHMgPSBbJ2dldCcsICdkZWxldGUnLCAncHV0JywgJ3Bvc3QnXTtcbiAgICBsZXQgcm91dGVzRGlyOiBzdHJpbmc7XG4gICAgaWYgKGRpcikge1xuICAgICAgcm91dGVzRGlyID0gZGlyO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZXNEaXIgPSBwYXRoLmpvaW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9hcGkvJyk7XG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgICB0cnkge1xuICAgICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyhyb3V0ZXNEaXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4ocm91dGVzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgICBjb25zdCBtZXRob2QgPSBfLnRvTG93ZXIoaGFuZGxlck5hbWUuc3BsaXQoJy4nKVswXSk7XG5cbiAgICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJvdXRlLnRzJykpIHtcbiAgICAgICAgLy8gc2tpcCBub24gcm91dGUgdHMgZmlsZXNcbiAgICAgICAgLy8gYWxsIHJvdXRlcyBzaG91bGQgZW5kIGluIHJvdXRlLnRzXG4gICAgICAgIC8vIGFsbCByb3V0ZXMgc2hvdWxkIHN0YXJ0IHdpdGggdGhlIEhUVFAgbWV0aG9kIHRvIGltcGxlbWVudCBmb2xsb3dlZCBieSBhIGRvdFxuICAgICAgICAvLyBpbiB0cnVzdGVkRW5kcG9pbnRzIGxpc3RcbiAgICAgICAgLy8gZWc6IHBvc3Qucm91dGUudHNcbiAgICAgICAgLy8gZWc6IGdldC5hbGxCeUJ1c2luZXNzLnJvdXRlLnRzXG4gICAgICAgIGlmIChcbiAgICAgICAgICAhXy5pbmNsdWRlcyh0cnVzdGVkRW5kcG9pbnRzLCBtZXRob2QpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgcm91dGVDbGFzcyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgICAgY29uc3Qgcm91dGVJbnN0YW5jZTogQXBpUm91dGUgPSBuZXcgcm91dGVDbGFzcyh0aGlzLnJlc291cmNlcyk7XG5cbiAgICAgICAgICBjb25zdCBhcGlQcmVmaXggPSAnL2FwaSc7XG4gICAgICAgICAgY29uc3Qgcm91dGVVUkwgPSBgJHthcGlQcmVmaXh9JHtyb3V0ZUluc3RhbmNlLnVybH1gO1xuXG4gICAgICAgICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldCc6XG4gICAgICAgICAgICAgIHRoaXMuYXBwLmdldChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Bvc3QnOlxuICAgICAgICAgICAgICB0aGlzLmFwcC5wb3N0KHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncHV0JzpcbiAgICAgICAgICAgICAgdGhpcy5hcHAucHV0KHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgdGhpcy5hcHAuZGVsZXRlKHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCcgIExvYWRlZCByb3V0ZTogJywgbWV0aG9kLCByb3V0ZUluc3RhbmNlLnVybCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgICAgYXdhaXQgdGhpcy5sb2FkUm91dGVzKHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvZ0FwaVJvdXRlID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwpO1xuXG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcbiAgICAgIHJlcy5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgbG9nRmluaXNoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbG9nRmluaXNoID0gKCkgPT4ge1xuICAgICAgY2xlYW51cCgpO1xuXG4gICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNTAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPCAzMDAgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2cocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXMub24oJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG5cbiAgICBuZXh0KCk7XG4gIH1cbn1cbiJdfQ==