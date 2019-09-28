import { EventHandlerBase, ServiceResources } from 'polymetis-node';
export default class Handler extends EventHandlerBase {
    topic: string;
    constructor(resources: ServiceResources);
    protected handleCallback(data: any): Promise<void>;
}
