import * as _ from 'lodash';
import HandlerBase from '../handlers/HandlerBase';
import { ServiceResources } from '../ServiceBase';

export default abstract class RPCHandlerBase extends HandlerBase{
  public abstract topic: string;

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async init() {
    const environment = this.resources.configuration.service.environment;
    const service = this.resources.configuration.service.service;

    await this.resources.rabbit.registerProcedure(
      `${environment}.${service}.rpc.${this.topic}`,    // topic
      this.callback.bind(this),                         // callback
    );

    this.resources.logger.log(this.getName(), 'Initialized...');
  }

  protected async callback(payload: any) {
    this.resources.logger.log('Handling rpc', this.topic);
    const data = _.get(payload, 'content', {});
    return await this.handleCallback(data);
  }

  protected abstract async handleCallback(data: any): Promise<any>;

  public getName(): string {
    return `RPC Handler ${this.topic}`;
  }

  protected async emitTask(task: string, data: any) {
    const topic = `${this.resources.configuration.service.service}.${task}`;
    this.resources.rabbit.emit(
      topic,
      data,
    );
  }
}