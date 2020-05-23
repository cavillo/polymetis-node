import amqplib from 'amqplib';
import { Configuration, Logger } from '../utils';
export interface RPCResponsePayload {
    transactionId: string;
    data?: any | null;
    error?: string | null;
    status: 'ok' | 'error' | 'timeout';
}
export default class RabbitService {
    protected conf: Configuration;
    protected logger: Logger;
    private RPC_TIMEOUT;
    private connection?;
    private channel?;
    private url;
    private exchangeName;
    constructor(conf: Configuration, logger: Logger);
    isConnected(): boolean;
    init(): Promise<void>;
    getChannel(): Promise<amqplib.Channel>;
    on(routingKey: string, callback: any, queueName?: string): Promise<amqplib.Replies.Consume>;
    emit(routingKey: string, data: any): Promise<void>;
    callProcedure(procName: string, data: any, timeout?: number): Promise<RPCResponsePayload>;
    registerProcedure(procName: string, callback: any): Promise<amqplib.Replies.Consume>;
    private connect;
    private rpcCallback;
    private callback;
    private generateUuid;
}
