import * as _ from 'lodash';
import * as bodyParser from 'body-parser';
import cors from 'cors';

import Rabbit from './rabbit';
import Logger from './utils/Logger';
import {
  express,
  Express,
  loadRoutes,
  logApiRoute,
} from './utils/API';
import {
  loadEvents,
  loadTasks,
  loadRPC,
} from './base';
import {
  serviceConf,
  rabbitConf,
  apiConf,
  Configuration,
} from './utils/ServiceConf';

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
    const rabbit = new Rabbit(configuration.rabbit, this.logger);
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
    this.resources.logger.info('Loading TASKS');
    await loadTasks(this.resources, this.tasks);
    if (_.isEmpty(this.tasks)) {
      this.resources.logger.warn('- No tasks loaded...');
    }
    this.resources.logger.info('Tasks initialized');
  }

  async initEvents() {
    this.resources.logger.info('Loading EVENTS');
    await loadEvents(this.resources, this.events);
    if (_.isEmpty(this.events)) {
      this.resources.logger.warn('- No events loaded...');
    }
    this.resources.logger.info('Events initialized');
  }

  async initRPCs() {
    this.resources.logger.info('Loading RPC\'s');
    await loadRPC(this.resources, this.rpcs);
    if (_.isEmpty(this.rpcs)) {
      this.resources.logger.warn('- No RPC\'s loaded...');
    }
    this.resources.logger.info('RPC\'s initialized');
  }

  async initAPI() {
    this.app.use(logApiRoute.bind(this, this.resources));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());

    this.resources.logger.info('Loading API routes');
    await loadRoutes(this.app, this.resources, this.routes);
    if (_.isEmpty(this.routes)) {
      this.resources.logger.warn('- No routes loaded...');
    }
    await this.app.listen(this.resources.configuration.api.port);
    this.resources.logger.info('API initialized on port', this.resources.configuration.api.port);
  }
}
