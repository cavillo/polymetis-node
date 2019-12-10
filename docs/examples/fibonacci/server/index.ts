import { ServiceBase, Configuration } from 'polymetis-node';
import express from 'express';

// Initializing service
const configuration: Configuration = {
  baseDir: __dirname,
};
const service = new ServiceBase({ configuration });
service.init()
  .then(async () => {
    service.app.use(express.json()); // for parsing application/json
    service.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    await service.initAPI();
    service.logger.info('Initialized...');
  })
  .catch((error) => {
    service.logger.error('Exiting:', error);
  });
