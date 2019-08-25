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

export default class ServiceBase {
  public configuration: Configuration;
  public logger: Logger;
  public app: Express;
  public resources: ServiceResources;

  protected events: any;
  protected tasks: any;
  protected routes: any;
  protected rpcs: any;

  constructor(conf?: Configuration) {
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
    this.logger = new Logger(configuration.service);
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

    // Events & Tasks
    this.resources.logger.info('Loading EVENTS');
    await loadEvents(this.resources, this.events);
    if (_.isEmpty(this.events)) {
      this.resources.logger.warn('- No events loaded...');
    }

    this.resources.logger.info('Loading TASKS');
    await loadTasks(this.resources, this.tasks);
    if (_.isEmpty(this.tasks)) {
      this.resources.logger.warn('- No tasks loaded...');
    }

    // RPCs
    this.resources.logger.info('Loading RPC\'s');
    await loadRPC(this.resources, this.rpcs);
    if (_.isEmpty(this.rpcs)) {
      this.resources.logger.warn('- No rpcs loaded...');
    }

    // API
    this.app.use(logApiRoute.bind(this, this.resources));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());

    this.resources.logger.info('Loading API ROUTES');
    await loadRoutes(this.app, this.resources, this.routes);
    if (_.isEmpty(this.routes)) {
      this.resources.logger.warn('- No routes loaded...');
    } else {
      this.resources.logger.info('API listening on port:', this.resources.configuration.api.port);
    }
    await this.app.listen(this.resources.configuration.api.port);

    this.resources.logger.info('Service initialized...');
  }
}
