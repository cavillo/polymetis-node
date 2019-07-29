export interface ServiceConfiguration {
    environment?: string;
    service?: string;
}
export interface ApiConfiguration {
    port?: number;
}
export interface RabbitConfiguration {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    exchange?: string;
    queue?: string;
}
export interface Configuration {
    baseDir?: string;
    service?: ServiceConfiguration;
    rabbit?: RabbitConfiguration;
    api?: ApiConfiguration;
}
export declare const serviceConf: ServiceConfiguration;
export declare const apiConf: ApiConfiguration;
export declare const rabbitConf: RabbitConfiguration;
export declare const configuration: Configuration;
