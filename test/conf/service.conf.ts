import {
  Configuration,
} from '../../dist';

const configuration: Configuration = {
  baseDir: __dirname,
  service: {
    environment: 'local',
    service: 'test-service',
    loggerMode: 0,
    // ALL='0', DEBUG='1', INFO='2', WARN='3', ERROR='4', OFF='5'
  },
  api: {
    port: 8000,
  },
  rabbit: {
    host: 'localhost', // change to localhost in local env
    port: 5672,
    username: 'guest',
    password: 'guest',
  },
};

export default configuration;