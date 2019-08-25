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
    constructor(conf) {
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
        this.logger = new Logger_1.default(configuration.service);
        const rabbit = new rabbit_1.default(configuration.rabbit, this.logger);
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
            // Events & Tasks
            this.resources.logger.info('Loading EVENTS');
            yield base_1.loadEvents(this.resources, this.events);
            if (_.isEmpty(this.events)) {
                this.resources.logger.warn('- No events loaded...');
            }
            this.resources.logger.info('Loading TASKS');
            yield base_1.loadTasks(this.resources, this.tasks);
            if (_.isEmpty(this.tasks)) {
                this.resources.logger.warn('- No tasks loaded...');
            }
            // RPCs
            this.resources.logger.info('Loading RPC\'s');
            yield base_1.loadRPC(this.resources, this.rpcs);
            if (_.isEmpty(this.rpcs)) {
                this.resources.logger.warn('- No rpcs loaded...');
            }
            // API
            this.app.use(API_1.logApiRoute.bind(this, this.resources));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors_1.default());
            this.resources.logger.info('Loading API ROUTES');
            yield API_1.loadRoutes(this.app, this.resources, this.routes);
            if (_.isEmpty(this.routes)) {
                this.resources.logger.warn('- No routes loaded...');
            }
            else {
                this.resources.logger.info('API listening on port:', this.resources.configuration.api.port);
            }
            yield this.app.listen(this.resources.configuration.api.port);
            this.resources.logger.info('Service initialized...');
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsNERBQW9DO0FBQ3BDLHFDQUtxQjtBQUNyQixpQ0FJZ0I7QUFDaEIscURBSzZCO0FBUTdCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFvQjtRQUM5QixJQUFJLGFBQWEsR0FBa0I7WUFDakMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLHlCQUFXO1lBQ3BCLE1BQU0sRUFBRSx3QkFBVTtZQUNsQixHQUFHLEVBQUUscUJBQU87U0FDYixDQUFDO1FBQ0YsSUFBSSxJQUFJLEVBQUU7WUFDUixhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FDckIsYUFBYSxFQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FDcEMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsYUFBYTtZQUNiLE1BQU07WUFDTixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBTyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLEtB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QyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7S0FBQTtDQUNGO0FBbEZELDhCQWtGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuaW1wb3J0IGNvcnMgZnJvbSAnY29ycyc7XG5cbmltcG9ydCBSYWJiaXQgZnJvbSAnLi9yYWJiaXQnO1xuaW1wb3J0IExvZ2dlciBmcm9tICcuL3V0aWxzL0xvZ2dlcic7XG5pbXBvcnQge1xuICBleHByZXNzLFxuICBFeHByZXNzLFxuICBsb2FkUm91dGVzLFxuICBsb2dBcGlSb3V0ZSxcbn0gZnJvbSAnLi91dGlscy9BUEknO1xuaW1wb3J0IHtcbiAgbG9hZEV2ZW50cyxcbiAgbG9hZFRhc2tzLFxuICBsb2FkUlBDLFxufSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtcbiAgc2VydmljZUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIGFwaUNvbmYsXG4gIENvbmZpZ3VyYXRpb24sXG59IGZyb20gJy4vdXRpbHMvU2VydmljZUNvbmYnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VSZXNvdXJjZXMge1xuICBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xuICByYWJiaXQ6IFJhYmJpdDtcbiAgbG9nZ2VyOiBMb2dnZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2VCYXNlIHtcbiAgcHVibGljIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcbiAgcHVibGljIGFwcDogRXhwcmVzcztcbiAgcHVibGljIHJlc291cmNlczogU2VydmljZVJlc291cmNlcztcblxuICBwcm90ZWN0ZWQgZXZlbnRzOiBhbnk7XG4gIHByb3RlY3RlZCB0YXNrczogYW55O1xuICBwcm90ZWN0ZWQgcm91dGVzOiBhbnk7XG4gIHByb3RlY3RlZCBycGNzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoY29uZj86IENvbmZpZ3VyYXRpb24pIHtcbiAgICBsZXQgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGJhc2VEaXI6IF9fZGlybmFtZSxcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2VDb25mLFxuICAgICAgcmFiYml0OiByYWJiaXRDb25mLFxuICAgICAgYXBpOiBhcGlDb25mLFxuICAgIH07XG4gICAgaWYgKGNvbmYpIHtcbiAgICAgIGNvbmZpZ3VyYXRpb24gPSBfLm1lcmdlKFxuICAgICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgICBfLnBpY2soY29uZiwgXy5rZXlzKGNvbmZpZ3VyYXRpb24pKSxcbiAgICAgICk7XG4gICAgfVxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb247XG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKGNvbmZpZ3VyYXRpb24uc2VydmljZSk7XG4gICAgY29uc3QgcmFiYml0ID0gbmV3IFJhYmJpdChjb25maWd1cmF0aW9uLnJhYmJpdCwgdGhpcy5sb2dnZXIpO1xuICAgIHRoaXMucmVzb3VyY2VzID0ge1xuICAgICAgY29uZmlndXJhdGlvbixcbiAgICAgIHJhYmJpdCxcbiAgICAgIGxvZ2dlcjogdGhpcy5sb2dnZXIsXG4gICAgfTtcblxuICAgIHRoaXMuYXBwID0gZXhwcmVzcygpO1xuXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICB0aGlzLnRhc2tzID0ge307XG4gICAgdGhpcy5yb3V0ZXMgPSB7fTtcbiAgICB0aGlzLnJwY3MgPSB7fTtcbiAgfVxuXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSByYWJiaXRcbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yYWJiaXQuaW5pdCgpO1xuXG4gICAgLy8gRXZlbnRzICYgVGFza3NcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnTG9hZGluZyBFVkVOVFMnKTtcbiAgICBhd2FpdCBsb2FkRXZlbnRzKHRoaXMucmVzb3VyY2VzLCB0aGlzLmV2ZW50cyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLmV2ZW50cykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIGV2ZW50cyBsb2FkZWQuLi4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnTG9hZGluZyBUQVNLUycpO1xuICAgIGF3YWl0IGxvYWRUYXNrcyh0aGlzLnJlc291cmNlcywgdGhpcy50YXNrcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnRhc2tzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gdGFza3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuXG4gICAgLy8gUlBDc1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdMb2FkaW5nIFJQQ1xcJ3MnKTtcbiAgICBhd2FpdCBsb2FkUlBDKHRoaXMucmVzb3VyY2VzLCB0aGlzLnJwY3MpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ycGNzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gcnBjcyBsb2FkZWQuLi4nKTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICB0aGlzLmFwcC51c2UobG9nQXBpUm91dGUuYmluZCh0aGlzLCB0aGlzLnJlc291cmNlcykpO1xuICAgIHRoaXMuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XG4gICAgdGhpcy5hcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiBmYWxzZSB9KSk7XG4gICAgdGhpcy5hcHAudXNlKGNvcnMoKSk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnTG9hZGluZyBBUEkgUk9VVEVTJyk7XG4gICAgYXdhaXQgbG9hZFJvdXRlcyh0aGlzLmFwcCwgdGhpcy5yZXNvdXJjZXMsIHRoaXMucm91dGVzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMucm91dGVzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gcm91dGVzIGxvYWRlZC4uLicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnQVBJIGxpc3RlbmluZyBvbiBwb3J0OicsIHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLmFwcC5saXN0ZW4odGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCk7XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnU2VydmljZSBpbml0aWFsaXplZC4uLicpO1xuICB9XG59XG4iXX0=