import { ServiceResources } from '..';
export declare const emitEvent: (resources: ServiceResources, topic: string, data: any) => Promise<void>;
export declare const emitTask: (resources: ServiceResources, task: string, data: any) => Promise<void>;
export declare const callRPC: <T>(resources: ServiceResources, url: string, data: any, transactionId?: string) => Promise<T>;
export declare const generateTransactionId: () => string;
