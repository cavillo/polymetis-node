import _ from 'lodash';
import { ServiceResources } from '..';
import { post, RPCResponsePayload } from '../utils/rpcs';

export default class Base {
  constructor(protected resources: ServiceResources) {
    this.resources = resources;
  }

  public async emitEvent(topic: string, data: any) {
    return this.resources.rabbit.emit(
      topic,
      data,
    );
  }

  public async emitTask(task: string, data: any) {
    const topic = `${this.resources.configuration.service.service}.${task}`;
    this.resources.rabbit.emit(
      topic,
      data,
    );
  }

  public async callRPC(url: string, data: any, transactionId: string): Promise<any> {
    this.resources.logger.info(`Calling RPC ${url}`);
    try {
      const response: RPCResponsePayload = await post(
        url,
        {
          transactionId,
          payload: data,
        },
      );

      if (response.transactionId !== transactionId) {
        throw new Error('Invalid transactionId');
      }
      if (!_.isNil(response.error)) {
        throw new Error(response.error);
      }

      return response.data;
    } catch (error) {
      this.resources.logger.error(`Error calling RPC [${url}]: ${error.message}`);
      throw new Error(error.message);
    }
  }

  protected generateTransactionId(): string {
    return `${_.random(1e10).toString()}-${_.random(1e10).toString()}-${Date.now()}`;
  }
}