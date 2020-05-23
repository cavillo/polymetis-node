interface ServiceConfiguration {
    environment?: string;
    service?: string;
    loggerMode?: number;
}
interface ApiConfiguration {
    port?: number;
    baseRoute?: string;
}
interface RabbitConfiguration {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
}
interface Configuration {
    baseDir?: string;
    service?: ServiceConfiguration;
    rabbit?: RabbitConfiguration;
    api?: ApiConfiguration;
}
declare const serviceConf: ServiceConfiguration;
declare const apiConf: ApiConfiguration;
declare const rabbitConf: RabbitConfiguration;
declare const configuration: Configuration;
export { ServiceConfiguration, ApiConfiguration, RabbitConfiguration, Configuration, serviceConf, apiConf, rabbitConf, configuration, };
