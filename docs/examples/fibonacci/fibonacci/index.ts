import { ServiceBase } from 'polymetis-node';

const service = new ServiceBase();
service.init()
  .then(async () => {
    service.logger.info('Initialized...');
  })
  .catch((error) => {
    service.logger.error('Exiting:', error);
  });
