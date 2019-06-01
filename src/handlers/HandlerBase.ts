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
}