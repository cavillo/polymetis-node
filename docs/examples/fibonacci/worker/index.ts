import { ServiceBase, Configuration } from 'polymetis-node';

// Initializing service
const configuration: Configuration = {
  baseDir: __dirname,
};
const service = new ServiceBase({ configuration });
service.init()
  .then(async () => {
    await service.initRPCs();
    await service.initEvents();
    await service.initTasks();
    service.logger.info('Initialized...');
  })
  .catch((error) => {
    service.logger.error('Exiting:', error);
  });
