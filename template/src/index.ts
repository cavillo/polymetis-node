import { ServiceBase, Configuration } from 'polymetis-node';
import * as _ from 'lodash';

// Initializing service
const configuration: Configuration = {
  baseDir: __dirname,
};

const service = new ServiceBase({ configuration });

service.init()
  .then(async () => {
    service.logger.info('Initialized...');
  })
  .catch((error: any) => {
    service.logger.error('Exiting', error);
  });
