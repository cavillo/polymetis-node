import { ServiceResources } from '..';
export default abstract class Base {
    protected resources: ServiceResources;
    constructor(resources: ServiceResources);
    emitEvent(topic: string, data: any): Promise<void>;
    callRPC(service: string, procedure: string, data: any): Promise<import("../rabbit").RPCResponsePayload>;
}
