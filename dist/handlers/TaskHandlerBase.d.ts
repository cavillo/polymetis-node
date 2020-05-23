import HandlerBase from './HandlerBase';
export default abstract class TaskHandlerBase extends HandlerBase {
    init(): Promise<void>;
    protected callback(payload: any): Promise<void>;
    protected abstract handleCallback(data: any): Promise<void>;
}
