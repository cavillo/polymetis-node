import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import HandlerBase from './HandlerBase';
import EventHandlerBase from './EventHandlerBase';
import TaskHandlerBase from './TaskHandlerBase';
import RPCHandlerBase from './RPCHandlerBase';
import { ServiceResources } from '../';
export {
  HandlerBase,
  EventHandlerBase,
  TaskHandlerBase,
  RPCHandlerBase,
  loadEvents,
  loadTasks,
  loadRPC,
};

const loadEvents = async (resources: ServiceResources, events: any = {}, dir?: string): Promise<any> => {
  let eventsDir: string;
  if (dir) {
    eventsDir = dir;
  } else {
    eventsDir = path.join(resources.configuration.baseDir, './events/');
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
        const handler: HandlerBase = new handlerSpec(resources);

        if (_.has(events, handler.topic)) {
          throw new Error(`Duplicated event listener: ${handler.topic}`);
        }

        await handler.init();
        events[handler.topic] = handler;
        resources.logger.log('-', handler.getName());
      } catch (error) {
        resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await this.loadEvents(resources, events, path.join(handlerPath, '/'));
      } catch (error) {
        // resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
        continue;
      }
    }
  }
  return events;
};

const loadTasks = async (resources: ServiceResources, tasks: any = {}, dir?: string): Promise<any> => {
  let tasksDir: string;
  if (dir) {
    tasksDir = dir;
  } else {
    tasksDir = path.join(resources.configuration.baseDir, './tasks/');
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
        const handler: HandlerBase = new handlerSpec(resources);

        if (_.has(tasks, handler.topic)) {
          throw new Error(`Duplicated task listener: ${handler.topic}`);
        }

        await handler.init();
        tasks[handler.topic] = handler;
        resources.logger.log('-', handler.getName());
      } catch (error) {
        resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await this.loadTasks(resources, tasks, path.join(handlerPath, '/'));
      } catch (error) {
        // resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
        continue;
      }
    }
  }
  return tasks;
};

const loadRPC = async (resources: ServiceResources, rpcs: any = {}, dir?: string): Promise<any> => {
  let rpcsDir: string;
  if (dir) {
    rpcsDir = dir;
  } else {
    rpcsDir = path.join(resources.configuration.baseDir, './rpc/');
  }

  let handlers: string[];
  try {
    handlers = fs.readdirSync(rpcsDir);
  } catch (error) {
    return;
  }

  for (const handlerName of handlers) {
    const handlerPath = path.join(rpcsDir, handlerName);

    if (_.endsWith(handlerName, '.rpc.ts')) {
      try {
        const handlerSpec = require(handlerPath).default;
        const handler: HandlerBase = new handlerSpec(resources);

        if (_.has(rpcs, handler.topic)) {
          throw new Error(`Duplicated rpc listener: ${handler.topic}`);
        }

        await handler.init();
        rpcs[handler.topic] = handler;
        resources.logger.log('-', handler.getName());
      } catch (error) {
        resources.logger.error(`Error Registering Event ${handlerName}: ${error}`);
      }
    } else {
      try {
        // recurse down the directory tree
        await this.loadRPC(resources, rpcs, path.join(handlerPath, '/'));
      } catch (error) {
        // resources.logger.error(`Error Rrecursing down ${handlerPath}: ${error}`);
        continue;
      }
    }
  }
  return rpcs;
};
