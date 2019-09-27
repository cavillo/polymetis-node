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
        });
    }
    initTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('Loading TASKS');
            yield base_1.loadTasks(this.resources, this.tasks);
            if (_.isEmpty(this.tasks)) {
                this.resources.logger.warn('- No tasks loaded...');
            }
            this.resources.logger.info('Tasks initialized');
        });
    }
    initEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('Loading EVENTS');
            yield base_1.loadEvents(this.resources, this.events);
            if (_.isEmpty(this.events)) {
                this.resources.logger.warn('- No events loaded...');
            }
            this.resources.logger.info('Events initialized');
        });
    }
    initRPCs() {
        return __awaiter(this, void 0, void 0, function* () {
            this.resources.logger.info('Loading RPC\'s');
            yield base_1.loadRPC(this.resources, this.rpcs);
            if (_.isEmpty(this.rpcs)) {
                this.resources.logger.warn('- No RPC\'s loaded...');
            }
            this.resources.logger.info('RPC\'s initialized');
        });
    }
    initAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.use(API_1.logApiRoute.bind(this, this.resources));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors_1.default());
            this.resources.logger.info('Loading API routes');
            yield API_1.loadRoutes(this.app, this.resources, this.routes);
            if (_.isEmpty(this.routes)) {
                this.resources.logger.warn('- No routes loaded...');
            }
            yield this.app.listen(this.resources.configuration.api.port);
            this.resources.logger.info('API initialized on port', this.resources.configuration.api.port);
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsNERBQW9DO0FBQ3BDLHFDQUtxQjtBQUNyQixpQ0FJZ0I7QUFDaEIscURBSzZCO0FBYTdCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFxQjtRQUMvQixNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDaEQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxhQUFhLEdBQWtCO1lBQ2pDLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLE9BQU8sRUFBRSx5QkFBVztZQUNwQixNQUFNLEVBQUUsd0JBQVU7WUFDbEIsR0FBRyxFQUFFLHFCQUFPO1NBQ2IsQ0FBQztRQUVGLElBQUksSUFBSSxFQUFFO1lBQ1IsYUFBYSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQ3JCLGFBQWEsRUFDYixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQ3BDLENBQUM7U0FDSDtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDaEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxT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QUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQ3JEO1lBQ0QsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRixDQUFDO0tBQUE7Q0FDRjtBQTNGRCw4QkEyRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBjb3JzIGZyb20gJ2NvcnMnO1xuXG5pbXBvcnQgUmFiYml0IGZyb20gJy4vcmFiYml0JztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi91dGlscy9Mb2dnZXInO1xuaW1wb3J0IHtcbiAgZXhwcmVzcyxcbiAgRXhwcmVzcyxcbiAgbG9hZFJvdXRlcyxcbiAgbG9nQXBpUm91dGUsXG59IGZyb20gJy4vdXRpbHMvQVBJJztcbmltcG9ydCB7XG4gIGxvYWRFdmVudHMsXG4gIGxvYWRUYXNrcyxcbiAgbG9hZFJQQyxcbn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7XG4gIHNlcnZpY2VDb25mLFxuICByYWJiaXRDb25mLFxuICBhcGlDb25mLFxuICBDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL1NlcnZpY2VDb25mJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUmVzb3VyY2VzIHtcbiAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXQ7XG4gIGxvZ2dlcjogTG9nZ2VyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZpY2VPcHRpb25zIHtcbiAgY29uZmlndXJhdGlvbj86IENvbmZpZ3VyYXRpb247XG4gIGxvZ2dlckNhbGxiYWNrPzogRnVuY3Rpb24gfCBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlQmFzZSB7XG4gIHB1YmxpYyBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBhcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogYW55O1xuICBwcm90ZWN0ZWQgdGFza3M6IGFueTtcbiAgcHJvdGVjdGVkIHJvdXRlczogYW55O1xuICBwcm90ZWN0ZWQgcnBjczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM/OiBTZXJ2aWNlT3B0aW9ucykge1xuICAgIGNvbnN0IGNvbmYgPSBfLmdldChvcHRzLCAnY29uZmlndXJhdGlvbicsIG51bGwpO1xuICAgIGNvbnN0IGxvZ2dlckNhbGxiYWNrID0gXy5nZXQob3B0cywgJ2xvZ2dlckNhbGxiYWNrJywgbnVsbCk7XG5cbiAgICBsZXQgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgIGJhc2VEaXI6IF9fZGlybmFtZSxcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2VDb25mLFxuICAgICAgcmFiYml0OiByYWJiaXRDb25mLFxuICAgICAgYXBpOiBhcGlDb25mLFxuICAgIH07XG5cbiAgICBpZiAoY29uZikge1xuICAgICAgY29uZmlndXJhdGlvbiA9IF8ubWVyZ2UoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIF8ucGljayhjb25mLCBfLmtleXMoY29uZmlndXJhdGlvbikpLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlLCBsb2dnZXJDYWxsYmFjayk7XG4gICAgY29uc3QgcmFiYml0ID0gbmV3IFJhYmJpdChjb25maWd1cmF0aW9uLnJhYmJpdCwgdGhpcy5sb2dnZXIpO1xuICAgIHRoaXMucmVzb3VyY2VzID0ge1xuICAgICAgY29uZmlndXJhdGlvbixcbiAgICAgIHJhYmJpdCxcbiAgICAgIGxvZ2dlcjogdGhpcy5sb2dnZXIsXG4gICAgfTtcblxuICAgIHRoaXMuYXBwID0gZXhwcmVzcygpO1xuXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICB0aGlzLnRhc2tzID0ge307XG4gICAgdGhpcy5yb3V0ZXMgPSB7fTtcbiAgICB0aGlzLnJwY3MgPSB7fTtcbiAgfVxuXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSByYWJiaXRcbiAgICBhd2FpdCB0aGlzLnJlc291cmNlcy5yYWJiaXQuaW5pdCgpO1xuICB9XG5cbiAgYXN5bmMgaW5pdFRhc2tzKCkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdMb2FkaW5nIFRBU0tTJyk7XG4gICAgYXdhaXQgbG9hZFRhc2tzKHRoaXMucmVzb3VyY2VzLCB0aGlzLnRhc2tzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMudGFza3MpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyB0YXNrcyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ1Rhc2tzIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBhc3luYyBpbml0RXZlbnRzKCkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdMb2FkaW5nIEVWRU5UUycpO1xuICAgIGF3YWl0IGxvYWRFdmVudHModGhpcy5yZXNvdXJjZXMsIHRoaXMuZXZlbnRzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMuZXZlbnRzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gZXZlbnRzIGxvYWRlZC4uLicpO1xuICAgIH1cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnRXZlbnRzIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBhc3luYyBpbml0UlBDcygpIHtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnTG9hZGluZyBSUENcXCdzJyk7XG4gICAgYXdhaXQgbG9hZFJQQyh0aGlzLnJlc291cmNlcywgdGhpcy5ycGNzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMucnBjcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIFJQQ1xcJ3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdSUENcXCdzIGluaXRpYWxpemVkJyk7XG4gIH1cblxuICBhc3luYyBpbml0QVBJKCkge1xuICAgIHRoaXMuYXBwLnVzZShsb2dBcGlSb3V0ZS5iaW5kKHRoaXMsIHRoaXMucmVzb3VyY2VzKSk7XG4gICAgdGhpcy5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKTtcbiAgICB0aGlzLmFwcC51c2UoY29ycygpKTtcblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdMb2FkaW5nIEFQSSByb3V0ZXMnKTtcbiAgICBhd2FpdCBsb2FkUm91dGVzKHRoaXMuYXBwLCB0aGlzLnJlc291cmNlcywgdGhpcy5yb3V0ZXMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5yb3V0ZXMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyByb3V0ZXMgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuYXBwLmxpc3Rlbih0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnQVBJIGluaXRpYWxpemVkIG9uIHBvcnQnLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgfVxufVxuIl19