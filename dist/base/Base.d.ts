import { ServiceResources } from '..';
import { RPCResponsePayload } from '../rabbit';
export default class Base {
    protected resources: ServiceResources;
    constructor(resources: ServiceResources);
    emitEvent(topic: string, data: any): Promise<void>;
    callRPC(service: string, procedure: string, data: any): Promise<RPCResponsePayload>;
}