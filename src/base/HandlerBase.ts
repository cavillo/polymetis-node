import Base from './.base';

export default abstract class HandlerBase extends Base {
  public abstract topic: string;
  public abstract async init(): Promise<void>;
  protected abstract async callback(data: any): Promise<void>;
  protected abstract async handleCallback(data: any): Promise<void>;

  public getName(): string {
    return this.topic;
  }

}