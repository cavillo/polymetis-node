import { ServiceConfiguration } from './ServiceConf';
export default class Logger {
    protected prefix: string;
    constructor(conf: ServiceConfiguration);
    log(...args: any): void;
    ok(...args: any): void;
    error(...args: any): void;
    warn(...args: any): void;
    muted(...args: any): void;
    clean(...args: any): void;
    newLine(): void;
}
