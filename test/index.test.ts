import { ServiceBase, Configuration } from '../dist';

const conf: Configuration = {
  mongo: {
    port: 27017,
  },
};
const service = new ServiceBase(conf);
service
  .init()
  .then(
    () => console.log(),
  ).catch(
    (error: any) => service.logger.error(error),
  );