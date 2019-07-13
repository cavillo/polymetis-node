import { ServiceResources } from '../ServiceBase';

export default abstract class HandlerBase {
  protected resources: ServiceResources;
  public abstract topic: string;

  constructor(resources: ServiceResources) {
    this.resources = resources;
  }

  public abstract async init(): Promise<void>;
  protected abstract async callback(data: any): Promise<void>;
  protected abstract async handleCallback(data: any): Promise<void>;

  public getName(): string {
    return `Handler ${this.topic}`;
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