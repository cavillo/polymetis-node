import * as _ from 'lodash';
import massive from 'massive';
export type DatabaseInstance = massive.Database;

import { PostgresConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';

let db: DatabaseInstance;

export default class Postgres {
  protected instance: DatabaseInstance;
  constructor(protected conf: PostgresConfiguration, protected logger: Logger) { }

  public async init() {
    if (
         !this.conf
      || !this.conf.host
      || !this.conf.port
      || !this.conf.user
      || !this.conf.password
      || !this.conf.database
    ) {
      this.logger.warn('Postgres: No parameters for initialization. Skiping...');
      return;
    }

    this.instance = await this.dbInstance();
    this.logger.ok('Postgres Initialized...');
  }

  public async dbInstance(force = false): Promise<DatabaseInstance> {
    if (!force && db) {
      return db;
    }

    const connectionOptions: any = {
      enhancedFunctions: true,
    };

    db = await massive(this.conf, connectionOptions);

    return db;
  }
}