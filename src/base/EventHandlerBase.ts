import * as _ from 'lodash';
import HandlerBase from './HandlerBase';

export default abstract class EventHandlerBase extends HandlerBase{
  public async init() {
    const environment = this.resources.configuration.service.environment;
    const service = this.resources.configuration.service.service;

    const queue = `${environment}.${service}.${this.topic}`;

    await this.resources.rabbit.on(
      this.topic,                        // topic
      this.callback.bind(this),          // callback
      queue,                             // queue
    );
    this.resources.logger.log('-', this.getName());
  }

  protected async callback(payload: any) {
    this.resources.logger.log('Handling event', this.topic);
    const data = _.get(payload, 'content', {});
    await this.handleCallback(data);
  }

  protected abstract async handleCallback(data: any): Promise<void>;

  protected async emitTask(task: string, data: any) {
    const topic = `${this.resources.configuration.service.service}.${task}`;
    this.resources.rabbit.emit(
      topic,
      data,
    );
  }
}