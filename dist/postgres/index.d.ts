import massive from 'massive';
export declare type DatabaseInstance = massive.Database;
import { PostgresConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';
export default class Postgres {
    protected configuration: PostgresConfiguration;
    protected logger: Logger;
    constructor(configuration: PostgresConfiguration, logger: Logger);
    init(): Promise<void>;
    dbInstance(force?: boolean): Promise<DatabaseInstance>;
}
