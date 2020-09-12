import _ from 'lodash';
import cors from 'cors';

import Rabbit from './rabbit';
import { Logger } from './utils/logger';
import {
  express,
  Express,
  logApiRoute,
} from './utils/api';
import {
  loadEvents,
  loadTasks,
  loadRPCs,
  loadRoutes,
} from './utils/loaders';
import {
  EventHandlerBase,
  TaskHandlerBase,
  RPCHandlerBase,
  RouteHandlerBase,
} from './handlers';
import {
  serviceConf,
  rabbitConf,
  apiConf,
  rpcConf,
  Configuration,
} from './utils/config';

export interface ServiceResources {
  configuration: Configuration;
  rabbit: Rabbit;
  logger: Logger;
}

export interface ServiceOptions {
  configuration?: Partial<Configuration>;
  loggerCallback?: Function | null;
}

export default class ServiceBase {
  public configuration: Configuration;
  public logger: Logger;
  public apiApp: Express;
  public rpcApp: Express;
  public resources: ServiceResources;

  protected events: any;
  protected tasks: any;
  protected routes: any;
  protected rpcs: any;

  constructor(opts?: ServiceOptions) {
    const conf = _.get(opts, 'configuration', null);
    const loggerCallback = _.get(opts, 'loggerCallback', null);

    let configuration: Configuration = {
      baseDir: __dirname,
      service: serviceConf,
      rabbit: rabbitConf,
      api: apiConf,
      rpc: rpcConf,
    };

    if (conf) {
      configuration = _.merge(
        configuration,
        _.pick(conf, _.keys(configuration)),
      );
    }
    this.configuration = configuration;
    this.logger = new Logger(configuration.service, loggerCallback);

    const rabbit = new Rabbit(configuration, this.logger);
    this.resources = {
      configuration,
      rabbit,
      logger: this.logger,
    };

    // API APP
    this.apiApp = express();
    this.apiApp.use(logApiRoute.bind(this, this.resources));

    // RPC APP
    this.rpcApp = express();
    this.rpcApp.use(logApiRoute.bind(this, this.resources));
    this.rpcApp.use(express.json());
    this.rpcApp.use(express.urlencoded({ extended: true }));
    this.rpcApp.use(cors());

    this.events = {};
    this.tasks = {};
    this.routes = {};
    this.rpcs = {};
  }

  async init() {
    // Initialize rabbit
    await this.resources.rabbit.init();
  }

  async initTasks() {
    await loadTasks(this);
    if (_.isEmpty(this.tasks)) {
      this.resources.logger.warn('- No tasks loaded...');
    }
    this.resources.logger.info('Tasks initialized');
  }

  async initEvents() {
    await loadEvents(this);
    if (_.isEmpty(this.events)) {
      this.resources.logger.warn('- No events loaded...');
    }
    this.resources.logger.info('Events initialized');
  }

  async initRPCProcedures() {
    await loadRPCs(this);
    if (_.isEmpty(this.rpcs)) {
      this.resources.logger.warn('- No RPC\'s loaded...');
    }
  }

  async initAPIRoutes() {
    await loadRoutes(this);
    if (_.isEmpty(this.routes)) {
      this.resources.logger.warn('- No routes loaded...');
    }
  }

  async startAPI() {
    await this.apiApp.listen(this.resources.configuration.api.port);
    this.resources.logger.info('API started on port', this.resources.configuration.api.port);
  }

  async startRPCs() {
    await this.rpcApp.listen(this.resources.configuration.rpc.port);
    this.resources.logger.info('RPCs started on port', this.resources.configuration.rpc.port);
  }

  async initAPI() {
    await this.initAPIRoutes();
    await this.startAPI();
  }

  async initRPCs() {
    await this.initRPCProcedures();
    await this.startRPCs();
  }

  async loadEvent(handler: EventHandlerBase): Promise<void> {
    if (_.has(this.events, handler.topic)) {
      throw new Error(`Duplicated event listener: ${handler.topic}`);
    }

    await handler.init();
    this.events[handler.topic] = handler;
  }

  async loadTask(handler: TaskHandlerBase): Promise<void> {
    if (_.has(this.tasks, handler.topic)) {
      throw new Error(`Duplicated task listener: ${handler.topic}`);
    }

    await handler.init();
    this.tasks[handler.topic] = handler;
  }

  async loadRPC(handler: RPCHandlerBase): Promise<void> {
    const rpcId = handler.procedure;
    if (_.has(this.rpcs, rpcId)) {
      throw new Error(`Duplicated RPC route listener: ${rpcId}`);
    }

    const rpcBaseRoute = _.isEmpty(this.resources.configuration.rpc.baseRoute) ? '' : this.resources.configuration.rpc.baseRoute;
    const routeURL = `${rpcBaseRoute}/${handler.procedure}`;

    this.rpcApp.post(routeURL, handler.routeCallback.bind(handler));

    this.rpcs[rpcId] = handler;
    this.resources.logger.info('-[rpc]', routeURL);
  }

  async loadRoute(handler: RouteHandlerBase): Promise<void> {
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
  }
}
