import { ServiceResources, TaskHandlerBase } from 'polymetis-node';
export default class Handler extends TaskHandlerBase {
    topic: string;
    constructor(resources: ServiceResources);
    protected handleCallback(data: any): Promise<void>;
}
