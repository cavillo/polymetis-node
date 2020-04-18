import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import Base from './Base';
import HandlerBase from './HandlerBase';
import EventHandlerBase from './EventHandlerBase';
import TaskHandlerBase from './TaskHandlerBase';
import RPCHandlerBase from './RPCHandlerBase';
import RouteHandlerBase from './RouteHandlerBase';
import ServiceBase from '../ServiceBase';

const loadEvents = async (service: ServiceBase, dir?: string): Promise<void> => {
  let eventsDir: string;
  if (dir) {
    eventsDir = dir;
  } else {
    eventsDir = path.join(service.resources.configuration.baseDir, './events/');
  }

  let handlers: string[];
  try {
    handlers = fs.readdirSync(eventsDir);
  } catch (error) {
    return;
  }

  for (const handlerName of handlers) {
    const handlerPath = path.join(eventsDir, handlerName);
    if (
          _.endsWith(handlerName, '.event.ts') // TyspeScript
      ||  _.endsWith(handlerName, '.event.js') // JavaScript
    ) {
      try {
        const handlerSpec = require(handlerPath).default;
        const handler: EventHandlerBase = new handlerSpec(service.resources);

        await service.loadEvent(handler);
      } catch (error) {
        service.resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await this.loadEvents(service, path.join(handlerPath, '/'));
      } catch (error) {
        continue;
      }
    }
  }
};

const loadTasks = async (service: ServiceBase, dir?: string): Promise<void> => {
  let tasksDir: string;
  if (dir) {
    tasksDir = dir;
  } else {
    tasksDir = path.join(service.resources.configuration.baseDir, './tasks/');
  }

  let handlers: string[];
  try {
    handlers = fs.readdirSync(tasksDir);
  } catch (error) {
    return;
  }

  for (const handlerName of handlers) {
    const handlerPath = path.join(tasksDir, handlerName);

    if (
          _.endsWith(handlerName, '.task.ts') // TyspeScript
      ||  _.endsWith(handlerName, '.task.js') // JavaScript
    ) {
      try {
        const handlerSpec = require(handlerPath).default;
        const handler: TaskHandlerBase = new handlerSpec(service.resources);

        await service.loadTask(handler);
      } catch (error) {
        service.resources.logger.error(`Error Registering Task ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await this.loadTasks(service, path.join(handlerPath, '/'));
      } catch (error) {
        continue;
      }
    }
  }
};

const loadRPCs = async (service: ServiceBase, dir?: string): Promise<void> => {
  let rpcsDir: string;
  if (dir) {
    rpcsDir = dir;
  } else {
    rpcsDir = path.join(service.resources.configuration.baseDir, './rpc/');
  }

  let handlers: string[];
  try {
    handlers = fs.readdirSync(rpcsDir);
  } catch (error) {
    return;
  }

  for (const handlerName of handlers) {
    const handlerPath = path.join(rpcsDir, handlerName);

    if (
          _.endsWith(handlerName, '.rpc.ts') // TyspeScript
      ||  _.endsWith(handlerName, '.rpc.js') // JavaScript
    ) {
      try {
        const handlerSpec = require(handlerPath).default;
        const handler: RPCHandlerBase = new handlerSpec(service.resources);

        await service.loadRPC(handler);
      } catch (error) {
        service.resources.logger.error(`Error Registering RPC ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await this.loadRPC(service, path.join(handlerPath, '/'));
      } catch (error) {
        continue;
      }
    }
  }
};

export {
  Base,
  HandlerBase,
  EventHandlerBase,
  TaskHandlerBase,
  RPCHandlerBase,
  RouteHandlerBase,
  loadEvents,
  loadTasks,
  loadRPCs,
};
