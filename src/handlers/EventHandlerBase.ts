import * as _ from 'lodash';
import HandlerBase from '../handlers/HandlerBase';
import { ServiceResources } from '../ServiceBase';

export default abstract class EvenHandlerBase extends HandlerBase{
  public abstract topic: string;

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async init() {
    const environment = this.resources.configuration.service.environment;
    const service = this.resources.configuration.service.service;

    const queue = `${environment}.${service}.${this.topic}`;

    await this.resources.rabbit.on(
      this.topic,                        // topic
      this.callback.bind(this),          // callback
      queue,                             // queue
    );

    this.resources.logger.log(this.getName(), 'Initialized...');
  }

  protected async callback(payload: any) {
    this.resources.logger.log('Handling event', this.topic);
    const data = _.get(payload, 'content', {});
    await this.handleCallback(data);
  }

  protected abstract async handleCallback(data: any): Promise<void>;

  public getName(): string {
    return `Event Handler ${this.topic}`;
  }

  protected async emitTask(task: string, data: any) {
    const topic = `${this.resources.configuration.service.service}.${task}`;
    this.resources.rabbit.emit(
      topic,
      data,
    );
  }
}