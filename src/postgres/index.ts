import * as _ from 'lodash';
import massive from 'massive';
export type DatabaseInstance = massive.Database;

import { PostgresConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';

let db: DatabaseInstance;

export default class Postgres {
  constructor(protected configuration: PostgresConfiguration, protected logger: Logger) { }

  public async init() {
    await this.dbInstance();
    this.logger.ok('Postgres Initialized...');
  }

  public async dbInstance(force = false): Promise<DatabaseInstance> {
    if (!force && db) {
      return db;
    }

    const connectionOptions: any = {
      enhancedFunctions: true,
    };

    db = await massive(this.configuration, connectionOptions);

    return db;
  }
}