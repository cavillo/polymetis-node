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
exports.Logger = Logger_1.default;
const api_1 = require("./api");
const handlers_1 = require("./handlers");
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
        this.app = api_1.express();
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
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service EVENTS');
            yield handlers_1.loadEvents(this.resources, this.events);
            if (_.isEmpty(this.events)) {
                this.resources.logger.log('- No events loaded...');
            }
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service TASKS');
            yield handlers_1.loadTasks(this.resources, this.tasks);
            if (_.isEmpty(this.tasks)) {
                this.resources.logger.log('- No tasks loaded...');
            }
            // RPCs
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service RPC\'s');
            yield handlers_1.loadRPC(this.resources, this.rpcs);
            if (_.isEmpty(this.rpcs)) {
                this.resources.logger.log('- No rpcs loaded...');
            }
            // API
            this.app.use(api_1.logApiRoute.bind(this, this.resources));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(cors_1.default());
            yield this.app.listen(this.resources.configuration.api.port, () => this.resources.logger.log('API listening on port:', this.resources.configuration.api.port));
            this.resources.logger.newLine();
            this.resources.logger.log('Loading service API ROUTES');
            yield api_1.loadRoutes(this.app, this.resources, this.routes);
            if (_.isEmpty(this.routes)) {
                this.resources.logger.log('- No routes loaded...');
            }
            this.resources.logger.newLine();
            this.resources.logger.ok('Service initialized...');
        });
    }
}
exports.default = ServiceBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZUJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU2VydmljZUJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsd0RBQTBDO0FBQzFDLGdEQUF3QjtBQUV4QixzREFBOEI7QUFDOUIsNERBQW9DO0FBMEhsQyxpQkExSEssZ0JBQU0sQ0EwSEw7QUF6SFIsK0JBS2U7QUFDZix5Q0FJb0I7QUFDcEIscURBUTZCO0FBUTdCLE1BQXFCLFdBQVc7SUFXOUIsWUFBWSxJQUFvQjtRQUM5QixJQUFJLGFBQWEsR0FBa0I7WUFDakMsT0FBTyxFQUFFLFNBQVM7WUFDbEIsT0FBTyxFQUFFLHlCQUFXO1lBQ3BCLE1BQU0sRUFBRSx3QkFBVTtZQUNsQixHQUFHLEVBQUUscUJBQU87U0FDYixDQUFDO1FBQ0YsSUFBSSxJQUFJLEVBQUU7WUFDUixhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FDckIsYUFBYSxFQUNiLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FDcEMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsU0FBUyxHQUFHO1lBQ2YsYUFBYTtZQUNiLE1BQU07WUFDTixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQztRQUVGLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBTyxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFF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QUFDO1lBQ3hELE1BQU0sZ0JBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO2FBQ3BEO1lBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDckQsQ0FBQztLQUFBO0NBQ0Y7QUF6RkQsOEJBeUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcblxuaW1wb3J0IFJhYmJpdCBmcm9tICcuL3JhYmJpdCc7XG5pbXBvcnQgTG9nZ2VyIGZyb20gJy4vdXRpbHMvTG9nZ2VyJztcbmltcG9ydCB7XG4gIGV4cHJlc3MsXG4gIEV4cHJlc3MsXG4gIGxvYWRSb3V0ZXMsXG4gIGxvZ0FwaVJvdXRlLFxufSBmcm9tICcuL2FwaSc7XG5pbXBvcnQge1xuICBsb2FkRXZlbnRzLFxuICBsb2FkVGFza3MsXG4gIGxvYWRSUEMsXG59IGZyb20gJy4vaGFuZGxlcnMnO1xuaW1wb3J0IHtcbiAgc2VydmljZUNvbmYsXG4gIHJhYmJpdENvbmYsXG4gIGFwaUNvbmYsXG4gIENvbmZpZ3VyYXRpb24sXG4gIFNlcnZpY2VDb25maWd1cmF0aW9uLFxuICBSYWJiaXRDb25maWd1cmF0aW9uLFxuICBBcGlDb25maWd1cmF0aW9uLFxufSBmcm9tICcuL3V0aWxzL1NlcnZpY2VDb25mJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXJ2aWNlUmVzb3VyY2VzIHtcbiAgY29uZmlndXJhdGlvbjogQ29uZmlndXJhdGlvbjtcbiAgcmFiYml0OiBSYWJiaXQ7XG4gIGxvZ2dlcjogTG9nZ2VyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlQmFzZSB7XG4gIHB1YmxpYyBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uO1xuICBwdWJsaWMgbG9nZ2VyOiBMb2dnZXI7XG4gIHB1YmxpYyBhcHA6IEV4cHJlc3M7XG4gIHB1YmxpYyByZXNvdXJjZXM6IFNlcnZpY2VSZXNvdXJjZXM7XG5cbiAgcHJvdGVjdGVkIGV2ZW50czogYW55O1xuICBwcm90ZWN0ZWQgdGFza3M6IGFueTtcbiAgcHJvdGVjdGVkIHJvdXRlczogYW55O1xuICBwcm90ZWN0ZWQgcnBjczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmY/OiBDb25maWd1cmF0aW9uKSB7XG4gICAgbGV0IGNvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICBiYXNlRGlyOiBfX2Rpcm5hbWUsXG4gICAgICBzZXJ2aWNlOiBzZXJ2aWNlQ29uZixcbiAgICAgIHJhYmJpdDogcmFiYml0Q29uZixcbiAgICAgIGFwaTogYXBpQ29uZixcbiAgICB9O1xuICAgIGlmIChjb25mKSB7XG4gICAgICBjb25maWd1cmF0aW9uID0gXy5tZXJnZShcbiAgICAgICAgY29uZmlndXJhdGlvbixcbiAgICAgICAgXy5waWNrKGNvbmYsIF8ua2V5cyhjb25maWd1cmF0aW9uKSksXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uO1xuICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcihjb25maWd1cmF0aW9uLnNlcnZpY2UpO1xuICAgIGNvbnN0IHJhYmJpdCA9IG5ldyBSYWJiaXQoY29uZmlndXJhdGlvbi5yYWJiaXQsIHRoaXMubG9nZ2VyKTtcbiAgICB0aGlzLnJlc291cmNlcyA9IHtcbiAgICAgIGNvbmZpZ3VyYXRpb24sXG4gICAgICByYWJiaXQsXG4gICAgICBsb2dnZXI6IHRoaXMubG9nZ2VyLFxuICAgIH07XG5cbiAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcblxuICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgdGhpcy50YXNrcyA9IHt9O1xuICAgIHRoaXMucm91dGVzID0ge307XG4gICAgdGhpcy5ycGNzID0ge307XG4gIH1cblxuICBhc3luYyBpbml0KCkge1xuICAgIC8vIEluaXRpYWxpemUgcmFiYml0XG4gICAgYXdhaXQgdGhpcy5yZXNvdXJjZXMucmFiYml0LmluaXQoKTtcblxuICAgIC8vIEV2ZW50cyAmIFRhc2tzXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLm5ld0xpbmUoKTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCdMb2FkaW5nIHNlcnZpY2UgRVZFTlRTJyk7XG4gICAgYXdhaXQgbG9hZEV2ZW50cyh0aGlzLnJlc291cmNlcywgdGhpcy5ldmVudHMpO1xuICAgIGlmIChfLmlzRW1wdHkodGhpcy5ldmVudHMpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCctIE5vIGV2ZW50cyBsb2FkZWQuLi4nKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubmV3TGluZSgpO1xuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJ0xvYWRpbmcgc2VydmljZSBUQVNLUycpO1xuICAgIGF3YWl0IGxvYWRUYXNrcyh0aGlzLnJlc291cmNlcywgdGhpcy50YXNrcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnRhc2tzKSkge1xuICAgICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLmxvZygnLSBObyB0YXNrcyBsb2FkZWQuLi4nKTtcbiAgICB9XG5cbiAgICAvLyBSUENzXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLm5ld0xpbmUoKTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCdMb2FkaW5nIHNlcnZpY2UgUlBDXFwncycpO1xuICAgIGF3YWl0IGxvYWRSUEModGhpcy5yZXNvdXJjZXMsIHRoaXMucnBjcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJwY3MpKSB7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCctIE5vIHJwY3MgbG9hZGVkLi4uJyk7XG4gICAgfVxuXG4gICAgLy8gQVBJXG4gICAgdGhpcy5hcHAudXNlKGxvZ0FwaVJvdXRlLmJpbmQodGhpcywgdGhpcy5yZXNvdXJjZXMpKTtcbiAgICB0aGlzLmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuICAgIHRoaXMuYXBwLnVzZShib2R5UGFyc2VyLnVybGVuY29kZWQoeyBleHRlbmRlZDogZmFsc2UgfSkpO1xuICAgIHRoaXMuYXBwLnVzZShjb3JzKCkpO1xuXG4gICAgYXdhaXQgdGhpcy5hcHAubGlzdGVuKFxuICAgICAgdGhpcy5yZXNvdXJjZXMuY29uZmlndXJhdGlvbi5hcGkucG9ydCxcbiAgICAgICgpID0+IHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJ0FQSSBsaXN0ZW5pbmcgb24gcG9ydDonLCB0aGlzLnJlc291cmNlcy5jb25maWd1cmF0aW9uLmFwaS5wb3J0KSxcbiAgICApO1xuXG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLm5ld0xpbmUoKTtcbiAgICB0aGlzLnJlc291cmNlcy5sb2dnZXIubG9nKCdMb2FkaW5nIHNlcnZpY2UgQVBJIFJPVVRFUycpO1xuICAgIGF3YWl0IGxvYWRSb3V0ZXModGhpcy5hcHAsIHRoaXMucmVzb3VyY2VzLCB0aGlzLnJvdXRlcyk7XG4gICAgaWYgKF8uaXNFbXB0eSh0aGlzLnJvdXRlcykpIHtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5sb2coJy0gTm8gcm91dGVzIGxvYWRlZC4uLicpO1xuICAgIH1cblxuICAgIHRoaXMucmVzb3VyY2VzLmxvZ2dlci5uZXdMaW5lKCk7XG4gICAgdGhpcy5yZXNvdXJjZXMubG9nZ2VyLm9rKCdTZXJ2aWNlIGluaXRpYWxpemVkLi4uJyk7XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgQ29uZmlndXJhdGlvbixcbiAgRXhwcmVzcyxcbiAgTG9nZ2VyLFxuICBTZXJ2aWNlQ29uZmlndXJhdGlvbixcbiAgUmFiYml0Q29uZmlndXJhdGlvbixcbiAgQXBpQ29uZmlndXJhdGlvbixcbn07XG4iXX0=