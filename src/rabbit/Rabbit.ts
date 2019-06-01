import amqplib from 'amqplib';
import * as _ from 'lodash';
import { RabbitConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';

export default class RabbitService {
  private logger: Logger;
  private connection?: amqplib.Connection;
  private channel?: amqplib.Channel;
  private url: string;
  private queueName: string;
  private exchangeName: string;

  constructor(conf: RabbitConfiguration, logger: Logger) {
    const username = conf.username;
    const password = conf.password;
    const host = conf.host;
    const port = conf.port;

    this.logger = logger;
    this.exchangeName = conf.exchange || 'local';
    this.queueName = conf.queue || '';
    this.url = `amqp://${username}:${password}@${host}:${port}`;
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

  public async init() {
    const channel = await this.connect();
    if (!channel) throw new Error('Rabbit failed');

    this.logger.ok('Rabbit Initialized...');
  }

  public async getChannel(): Promise<amqplib.Channel> {
    return await this.connect();
  }

  async on(routingKey: string, callback: any, queueName: string = '') {
    if (!_.isFunction(callback)) {
      return;
    }
    const channel = await this.connect();
    if (!channel) return;
    const q = await channel.assertQueue(queueName, { exclusive: true });
    await channel.assertExchange(this.exchangeName, 'topic', { durable: false });
    await channel.bindQueue(q.queue, this.exchangeName, routingKey);
    await channel.prefetch(1);

    return channel.consume(q.queue, this.callback.bind(this, channel, callback));
  }

  async emit(routingKey: string, data: any) {
    const channel = await this.connect();
    if (!channel) return;
    await channel.assertExchange(this.exchangeName, 'topic', { durable: false });

    await channel.publish(this.exchangeName, routingKey, Buffer.from(JSON.stringify(data)));
    // this.logger.log(`RabbitService [emiting]    [${this.exchangeName}][${routingKey}]: `, data);
  }

  private callback(channel: amqplib.Channel, callback: Function, message: any) {
    message.content = JSON.parse(message.content.toString());
    // this.logger.log(`RabbitService [receiving]  [${_.get(message, 'fields.exchange', '--')}][${_.get(message, 'fields.routingKey', '--')}]: `, message.content);
    callback(message);
    channel.ack(message);
  }

  public isConnected(): boolean {
    return Boolean(this.connection);
  }
}
