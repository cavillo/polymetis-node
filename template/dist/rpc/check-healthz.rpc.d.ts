import { ServiceResources, RPCHandlerBase } from 'polymetis-node';
export default class Handler extends RPCHandlerBase {
    topic: string;
    constructor(resources: ServiceResources);
    protected handleCallback(data: any): Promise<any>;
}
