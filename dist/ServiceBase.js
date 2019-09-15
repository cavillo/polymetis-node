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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsNERBQW9DO0FBQ3BDLHFDQUtxQjtBQUNyQixpQ0FJZ0I7QUFDaEIscURBSzZCO0FBUTdCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFvQjtRQUM5QixJQUFJLGFBQWEsR0FBa0I7WUFDakMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLHlCQUFXO1lBQ3BCLE1BQU0sRUFBRSx3QkFBVTtZQUNsQixHQUFHLEVBQUUscUJBQU87U0FDYixDQUFDO1FBQ0YsSUFBSSxJQUFJLEVBQUU7WUFDUixhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FDckIsYUFBYSxFQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FDcEMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsYUFBYTtZQUNiLE1BQU07WUFDTixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBTyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLEtB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QUMsdUJBQXVCLENBQUMsQ0FBQzthQUNyRDtZQUNELE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0YsQ0FBQztLQUFBO0NBQ0Y7QUF2RkQsOEJBdUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IFJhYmJpdCBmcm9tICcuL3JhYmJpdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vdXRpbHMvTG9nZ2VyJztcbmltcG9ydCB7XG4gIGV4cHJlc3MsXG4gIEV4cHJlc3MsXG4gIGxvYWRSb3V0ZXMsXG4gIGxvZ0FwaVJvdXRlLFxufSBmcm9tICcuL3V0aWxzL0FQSSc7XG5pbXBvcnQge1xuICBsb2FkRXZlbnRzLFxuICBsb2FkVGFza3MsXG4gIGxvYWRSUEMsXG59IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge1xuICBzZXJ2aWNlQ29uZixcbiAgcmFiYml0Q29uZixcbiAgYXBpQ29uZixcbiAgQ29uZmlndXJhdGlvbixcbn0gZnJvbSAnLi91dGlscy9TZXJ2aWNlQ29uZic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VydmljZVJlc291cmNlcyB7XG4gIGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb247XG4gIHJhYmJpdDogUmFiYml0O1xuICBsb2dnZXI6IExvZ2dlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZUJhc2Uge1xuICBwdWJsaWMgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcHVibGljIGxvZ2dlcjogTG9nZ2VyO1xuICBwdWJsaWMgYXBwOiBFeHByZXNzO1xuICBwdWJsaWMgcmVzb3VyY2VzOiBTZXJ2aWNlUmVzb3VyY2VzO1xuXG4gIHByb3RlY3RlZCBldmVudHM6IGFueTtcbiAgcHJvdGVjdGVkIHRhc2tzOiBhbnk7XG4gIHByb3RlY3RlZCByb3V0ZXM6IGFueTtcbiAgcHJvdGVjdGVkIHJwY3M6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25mPzogQ29uZmlndXJhdGlvbikge1xuICAgIGxldCBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uID0ge1xuICAgICAgYmFzZURpcjogX19kaXJuYW1lLFxuICAgICAgc2VydmljZTogc2VydmljZUNvbmYsXG4gICAgICByYWJiaXQ6IHJhYmJpdENvbmYsXG4gICAgICBhcGk6IGFwaUNvbmYsXG4gICAgfTtcbiAgICBpZiAoY29uZikge1xuICAgICAgY29uZmlndXJhdGlvbiA9IF8ubWVyZ2UoXG4gICAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICAgIF8ucGljayhjb25mLCBfLmtleXMoY29uZmlndXJhdGlvbikpLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoY29uZmlndXJhdGlvbi5zZXJ2aWNlKTtcbiAgICBjb25zdCByYWJiaXQgPSBuZXcgUmFiYml0KGNvbmZpZ3VyYXRpb24ucmFiYml0LCB0aGlzLmxvZ2dlcik7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSB7XG4gICAgICBjb25maWd1cmF0aW9uLFxuICAgICAgcmFiYml0LFxuICAgICAgbG9nZ2VyOiB0aGlzLmxvZ2dlcixcbiAgICB9O1xuXG4gICAgdGhpcy5hcHAgPSBleHByZXNzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIHRoaXMudGFza3MgPSB7fTtcbiAgICB0aGlzLnJvdXRlcyA9IHt9O1xuICAgIHRoaXMucnBjcyA9IHt9O1xuICB9XG5cbiAgYXN5bmMgaW5pdCgpIHtcbiAgICAvLyBJbml0aWFsaXplIHJhYmJpdFxuICAgIGF3YWl0IHRoaXMucmVzb3VyY2VzLnJhYmJpdC5pbml0KCk7XG4gIH1cblxuICBhc3luYyBpbml0VGFza3MoKSB7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgVEFTS1MnKTtcbiAgICBhd2FpdCBsb2FkVGFza3ModGhpcy5yZXNvdXJjZXMsIHRoaXMudGFza3MpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy50YXNrcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHRhc2tzIGxvYWRlZC4uLicpO1xuICAgIH1cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnVGFza3MgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRFdmVudHMoKSB7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgRVZFTlRTJyk7XG4gICAgYXdhaXQgbG9hZEV2ZW50cyh0aGlzLnJlc291cmNlcywgdGhpcy5ldmVudHMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ldmVudHMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyBldmVudHMgbG9hZGVkLi4uJyk7XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdFdmVudHMgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRSUENzKCkge1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdMb2FkaW5nIFJQQ1xcJ3MnKTtcbiAgICBhd2FpdCBsb2FkUlBDKHRoaXMucmVzb3VyY2VzLCB0aGlzLnJwY3MpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ycGNzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLndhcm4oJy0gTm8gUlBDXFwncyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ1JQQ1xcJ3MgaW5pdGlhbGl6ZWQnKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRBUEkoKSB7XG4gICAgdGhpcy5hcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuICAgIHRoaXMuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xuICAgIHRoaXMuYXBwLnVzZShjb3JzKCkpO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgQVBJIHJvdXRlcycpO1xuICAgIGF3YWl0IGxvYWRSb3V0ZXModGhpcy5hcHAsIHRoaXMucmVzb3VyY2VzLCB0aGlzLnJvdXRlcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJvdXRlcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHJvdXRlcyBsb2FkZWQuLi4nKTtcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5hcHAubGlzdGVuKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5pbmZvKCdBUEkgaW5pdGlhbGl6ZWQgb24gcG9ydCcsIHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpO1xuICB9XG59XG4iXX0=