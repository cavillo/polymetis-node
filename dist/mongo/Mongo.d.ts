import { MongoConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';
export default class MongoDB {
    private logger;
    private conf;
    private safeData;
    private client?;
    private db?;
    constructor(conf: MongoConfiguration, logger: Logger);
    init(): Promise<void>;
    close(): Promise<void>;
    private getDBInstance;
    private getClientInstance;
    isConnected(): Promise<boolean>;
    findDocumentById(collection: string, id: string | number): Promise<any | null>;
    findAllDocuments(collection: string): Promise<any[]>;
    findAllDocumentsByQuery(collection: string, query: any): Promise<any[]>;
    updateDocument(collection: string, query: any, data: any): Promise<any[]>;
    updateDocumentById(collection: string, id: string | number, data: any): Promise<any>;
    insertDocument(collection: string, data: any): Promise<any>;
    insertDocuments(collection: string, data: any[]): Promise<any>;
    deleteDocument(collection: string, query: any): Promise<void>;
    deleteDocuments(collection: string, query: any): Promise<void>;
    dropCollection(collection: string): Promise<void>;
    private transsformData;
}
