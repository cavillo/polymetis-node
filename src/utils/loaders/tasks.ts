import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import TaskHandlerBase from '../../handlers/TaskHandlerBase';
import ServiceBase from '../../ServiceBase';

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
      || _.endsWith(handlerName, '.task.js') // JavaScript
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

export {
  loadTasks,
};
