import HandlerBase from './HandlerBase';
export default abstract class EventHandlerBase extends HandlerBase {
    init(): Promise<void>;
    protected callback(payload: any): Promise<void>;
    protected abstract handleCallback(data: any): Promise<void>;
    protected emitTask(task: string, data: any): Promise<void>;
}
