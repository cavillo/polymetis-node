import HandlerBase from './HandlerBase';
export default abstract class RPCHandlerBase extends HandlerBase {
    init(): Promise<void>;
    protected callback(payload: any): Promise<any>;
    protected abstract handleCallback(data: any): Promise<any>;
}
