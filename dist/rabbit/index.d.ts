import amqplib from 'amqplib';
import { RabbitConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';
export default class RabbitService {
    protected conf: RabbitConfiguration;
    protected logger: Logger;
    private RPC_TIMEOUT;
    private connection?;
    private channel?;
    private url;
    private queueName;
    private exchangeName;
    constructor(conf: RabbitConfiguration, logger: Logger);
    isConnected(): boolean;
    init(): Promise<void>;
    getChannel(): Promise<amqplib.Channel>;
    on(routingKey: string, callback: any, queueName?: string): Promise<amqplib.Replies.Consume>;
    emit(routingKey: string, data: any): Promise<void>;
    callProcedure(procName: string, data: any, timeout?: number): Promise<unknown>;
    registerProcedure(procName: string, callback: any): Promise<amqplib.Replies.Consume>;
    private connect;
    private rpcCallback;
    private callback;
    private generateUuid;
}
