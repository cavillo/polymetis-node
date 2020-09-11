import { ServiceResources } from '..';
export default class Base {
    protected resources: ServiceResources;
    constructor(resources: ServiceResources);
    emitEvent(topic: string, data: any): Promise<void>;
    emitTask(task: string, data: any): Promise<void>;
    callRPC<T>(url: string, data: any, transactionId?: string): Promise<T>;
    protected generateTransactionId(): string;
}
