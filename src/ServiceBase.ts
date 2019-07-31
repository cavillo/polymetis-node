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
    this.resources.logger.newLine();
    this.resources.logger.log('Loading service EVENTS');
    await loadEvents(this.resources, this.events);
    if (_.isEmpty(this.events)) {
      this.resources.logger.log('- No events loaded...');
    }

    this.resources.logger.newLine();
    this.resources.logger.log('Loading service TASKS');
    await loadTasks(this.resources, this.tasks);
    if (_.isEmpty(this.tasks)) {
      this.resources.logger.log('- No tasks loaded...');
    }

    // RPCs
    this.resources.logger.newLine();
    this.resources.logger.log('Loading service RPC\'s');
    await loadRPC(this.resources, this.rpcs);
    if (_.isEmpty(this.rpcs)) {
      this.resources.logger.log('- No rpcs loaded...');
    }

    // API
    this.app.use(logApiRoute.bind(this, this.resources));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());

    await this.app.listen(
      this.resources.configuration.api.port,
      () => this.resources.logger.log('API listening on port:', this.resources.configuration.api.port),
    );

    this.resources.logger.newLine();
    this.resources.logger.log('Loading service API ROUTES');
    await loadRoutes(this.app, this.resources, this.routes);
    if (_.isEmpty(this.routes)) {
      this.resources.logger.log('- No routes loaded...');
    }

    this.resources.logger.newLine();
    this.resources.logger.ok('Service initialized...');
  }
}
