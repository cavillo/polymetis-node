import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import { RouteHandlerBase } from '../../handlers';
import ServiceBase from '../../ServiceBase';

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

    if (
      _.endsWith(handlerName, '.route.ts') // TyspeScript
      || _.endsWith(handlerName, '.route.js') // JavaScript
    ) {
      // skip non route ts files
      // all routes should end in route.ts
      try {
        const routeClass = require(handlerPath).default;
        const routeInstance: RouteHandlerBase = new routeClass(service.resources);

        await service.loadRoute(routeInstance);
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

export {
  loadRoutes,
};