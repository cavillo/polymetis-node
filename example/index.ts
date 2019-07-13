import * as _ from 'lodash';
import { ServiceBase } from '../dist';

const service = new ServiceBase();
service.init()
  .then(() => {
    service.logger.log('Initialized...');

    // arbitraty heartbeath interval for kubernetes pod to run
    setInterval(
      () => {
        service.logger.muted('.');
      },
      30000,
    );
  })
  .catch((error) => {
    service.logger.error('Exiting:', error);
  });
