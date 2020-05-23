import * as _ from 'lodash';
import * as path from 'path';
import * as fs from 'fs';

import RPCHandlerBase from '../../handlers/RPCHandlerBase';
import ServiceBase from '../../ServiceBase';

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
      || _.endsWith(handlerName, '.rpc.js') // JavaScript
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
        await this.loadRPCs(service, path.join(handlerPath, '/'));
      } catch (error) {
        continue;
      }
    }
  }
};

export {
  loadRPCs,
};
