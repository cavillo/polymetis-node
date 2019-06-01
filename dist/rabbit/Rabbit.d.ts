import amqplib from 'amqplib';
import { RabbitConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';
export default class RabbitService {
    private logger;
    private connection?;
    private channel?;
    private url;
    private queueName;
    private exchangeName;
    constructor(conf: RabbitConfiguration, logger: Logger);
    private connect;
    init(): Promise<void>;
    getChannel(): Promise<amqplib.Channel>;
    on(routingKey: string, callback: any, queueName?: string): Promise<amqplib.Replies.Consume>;
    emit(routingKey: string, data: any): Promise<void>;
    private callback;
    isConnected(): boolean;
}
