import Base from './Base';

export default abstract class HandlerBase extends Base {
  public abstract topic: string;
  public abstract init(): Promise<void>;
  protected abstract callback(data: any): Promise<void>;
  protected abstract handleCallback(data: any): Promise<void>;

  public getName(): string {
    return this.topic;
  }
}