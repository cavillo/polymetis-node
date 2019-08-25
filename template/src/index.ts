import { ServiceBase, Configuration } from 'polymetis-node';
import * as _ from 'lodash';

// Initializing service
const conf: Configuration = {
  baseDir: __dirname,
};

const service = new ServiceBase(conf);

service.init()
  .then(async () => {
    service.logger.info('Initialized...');
  })
  .catch((error: any) => {
    service.logger.error('Exiting', error);
  });
