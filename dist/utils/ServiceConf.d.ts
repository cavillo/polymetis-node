export interface ServiceConfiguration {
    environment?: string;
    service?: string;
}
export interface ApiConfiguration {
    port?: number;
}
export interface RedisConfiguration {
    host?: string;
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
export interface MongoConfiguration {
    auth?: {
        user?: string;
        password?: string;
    };
    url?: string;
    port?: number;
    dbName?: string;
}
export interface PostgresConfiguration {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    ssl?: boolean;
}
export interface Configuration {
    baseDir?: string;
    service?: ServiceConfiguration;
    rabbit?: RabbitConfiguration;
    mongo?: MongoConfiguration;
    api?: ApiConfiguration;
    redis?: RedisConfiguration;
    postgres?: PostgresConfiguration;
}
export declare const serviceConf: ServiceConfiguration;
export declare const apiConf: ApiConfiguration;
export declare const redisConf: RedisConfiguration;
export declare const rabbitConf: RabbitConfiguration;
export declare const mongoConf: MongoConfiguration;
export declare const postgresConf: PostgresConfiguration;
export declare const configuration: Configuration;
