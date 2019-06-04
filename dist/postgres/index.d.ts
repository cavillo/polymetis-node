import massive from 'massive';
export declare type DatabaseInstance = massive.Database;
import { PostgresConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';
export default class Postgres {
    protected conf: PostgresConfiguration;
    protected logger: Logger;
    protected instance: DatabaseInstance;
    constructor(conf: PostgresConfiguration, logger: Logger);
    init(): Promise<void>;
    dbInstance(force?: boolean): Promise<DatabaseInstance>;
}
