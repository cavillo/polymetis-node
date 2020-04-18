import * as _ from 'lodash';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { RouteHandlerBase } from '../base';
import ServiceBase, { ServiceResources } from '../ServiceBase';

type TrustedEndpoints = 'get' | 'delete' | 'put' | 'post';

const loadRoutes = async (service: ServiceBase, dir?: string) => {
  let routesDir: string;
  if (dir) {
    routesDir = dir;
  } else {
    routesDir = path.join(service.resources.configuration.baseDir, './api/');
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

    if (
          _.endsWith(handlerName, '.route.ts') // TyspeScript
      ||  _.endsWith(handlerName, '.route.js') // JavaScript
    ) {
      // skip non route ts files
      // all routes should end in route.ts
      // all routes should start with the HTTP method to implement followed by a dot
      // in trustedEndpoints list
      // eg: post.route.ts
      // eg: get.allByBusiness.route.ts
      if (
           method !== 'get'
        && method !== 'post'
        && method !== 'put'
        && method !== 'delete'
      ) {
        continue;
      }
      try {
        const routeClass = require(handlerPath).default;
        const routeInstance: RouteHandlerBase = new routeClass(service.resources);

        await service.loadRoute(routeInstance, method);
      } catch (error) {
        service.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await loadRoutes(service, path.join(handlerPath, '/'));
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

export {
  express,
  Express,
  NextFunction,
  Request,
  Response,
  TrustedEndpoints,
  loadRoutes,
  logApiRoute,
};
