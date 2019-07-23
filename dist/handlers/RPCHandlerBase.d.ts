import HandlerBase from '../handlers/HandlerBase';
import { ServiceResources } from '../ServiceBase';
export default abstract class RPCHandlerBase extends HandlerBase {
    abstract topic: string;
    constructor(resources: ServiceResources);
    init(): Promise<void>;
    protected callback(payload: any): Promise<any>;
    protected abstract handleCallback(data: any): Promise<any>;
}
