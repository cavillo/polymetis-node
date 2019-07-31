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
                yield this.app.listen(this.resources.configuration.api.port);
                this.resources.logger.info('API listening on port:', this.resources.configuration.api.port);
            }
            this.resources.logger.info('Service initialized...');
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsNERBQW9DO0FBQ3BDLHFDQUtxQjtBQUNyQixpQ0FJZ0I7QUFDaEIscURBSzZCO0FBUTdCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFvQjtRQUM5QixJQUFJLGFBQWEsR0FBa0I7WUFDakMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLHlCQUFXO1lBQ3BCLE1BQU0sRUFBRSx3QkFBVTtZQUNsQixHQUFHLEVBQUUscUJBQU87U0FDYixDQUFDO1FBQ0YsSUFBSSxJQUFJLEVBQUU7WUFDUixhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FDckIsYUFBYSxFQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FDcEMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsYUFBYTtZQUNiLE1BQU07WUFDTixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBTyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLEtB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QUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUN2RCxDQUFDO0tBQUE7Q0FDRjtBQWxGRCw4QkFrRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgKiBhcyBib2R5UGFyc2VyIGZyb20gJ2JvZHktcGFyc2VyJztcbmltcG9ydCBjb3JzIGZyb20gJ2NvcnMnO1xuXG5pbXBvcnQgUmFiYml0IGZyb20gJy4vcmFiYml0JztcbmltcG9ydCBMb2dnZXIgZnJvbSAnLi91dGlscy9Mb2dnZXInO1xuaW1wb3J0IHtcbiAgZXhwcmVzcyxcbiAgRXhwcmVzcyxcbiAgbG9hZFJvdXRlcyxcbiAgbG9nQXBpUm91dGUsXG59IGZyb20gJy4vdXRpbHMvQVBJJztcbmltcG9ydCB7XG4gIGxvYWRFdmVudHMsXG4gIGxvYWRUYXNrcyxcbiAgbG9hZFJQQyxcbn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7XG4gIHNlcnZpY2VDb25mLFxuICByYWJiaXRDb25mLFxuICBhcGlDb25mLFxuICBDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL1NlcnZpY2VDb25mJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUmVzb3VyY2VzIHtcbiAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXQ7XG4gIGxvZ2dlcjogTG9nZ2VyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlQmFzZSB7XG4gIHB1YmxpYyBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBhcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogYW55O1xuICBwcm90ZWN0ZWQgdGFza3M6IGFueTtcbiAgcHJvdGVjdGVkIHJvdXRlczogYW55O1xuICBwcm90ZWN0ZWQgcnBjczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmY/OiBDb25maWd1cmF0aW9uKSB7XG4gICAgbGV0IGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICBiYXNlRGlyOiBfX2Rpcm5hbWUsXG4gICAgICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgICAgIHJhYmJpdDogcmFiYml0Q29uZixcbiAgICAgIGFwaTogYXBpQ29uZixcbiAgICB9O1xuICAgIGlmIChjb25mKSB7XG4gICAgICBjb25maWd1cmF0aW9uID0gXy5tZXJnZShcbiAgICAgICAgY29uZmlndXJhdGlvbixcbiAgICAgICAgXy5waWNrKGNvbmYsIF8ua2V5cyhjb25maWd1cmF0aW9uKSksXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihjb25maWd1cmF0aW9uLnNlcnZpY2UpO1xuICAgIGNvbnN0IHJhYmJpdCA9IG5ldyBSYWJiaXQoY29uZmlndXJhdGlvbi5yYWJiaXQsIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnJlc291cmNlcyA9IHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICByYWJiaXQsXG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgIH07XG5cbiAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcblxuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMucm91dGVzID0ge307XG4gICAgdGhpcy5ycGNzID0ge307XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmFiYml0XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcblxuICAgIC8vIEV2ZW50cyAmIFRhc2tzXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgRVZFTlRTJyk7XG4gICAgYXdhaXQgbG9hZEV2ZW50cyh0aGlzLnJlc291cmNlcywgdGhpcy5ldmVudHMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ldmVudHMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIud2FybignLSBObyBldmVudHMgbG9hZGVkLi4uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgVEFTS1MnKTtcbiAgICBhd2FpdCBsb2FkVGFza3ModGhpcy5yZXNvdXJjZXMsIHRoaXMudGFza3MpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy50YXNrcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHRhc2tzIGxvYWRlZC4uLicpO1xuICAgIH1cblxuICAgIC8vIFJQQ3NcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnTG9hZGluZyBSUENcXCdzJyk7XG4gICAgYXdhaXQgbG9hZFJQQyh0aGlzLnJlc291cmNlcywgdGhpcy5ycGNzKTtcbiAgICBpZiAoXy5pc0VtcHR5KHRoaXMucnBjcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHJwY3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuXG4gICAgLy8gQVBJXG4gICAgdGhpcy5hcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuICAgIHRoaXMuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xuICAgIHRoaXMuYXBwLnVzZShjb3JzKCkpO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0xvYWRpbmcgQVBJIFJPVVRFUycpO1xuICAgIGF3YWl0IGxvYWRSb3V0ZXModGhpcy5hcHAsIHRoaXMucmVzb3VyY2VzLCB0aGlzLnJvdXRlcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJvdXRlcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci53YXJuKCctIE5vIHJvdXRlcyBsb2FkZWQuLi4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5hcHAubGlzdGVuKHRoaXMucmVzb3VyY2VzLmNvbmZpZ3VyYXRpb24uYXBpLnBvcnQpO1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmluZm8oJ0FQSSBsaXN0ZW5pbmcgb24gcG9ydDonLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIuaW5mbygnU2VydmljZSBpbml0aWFsaXplZC4uLicpO1xuICB9XG59XG4iXX0=