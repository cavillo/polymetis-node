import * as _ from 'lodash';
import * as bodyParser from 'body-parser';
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
  Configuration,
} from './utils/config';

export interface ServiceResources {
  configuration: Configuration;
  rabbit: Rabbit;
  logger: Logger;
}

export interface ServiceOptions {
  configuration?: Configuration;
  loggerCallback?: Function | null;
}

export default class ServiceBase {
  public configuration: Configuration;
  public logger: Logger;
  public app: Express;
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

    this.app = express();

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

  async initRPCs() {
    await loadRPCs(this);
    if (_.isEmpty(this.rpcs)) {
      this.resources.logger.warn('- No RPC\'s loaded...');
    }
    this.resources.logger.info('RPC\'s initialized');
  }

  async initAPIRoutes() {
    this.app.use(logApiRoute.bind(this, this.resources));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());

    await loadRoutes(this);
    if (_.isEmpty(this.routes)) {
      this.resources.logger.warn('- No routes loaded...');
    }
  }

  async startAPI() {
    await this.app.listen(this.resources.configuration.api.port);
    this.resources.logger.info('API started on port', this.resources.configuration.api.port);
  }

  async initAPI() {
    await this.initAPIRoutes();
    await this.startAPI();
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
    if (_.has(this.rpcs, handler.topic)) {
      throw new Error(`Duplicated rpcs listener: ${handler.topic}`);
    }

    await handler.init();
    this.rpcs[handler.topic] = handler;
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
        this.app.get(routeURL, handler.routeCallback.bind(handler));
        break;
      case 'post':
        this.app.post(routeURL, handler.routeCallback.bind(handler));
        break;
      case 'put':
        this.app.put(routeURL, handler.routeCallback.bind(handler));
        break;
      case 'delete':
        this.app.delete(routeURL, handler.routeCallback.bind(handler));
        break;
    }

    this.routes[`${handler.method}:${handler.url}`] = handler;
    this.resources.logger.info('-[route]', _.toUpper(handler.method), routeURL);
  }
}
