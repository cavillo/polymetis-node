import { ServiceResources } from '../ServiceBase';
export default abstract class HandlerBase {
    protected resources: ServiceResources;
    abstract topic: string;
    constructor(resources: ServiceResources);
    abstract init(): Promise<void>;
    protected abstract callback(data: any): Promise<void>;
    protected abstract handleCallback(data: any): Promise<void>;
    getName(): string;
}
