import HandlerBase from './HandlerBase';
import { ServiceResources } from '../ServiceBase';
export default abstract class TaskHandlerBase extends HandlerBase {
    abstract topic: string;
    constructor(resources: ServiceResources);
    init(): Promise<void>;
    protected callback(payload: any): Promise<void>;
    protected abstract handleCallback(data: any): Promise<void>;
}
