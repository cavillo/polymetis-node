import { ServiceConfiguration } from './ServiceConf';
export declare enum LoggerMode {
    ALL = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    OFF = 5
}
export default class Logger {
    protected conf: ServiceConfiguration;
    constructor(conf: ServiceConfiguration);
    private getPrefix;
    debug(...args: any): void;
    info(...args: any): void;
    warn(...args: any): void;
    error(...args: any): void;
}
