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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsc0RBQTRFO0FBQzVFLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFDekIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQVF4QixxREFRNkI7QUFFN0IsNkRBQXFDO0FBQ3JDLDBEQUFrQztBQUNsQywwREFBa0M7QUFDbEMsNERBQW9DO0FBRXBDLGtFQUFtQztBQVduQyxNQUFxQixXQUFXO0lBUzlCLFlBQVksSUFBMEI7UUF1TjlCLGdCQUFXLEdBQUcsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtZQUN4RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFdkQsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFO2dCQUNuQixHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUM7WUFFRixNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7Z0JBQ3JCLE9BQU8sRUFBRSxDQUFDO2dCQUVWLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUMxRTtxQkFBTSxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO29CQUNoQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMs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SSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzFFO29CQUFDLE9BQU8sS0FBSyxFQUFFO3dCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsV0FBVyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7cUJBQ2pGO2lCQUNGO3FCQUFNO29CQUNMLElBQUk7d0JBQ0Ysa0NBQWtDO3dCQUNsQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDcEQ7b0JBQUMsT0FBTyxLQUFLLEVBQUU7d0JBQ2QsaUZBQWlGO3FCQUNsRjtpQkFDRjthQUNGO1FBQ0gsQ0FBQztLQUFBO0NBMkJGO0FBelBELDhCQXlQQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBleHByZXNzLCB7IEV4cHJlc3MsIE5leHRGdW5jdGlvbiwgUmVxdWVzdCwgUmVzcG9uc2UgfSBmcm9tICdleHByZXNzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBjb3JzIGZyb20gJ2NvcnMnO1xuXG5leHBvcnQge1xuICBDb25maWd1cmF0aW9uLFxuICBSZXNwb25zZSxcbiAgUmVxdWVzdCxcbn07XG5cbmltcG9ydCB7XG4gIHNlcnZpY2VDb25mLFxuICByYWJiaXRDb25mLFxuICBtb25nb0NvbmYsXG4gIGFwaUNvbmYsXG4gIHJlZGlzQ29uZixcbiAgcG9zdGdyZXNDb25mLFxuICBDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL1NlcnZpY2VDb25mJztcbmltcG9ydCBIYW5kbGVyQmFzZSBmcm9tICcuL2hhbmRsZXJzL0hhbmRsZXJCYXNlJztcbmltcG9ydCBSYWJiaXQgZnJvbSAnLi9yYWJiaXQvUmFiYml0JztcbmltcG9ydCBNb25nbyBmcm9tICcuL21vbmdvL01vbmdvJztcbmltcG9ydCBQb3N0Z3JlcyBmcm9tICcuL3Bvc3RncmVzJztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi91dGlscy9Mb2dnZXInO1xuaW1wb3J0IEFwaVJvdXRlIGZyb20gJy4vYXBpL0FwaVJvdXRlJztcbmltcG9ydCBSZWRpcyBmcm9tICcuL3JlZGlzU2VydmljZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZVJlc291cmNlcyB7XG4gIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0O1xuICBsb2dnZXI6IExvZ2dlcjtcbiAgbW9uZ286IE1vbmdvO1xuICByZWRpczogUmVkaXM7XG4gIHBnOiBQb3N0Z3Jlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUJhc2Uge1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHByb3RlY3RlZCByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG4gIHByb3RlY3RlZCBhcHA6IEV4cHJlc3M7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogYW55O1xuICBwcm90ZWN0ZWQgdGFza3M6IGFueTtcbiAgcHJvdGVjdGVkIHJvdXRlczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmY/OiBDb25maWd1cmF0aW9uIHwgYW55KSB7XG4gICAgbGV0IGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICBiYXNlRGlyOiBfX2Rpcm5hbWUsXG4gICAgICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgICAgIHJhYmJpdDogcmFiYml0Q29uZixcbiAgICAgIG1vbmdvOiBtb25nb0NvbmYsXG4gICAgICBhcGk6IGFwaUNvbmYsXG4gICAgICByZWRpczogcmVkaXNDb25mLFxuICAgICAgcG9zdGdyZXM6IHBvc3RncmVzQ29uZixcbiAgICB9O1xuICAgIGlmIChjb25mKSB7XG4gICAgICBjb25maWd1cmF0aW9uID0gXy5tZXJnZShcbiAgICAgICAgY29uZmlndXJhdGlvbixcbiAgICAgICAgXy5waWNrKGNvbmYsIF8ua2V5cyhjb25maWd1cmF0aW9uKSksXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlKTtcbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24ucmFiYml0LCB0aGlzLmxvZ2dlcik7XG4gICAgY29uc3QgbW9uZ28gPSBuZXcgTW9uZ28oY29uZmlndXJhdGlvbi5tb25nbywgdGhpcy5sb2dnZXIpO1xuICAgIGNvbnN0IHJlZGlzID0gbmV3IFJlZGlzKGNvbmZpZ3VyYXRpb24sIHRoaXMubG9nZ2VyKTtcbiAgICBjb25zdCBwZyA9IG5ldyBQb3N0Z3Jlcyhjb25maWd1cmF0aW9uLnBvc3RncmVzLCB0aGlzLmxvZ2dlcik7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB7XG4gICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgcmFiYml0LFxuICAgICAgbW9uZ28sXG4gICAgICByZWRpcyxcbiAgICAgIHBnLFxuICAgICAgbG9nZ2VyOiB0aGlzLmxvZ2dlcixcbiAgICB9O1xuXG4gICAgdGhpcy5hcHAgPSBleHByZXNzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIGluZnJhc3RydWN0dXJlIHNlcnZpY2VzXG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5tb25nby5pbml0KCk7XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucGcuaW5pdCgpO1xuXG4gICAgLy8gRXZlbnRzICYgVGFza3NcbiAgICBhd2FpdCB0aGlzLmxvYWRFdmVudHMoKTtcbiAgICBhd2FpdCB0aGlzLmxvYWRUYXNrcygpO1xuXG4gICAgLy8gQVBJXG4gICAgdGhpcy5hcHAudXNlKHRoaXMubG9nQXBpUm91dGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKTtcbiAgICB0aGlzLmFwcC51c2UoY29ycygpKTtcbiAgICBhd2FpdCB0aGlzLmxvYWRSb3V0ZXMoKTtcbiAgICBhd2FpdCB0aGlzLmFwcC5saXN0ZW4oXG4gICAgICB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0LFxuICAgICAgKCkgPT4gdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnQVBJIGxpc3RlbmluZyBvbiBwb3J0OicsIHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpLFxuICAgICk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIub2soJ1NlcnZpY2UgaW5pdGlhbGl6ZWQuLi4nKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbG9hZEV2ZW50cyhkaXI/OiBzdHJpbmcpIHtcbiAgICBsZXQgZXZlbnRzRGlyOiBzdHJpbmc7XG4gICAgaWYgKGRpcikge1xuICAgICAgZXZlbnRzRGlyID0gZGlyO1xuICAgIH0gZWxzZSB7XG4gICAgICBldmVudHNEaXIgPSBwYXRoLmpvaW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9ldmVudHMvJyk7XG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgICB0cnkge1xuICAgICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyhldmVudHNEaXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4oZXZlbnRzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgICBpZiAoXy5lbmRzV2l0aChoYW5kbGVyTmFtZSwgJy5ldmVudC50cycpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXI6IEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHRoaXMucmVzb3VyY2VzKTtcblxuICAgICAgICAgIGlmIChfLmhhcyh0aGlzLmV2ZW50cywgaGFuZGxlci50b3BpYykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRHVwbGljYXRlZCBldmVudCBsaXN0ZW5lcjogJHtoYW5kbGVyLnRvcGljfWApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGF3YWl0IGhhbmRsZXIuaW5pdCgpO1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRFdmVudHMocGF0aC5qb2luKGhhbmRsZXJQYXRoLCAnLycpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAvLyB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJyZWN1cnNpbmcgZG93biAke2hhbmRsZXJQYXRofTogJHtlcnJvcn1gKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgbG9hZFRhc2tzKGRpcj86IHN0cmluZykge1xuICAgIGxldCB0YXNrc0Rpcjogc3RyaW5nO1xuICAgIGlmIChkaXIpIHtcbiAgICAgIHRhc2tzRGlyID0gZGlyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXNrc0RpciA9IHBhdGguam9pbih0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmJhc2VEaXIsICcuL3Rhc2tzLycpO1xuICAgIH1cblxuICAgIGxldCBoYW5kbGVyczogc3RyaW5nW107XG4gICAgdHJ5IHtcbiAgICAgIGhhbmRsZXJzID0gZnMucmVhZGRpclN5bmModGFza3NEaXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4odGFza3NEaXIsIGhhbmRsZXJOYW1lKTtcblxuICAgICAgaWYgKF8uZW5kc1dpdGgoaGFuZGxlck5hbWUsICcudGFzay50cycpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlclNwZWMgPSByZXF1aXJlKGhhbmRsZXJQYXRoKS5kZWZhdWx0O1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXI6IEhhbmRsZXJCYXNlID0gbmV3IGhhbmRsZXJTcGVjKHRoaXMucmVzb3VyY2VzKTtcblxuICAgICAgICAgIGlmIChfLmhhcyh0aGlzLnRhc2tzLCBoYW5kbGVyLnRvcGljKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGVkIHRhc2sgbGlzdGVuZXI6ICR7aGFuZGxlci50b3BpY31gKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhd2FpdCBoYW5kbGVyLmluaXQoKTtcbiAgICAgICAgICB0aGlzLnRhc2tzW2hhbmRsZXIudG9waWNdID0gaGFuZGxlcjtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuZXJyb3IoYEVycm9yIFJlZ2lzdGVyaW5nIEV2ZW50ICR7aGFuZGxlck5hbWV9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIHJlY3Vyc2UgZG93biB0aGUgZGlyZWN0b3J5IHRyZWVcbiAgICAgICAgICBhd2FpdCB0aGlzLmxvYWRUYXNrcyhwYXRoLmpvaW4oaGFuZGxlclBhdGgsICcvJykpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIC8vIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihgRXJyb3IgUnJlY3Vyc2luZyBkb3duICR7aGFuZGxlclBhdGh9OiAke2Vycm9yfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkUm91dGVzKGRpcj86IHN0cmluZykge1xuICAgIGNvbnN0IHRydXN0ZWRFbmRwb2ludHMgPSBbJ2dldCcsICdkZWxldGUnLCAncHV0JywgJ3Bvc3QnXTtcbiAgICBsZXQgcm91dGVzRGlyOiBzdHJpbmc7XG4gICAgaWYgKGRpcikge1xuICAgICAgcm91dGVzRGlyID0gZGlyO1xuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZXNEaXIgPSBwYXRoLmpvaW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5iYXNlRGlyLCAnLi9hcGkvJyk7XG4gICAgfVxuXG4gICAgbGV0IGhhbmRsZXJzOiBzdHJpbmdbXTtcbiAgICB0cnkge1xuICAgICAgaGFuZGxlcnMgPSBmcy5yZWFkZGlyU3luYyhyb3V0ZXNEaXIpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBoYW5kbGVyTmFtZSBvZiBoYW5kbGVycykge1xuICAgICAgY29uc3QgaGFuZGxlclBhdGggPSBwYXRoLmpvaW4ocm91dGVzRGlyLCBoYW5kbGVyTmFtZSk7XG4gICAgICBjb25zdCBtZXRob2QgPSBfLnRvTG93ZXIoaGFuZGxlck5hbWUuc3BsaXQoJy4nKVswXSk7XG5cbiAgICAgIGlmIChfLmVuZHNXaXRoKGhhbmRsZXJOYW1lLCAnLnJvdXRlLnRzJykpIHtcbiAgICAgICAgLy8gc2tpcCBub24gcm91dGUgdHMgZmlsZXNcbiAgICAgICAgLy8gYWxsIHJvdXRlcyBzaG91bGQgZW5kIGluIHJvdXRlLnRzXG4gICAgICAgIC8vIGFsbCByb3V0ZXMgc2hvdWxkIHN0YXJ0IHdpdGggdGhlIEhUVFAgbWV0aG9kIHRvIGltcGxlbWVudCBmb2xsb3dlZCBieSBhIGRvdFxuICAgICAgICAvLyBpbiB0cnVzdGVkRW5kcG9pbnRzIGxpc3RcbiAgICAgICAgLy8gZWc6IHBvc3Qucm91dGUudHNcbiAgICAgICAgLy8gZWc6IGdldC5hbGxCeUJ1c2luZXNzLnJvdXRlLnRzXG4gICAgICAgIGlmIChcbiAgICAgICAgICAhXy5pbmNsdWRlcyh0cnVzdGVkRW5kcG9pbnRzLCBtZXRob2QpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgcm91dGVDbGFzcyA9IHJlcXVpcmUoaGFuZGxlclBhdGgpLmRlZmF1bHQ7XG4gICAgICAgICAgY29uc3Qgcm91dGVJbnN0YW5jZTogQXBpUm91dGUgPSBuZXcgcm91dGVDbGFzcyh0aGlzLnJlc291cmNlcyk7XG5cbiAgICAgICAgICBjb25zdCBhcGlQcmVmaXggPSAnL2FwaSc7XG4gICAgICAgICAgY29uc3Qgcm91dGVVUkwgPSBgJHthcGlQcmVmaXh9JHtyb3V0ZUluc3RhbmNlLnVybH1gO1xuXG4gICAgICAgICAgc3dpdGNoIChtZXRob2QpIHtcbiAgICAgICAgICAgIGNhc2UgJ2dldCc6XG4gICAgICAgICAgICAgIHRoaXMuYXBwLmdldChyb3V0ZVVSTCwgcm91dGVJbnN0YW5jZS5yb3V0ZUNhbGxiYWNrLmJpbmQocm91dGVJbnN0YW5jZSkpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3Bvc3QnOlxuICAgICAgICAgICAgICB0aGlzLmFwcC5wb3N0KHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAncHV0JzpcbiAgICAgICAgICAgICAgdGhpcy5hcHAucHV0KHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgICAgICAgdGhpcy5hcHAuZGVsZXRlKHJvdXRlVVJMLCByb3V0ZUluc3RhbmNlLnJvdXRlQ2FsbGJhY2suYmluZChyb3V0ZUluc3RhbmNlKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCcgIExvYWRlZCByb3V0ZTogJywgbWV0aG9kLCByb3V0ZUluc3RhbmNlLnVybCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBSZWdpc3RlcmluZyBFdmVudCAke2hhbmRsZXJOYW1lfTogJHtlcnJvcn1gKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyByZWN1cnNlIGRvd24gdGhlIGRpcmVjdG9yeSB0cmVlXG4gICAgICAgICAgYXdhaXQgdGhpcy5sb2FkUm91dGVzKHBhdGguam9pbihoYW5kbGVyUGF0aCwgJy8nKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgLy8gdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmVycm9yKGBFcnJvciBScmVjdXJzaW5nIGRvd24gJHtoYW5kbGVyUGF0aH06ICR7ZXJyb3J9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvZ0FwaVJvdXRlID0gKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSwgbmV4dDogTmV4dEZ1bmN0aW9uKSA9PiB7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZyhyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwpO1xuXG4gICAgY29uc3QgY2xlYW51cCA9ICgpID0+IHtcbiAgICAgIHJlcy5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgbG9nRmluaXNoKTtcbiAgICB9O1xuXG4gICAgY29uc3QgbG9nRmluaXNoID0gKCkgPT4ge1xuICAgICAgY2xlYW51cCgpO1xuXG4gICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNTAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNDAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5lcnJvcihyZXEubWV0aG9kLCByZXEub3JpZ2luYWxVcmwsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPCAzMDAgJiYgcmVzLnN0YXR1c0NvZGUgPj0gMjAwKSB7XG4gICAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2cocmVxLm1ldGhvZCwgcmVxLm9yaWdpbmFsVXJsLCByZXMuc3RhdHVzQ29kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKHJlcS5tZXRob2QsIHJlcS5vcmlnaW5hbFVybCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXMub24oJ2ZpbmlzaCcsIGxvZ0ZpbmlzaCk7XG5cbiAgICBuZXh0KCk7XG4gIH1cbn1cbiJdfQ==