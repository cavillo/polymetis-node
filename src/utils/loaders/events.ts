import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import EventHandlerBase from '../../handlers/EventHandlerBase';
import ServiceBase from '../../ServiceBase';

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
      || _.endsWith(handlerName, '.event.js') // JavaScript
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
        await loadEvents(service, path.join(handlerPath, '/'));
      } catch (error) {
        continue;
      }
    }
  }
};

export {
  loadEvents,
};
