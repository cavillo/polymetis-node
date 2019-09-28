import Base from './.base';
import { RPCResponsePayload } from '../rabbit';

export default abstract class HandlerBase extends Base {
  public abstract topic: string;
  public abstract async init(): Promise<void>;
  protected abstract async callback(data: any): Promise<void>;
  protected abstract async handleCallback(data: any): Promise<void>;

  public getName(): string {
    return this.topic;
  }

  public async callRPC(service: string, procedure: string, data: any) {
    const { environment } = this.resources.configuration.service;
    const topic = `${environment}.${service}.rpc.${procedure}`;
    return this.resources.rabbit.callProcedure(
      topic,
      data,
    );
  }
}