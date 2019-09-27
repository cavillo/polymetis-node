import amqplib from 'amqplib';
import * as _ from 'lodash';
import { RabbitConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';
import { clearTimeout } from 'timers';

export interface RPCResponsePayload {
  transactionId: string;
  data?: any | null;
  error?: string | null;
  status: 'ok' | 'error' | 'timeout';
}

export default class RabbitService {
  private RPC_TIMEOUT = 5000;
  private connection?: amqplib.Connection;
  private channel?: amqplib.Channel;
  private url: string;
  private exchangeName: string;

  constructor(protected conf: RabbitConfiguration, protected logger: Logger) {
    const username = conf.username;
    const password = conf.password;
    const host = conf.host;
    const port = conf.port;

    this.exchangeName = conf.exchange;
    this.url = `amqp://${username}:${password}@${host}:${port}`;
  }

  public isConnected(): boolean {
    return Boolean(this.connection);
  }

  public async init() {
    if (
         !this.conf
      || !this.conf.host
      || !this.conf.port
      || !this.conf.username
      || !this.conf.password
      || !this.conf.exchange
      || !this.conf.queue
    ) {
      this.logger.warn('RabbitMQ: No parameters for initialization. Skiping...');
      return;
    }
    const channel = await this.connect();
    if (!channel) throw new Error('Rabbit failed');

    this.logger.info('Rabbit connection initialized...');
  }

  public async getChannel(): Promise<amqplib.Channel> {
    return await this.connect();
  }

  public async on(routingKey: string, callback: any, queueName: string = '') {
    if (!_.isFunction(callback)) {
      return;
    }
    const channel = await this.connect();
    if (!channel) return;
    const q = await channel.assertQueue(queueName);
    await channel.assertExchange(this.exchangeName, 'topic', { durable: false });
    await channel.bindQueue(q.queue, this.exchangeName, routingKey);
    await channel.prefetch(1);

    return channel.consume(q.queue, this.callback.bind(this, channel, callback));
  }

  public async emit(routingKey: string, data: any) {
    const channel = await this.connect();
    if (!channel) return;
    await channel.assertExchange(this.exchangeName, 'topic', { durable: false });

    await channel.publish(this.exchangeName, routingKey, Buffer.from(JSON.stringify(data)));
  }

  /*
    RPC
  */
  public async callProcedure(procName: string, data: any, timeout: number = this.RPC_TIMEOUT): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const correlationId = this.generateUuid();

      const channel = await this.connect();
      if (!channel) {
        const payload: RPCResponsePayload = {
          transactionId: correlationId,
          error: 'RabbitMQ Connection error',
          status: 'error',
        };

        return reject(payload);
      }
      await channel.assertExchange(this.exchangeName, 'topic', { durable: false });

      const q = await channel.assertQueue(`${correlationId}.${procName}`, { exclusive: true });

      const timeoutId = setTimeout(
        () => {
          this.logger.error('RPC timeout...');
          const payload: RPCResponsePayload = {
            transactionId: correlationId,
            error: 'RPC Timeout',
            status: 'timeout',
          };

          return reject(payload);
        },
        timeout,
      );

      await channel.consume(
        q.queue,
        (msg: any) => {
          if (msg.properties.correlationId === correlationId) {
            clearTimeout(timeoutId);

            try {
              const content = JSON.parse(msg.content.toString());

              const payload: RPCResponsePayload = {
                transactionId: correlationId,
                error: _.get(content, 'error', null),
                status: _.get(content, 'result', null) === 'error' ? 'error' : 'ok',
                data: _.get(content, 'data', null),
              };

              return resolve(payload);
            } catch (error) {
              const payload: RPCResponsePayload = {
                transactionId: correlationId,
                status: 'timeout',
                error: _.toString(error),
              };

              return reject(payload);
            }
          }
        },
        { noAck: true },
      );

      await channel.sendToQueue(
        `rpc_queue.${procName}`,
        Buffer.from(JSON.stringify(data)),
        {
          correlationId,
          replyTo: q.queue,
        },
      );
    });
  }

  /*
    RPC
  */
  public async registerProcedure(procName: string, callback: any) {
    if (!_.isFunction(callback)) {
      return;
    }
    const channel = await this.connect();
    if (!channel) return;
    const queueName = `rpc_queue.${procName}`;
    const q = await channel.assertQueue(queueName, { durable: false });
    await channel.assertExchange(this.exchangeName, 'topic', { durable: false });
    await channel.bindQueue(q.queue, this.exchangeName, procName);
    await channel.prefetch(1);

    return channel.consume(q.queue, this.rpcCallback.bind(this, channel, callback));
  }

  private async connect(): Promise<amqplib.Channel> {
    if (!this.connection) {
      this.connection = await amqplib.connect(this.url);
    }
    if (!this.channel) {
      this.channel = await this.connection.createChannel();
    }

    return this.channel;
  }

  /*
    RPC
  */
  private async rpcCallback(channel: amqplib.Channel, callback: Function, message: any) {
    const retval = {};
    message.content = JSON.parse(message.content.toString());
    try {
      _.set(retval, 'data', await callback(message));
    } catch (error) {
      this.logger.error('Error in rpcCallback', error);
      _.set(retval, 'error', error);
    }

    channel.sendToQueue(
      message.properties.replyTo,
      Buffer.from(JSON.stringify(retval)), {
        correlationId: message.properties.correlationId,
      });
    channel.ack(message);
  }

  private callback(channel: amqplib.Channel, callback: Function, message: any) {
    message.content = JSON.parse(message.content.toString());
    callback(message);
    channel.ack(message);
  }

  private generateUuid() {
    return Math.random().toString() +
      Math.random().toString() +
      Math.random().toString();
  }
}
