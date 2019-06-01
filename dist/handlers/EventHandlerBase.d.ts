import HandlerBase from '../handlers/HandlerBase';
import { ServiceResources } from '../ServiceBase';
export default abstract class EvenHandlerBase extends HandlerBase {
    abstract topic: string;
    constructor(resources: ServiceResources);
    init(): Promise<void>;
    protected callback(payload: any): Promise<void>;
    protected abstract handleCallback(data: any): Promise<void>;
    getName(): string;
    protected emitTask(task: string, data: any): Promise<void>;
}
