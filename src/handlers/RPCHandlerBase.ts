import * as _ from 'lodash';
import HandlerBase from './HandlerBase';

export default abstract class RPCHandlerBase extends HandlerBase{
  public async init() {
    const environment = this.resources.configuration.service.environment;
    const service = this.resources.configuration.service.service;

    await this.resources.rabbit.registerProcedure(
      `${environment}.${service}.rpc.${this.topic}`,    // topic
      this.callback.bind(this),                         // callback
    );
    this.resources.logger.info('-[rpc  ]', this.getName());
  }

  protected async callback(payload: any) {
    try {
      this.resources.logger.info('Handling rpc', this.topic);
      const data = _.get(payload, 'content', {});
      return await this.handleCallback(data);
    } catch (error) {
      this.resources.logger.error('RPC handler ERROR', this.topic, JSON.stringify(error));
    }
  }

  protected abstract async handleCallback(data: any): Promise<any>;

}