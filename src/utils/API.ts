import * as _ from 'lodash';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import ApiRoute from '../base/RouteHandlerBase';
import { ServiceResources } from '../';
export { express, Express, NextFunction, Request, Response, ApiRoute, loadRoutes, logApiRoute };

const loadRoutes = async (app: Express, resources: ServiceResources, routes: any = {}, dir?: string) => {
  const apiPrefix = _.get(resources, 'configuration.api.prefix', '/api');
  const trustedEndpoints = ['get', 'delete', 'put', 'post'];
  let routesDir: string;
  if (dir) {
    routesDir = dir;
  } else {
    routesDir = path.join(resources.configuration.baseDir, './api/');
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
      if (!_.includes(trustedEndpoints, method)) {
        continue;
      }
      try {
        const routeClass = require(handlerPath).default;
        const routeInstance: ApiRoute = new routeClass(resources);

        const routeURL = `${apiPrefix}${routeInstance.url}`;

        switch (method) {
          case 'get':
            app.get(routeURL, routeInstance.routeCallback.bind(routeInstance));
            break;
          case 'post':
            app.post(routeURL, routeInstance.routeCallback.bind(routeInstance));
            break;
          case 'put':
            app.put(routeURL, routeInstance.routeCallback.bind(routeInstance));
            break;
          case 'delete':
            app.delete(routeURL, routeInstance.routeCallback.bind(routeInstance));
            break;
        }

        routes[routeInstance.url] = routeInstance;
        resources.logger.info('-', `${_.toUpper(method)}`, routeInstance.url);
      } catch (error) {
        resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await loadRoutes(app, resources, routes, path.join(handlerPath, '/'));
      } catch (error) {
        continue;
      }
    }
  }
};

const logApiRoute = (resources: ServiceResources, req: Request, res: Response, next: NextFunction) => {
  resources.logger.info(req.method, req.originalUrl);

  const cleanup = () => {
    res.removeListener('finish', logFinish);
  };

  const logFinish = () => {
    cleanup();

    if (res.statusCode >= 500) {
      resources.logger.error(req.method, req.originalUrl, res.statusCode);
    } else if (res.statusCode >= 400) {
      resources.logger.error(req.method, req.originalUrl, res.statusCode);
    } else if (res.statusCode < 300 && res.statusCode >= 200) {
      resources.logger.info(req.method, req.originalUrl, res.statusCode);
    } else {
      resources.logger.info(req.method, req.originalUrl, res.statusCode);
    }
  };

  res.on('finish', logFinish);

  next();
};
