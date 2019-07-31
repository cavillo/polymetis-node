import { ServiceResources } from '../';
export default abstract class Base {
    protected resources: ServiceResources;
    constructor(resources: ServiceResources);
    callRPC(service: string, procedure: string, data: any): Promise<any>;
}
