import { ServiceBase, Configuration } from '../dist';

const conf: Configuration = {
  api: {
    port: 8000,
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