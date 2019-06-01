import * as _ from 'lodash';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import cors from 'cors';

export {
  Configuration,
  Response,
  Request,
}

import {
  serviceConf,
  rabbitConf,
  mongoConf,
  apiConf,
  redisConf,
  postgresConf,
  Configuration,
} from './utils/ServiceConf';
import HandlerBase from './handlers/HandlerBase';
import Rabbit from './rabbit/Rabbit';
import Mongo from './mongo/Mongo';
import Postgres from './postgres';
import Logger from './utils/Logger';
import ApiRoute from './api/ApiRoute';
import Redis from './redisService';

export interface ServiceResources {
  configuration: Configuration;
  rabbit: Rabbit;
  logger: Logger;
  mongo: Mongo;
  redis: Redis;
  pg: Postgres;
}

export default class ServiceBase {
  public logger: Logger;
  protected resources: ServiceResources;
  protected app: Express;

  protected events: any;
  protected tasks: any;
  protected routes: any;

  constructor(conf?: Configuration | any) {
    let configuration: Configuration = {
      baseDir: __dirname,
      service: serviceConf,
      rabbit: rabbitConf,
      mongo: mongoConf,
      api: apiConf,
      redis: redisConf,
      postgres: postgresConf,
    };
    if (conf) {
      configuration = {
        ...configuration,
        ..._.pick(conf, _.keys(configuration)),
      };
    }
    this.logger = new Logger(configuration.service);
    const rabbit = new Rabbit(configuration.rabbit, this.logger);
    const mongo = new Mongo(configuration.mongo, this.logger);
    const redis = new Redis(configuration, this.logger);
    const pg = new Postgres(configuration.postgres, this.logger);
    this.resources = {
      configuration,
      rabbit,
      mongo,
      redis,
      pg,
      logger: this.logger,
    };

    this.app = express();

    this.events = {};
    this.tasks = {};
    this.routes = {};
  }

  async init() {
    // Initialize infrastructure services
    await this.resources.rabbit.init();
    await this.resources.mongo.init();
    await this.resources.pg.init();

    // Events & Tasks
    await this.loadEvents();
    await this.loadTasks();

    // API
    this.app.use(this.logApiRoute.bind(this));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    await this.loadRoutes();
    await this.app.listen(
      this.resources.configuration.api.port,
      () => this.resources.logger.log('API listening on port:', this.resources.configuration.api.port),
    );

    this.resources.logger.ok('Service initialized...');
  }

  private async loadEvents(dir?: string) {
    let eventsDir: string;
    if (dir) {
      eventsDir = dir;
    } else {
      eventsDir = path.join(this.resources.configuration.baseDir, './events/');
    }

    let handlers: string[];
    try {
      handlers = fs.readdirSync(eventsDir);
    } catch (error) {
      return;
    }

    for (const handlerName of handlers) {
      const handlerPath = path.join(eventsDir, handlerName);
      if (_.endsWith(handlerName, '.event.ts')) {
        try {
          const handlerSpec = require(handlerPath).default;
          const handler: HandlerBase = new handlerSpec(this.resources);

          if (_.has(this.events, handler.topic)) {
            throw new Error(`Duplicated event listener: ${handler.topic}`);
          }

          await handler.init();
          this.events[handler.topic] = handler;
        } catch (error) {
          this.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
        }
      } else {
        try {
          // recurse down the directory tree
          await this.loadEvents(path.join(handlerPath, '/'));
        } catch (error) {
          // this.resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
          continue;
        }
      }
    }
  }

  private async loadTasks(dir?: string) {
    let tasksDir: string;
    if (dir) {
      tasksDir = dir;
    } else {
      tasksDir = path.join(this.resources.configuration.baseDir, './tasks/');
    }

    let handlers: string[];
    try {
      handlers = fs.readdirSync(tasksDir);
    } catch (error) {
      return;
    }

    for (const handlerName of handlers) {
      const handlerPath = path.join(tasksDir, handlerName);

      if (_.endsWith(handlerName, '.task.ts')) {
        try {
          const handlerSpec = require(handlerPath).default;
          const handler: HandlerBase = new handlerSpec(this.resources);

          if (_.has(this.tasks, handler.topic)) {
            throw new Error(`Duplicated task listener: ${handler.topic}`);
          }

          await handler.init();
          this.tasks[handler.topic] = handler;
        } catch (error) {
          this.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
        }
      } else {
        try {
          // recurse down the directory tree
          await this.loadTasks(path.join(handlerPath, '/'));
        } catch (error) {
          // this.resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
        }
      }
    }
  }

  private async loadRoutes(dir?: string) {
    const trustedEndpoints = ['get', 'delete', 'put', 'post'];
    let routesDir: string;
    if (dir) {
      routesDir = dir;
    } else {
      routesDir = path.join(this.resources.configuration.baseDir, './api/');
    }

    let handlers: string[];
    try {
      handlers = fs.readdirSync(routesDir);
    } catch (error) {
      return;
    }

    for (const handlerName of handlers) {
      const handlerPath = path.join(routesDir, handlerName);
      const method = _.toLower(handlerName.split('.')[0]);

      if (_.endsWith(handlerName, '.route.ts')) {
        // skip non route ts files
        // all routes should end in route.ts
        // all routes should start with the HTTP method to implement followed by a dot
        // in trustedEndpoints list
        // eg: post.route.ts
        // eg: get.allByBusiness.route.ts
        if (
          !_.includes(trustedEndpoints, method)
        ) {
          continue;
        }
        try {
          const routeClass = require(handlerPath).default;
          const routeInstance: ApiRoute = new routeClass(this.resources);

          const apiPrefix = '/api';
          const routeURL = `${apiPrefix}${routeInstance.url}`;

          switch (method) {
            case 'get':
              this.app.get(routeURL, routeInstance.routeCallback.bind(routeInstance));
              break;
            case 'post':
              this.app.post(routeURL, routeInstance.routeCallback.bind(routeInstance));
              break;
            case 'put':
              this.app.put(routeURL, routeInstance.routeCallback.bind(routeInstance));
              break;
            case 'delete':
              this.app.delete(routeURL, routeInstance.routeCallback.bind(routeInstance));
              break;
          }
          this.resources.logger.log('  Loaded route: ', method, routeInstance.url);
        } catch (error) {
          this.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
        }
      } else {
        try {
          // recurse down the directory tree
          await this.loadRoutes(path.join(handlerPath, '/'));
        } catch (error) {
          // this.resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
        }
      }
    }
  }

  private logApiRoute = (req: Request, res: Response, next: NextFunction) => {
    this.resources.logger.log(req.method, req.originalUrl);

    const cleanup = () => {
      res.removeListener('finish', logFinish);
    };

    const logFinish = () => {
      cleanup();

      if (res.statusCode >= 500) {
        this.resources.logger.error(req.method, req.originalUrl, res.statusCode);
      } else if (res.statusCode >= 400) {
        this.resources.logger.error(req.method, req.originalUrl, res.statusCode);
      } else if (res.statusCode < 300 && res.statusCode >= 200) {
        this.resources.logger.log(req.method, req.originalUrl, res.statusCode);
      } else {
        this.resources.logger.log(req.method, req.originalUrl, res.statusCode);
      }
    };

    res.on('finish', logFinish);

    next();
  }
}
