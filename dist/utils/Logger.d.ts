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
    protected callback: (mode: string, message?: any, ...optionalParams: any[]) => Promise<void> | null;
    constructor(conf: ServiceConfiguration, callback?: (mode: string, message?: any, ...optionalParams: any[]) => Promise<void> | null);
    setLoggerCalback(callback: (mode: string, message?: any, ...optionalParams: any[]) => Promise<void> | null): void;
    debug(...args: any): void;
    info(...args: any): void;
    warn(...args: any): void;
    error(...args: any): void;
    private log;
}
