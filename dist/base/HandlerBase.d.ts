import Base from './.base';
export default abstract class HandlerBase extends Base {
    abstract topic: string;
    abstract init(): Promise<void>;
    protected abstract callback(data: any): Promise<void>;
    protected abstract handleCallback(data: any): Promise<void>;
    getName(): string;
    callRPC(service: string, procedure: string, data: any): Promise<import("../rabbit").RPCResponsePayload>;
}
