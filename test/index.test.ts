// import { expect } from 'chai';
import { ServiceBase, Configuration } from '../src';
import 'mocha';

const conf: Configuration = {
  baseDir: __dirname,
};

describe('Basic service', async () => {
  it('start microservice', async () => {
    // Initializing service
    const service = new ServiceBase(conf);
    await service.init();
  });
});
