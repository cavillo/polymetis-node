import { Database as DatabaseInstance } from 'massive';
export { DatabaseInstance, };
import { PostgresConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';
export default class Postgres {
    protected conf: PostgresConfiguration;
    protected logger: Logger;
    instance: DatabaseInstance;
    constructor(conf: PostgresConfiguration, logger: Logger);
    init(): Promise<void>;
    dbInstance(force?: boolean): Promise<DatabaseInstance>;
}
