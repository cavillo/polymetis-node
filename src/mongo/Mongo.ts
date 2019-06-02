import mongodb, { ObjectID } from 'mongodb';
import * as _ from 'lodash';

import { MongoConfiguration } from '../utils/ServiceConf';
import Logger from '../utils/Logger';

export default class MongoDB {
  private logger: Logger;
  private conf: MongoConfiguration;

  private safeData: boolean;

  private client?: mongodb.MongoClient;
  private db?: mongodb.Db;

  constructor(conf: MongoConfiguration, logger: Logger) {
    this.logger = logger;
    this.conf = conf;
    this.safeData = true;
  }

  public async init() {
    try {
      if (
           !this.conf
        || !this.conf.url
        || !this.conf.auth
        || !this.conf.auth.user
        || !this.conf.auth.password
        || !this.conf.dbName
        || !this.conf.port
      ) {
        this.logger.warn('MongoDB: No parameters for initialization. Skiping...');
        return;
      }
      const mongoOpts: mongodb.MongoClientOptions = {
        auth: _.get(this.conf, 'auth', null),
        authSource: this.conf.dbName,
        keepAlive: true,
        useNewUrlParser: true,
      };
      const url = `${this.conf.url}:${this.conf.port}`;

      this.client = await mongodb.MongoClient.connect(url, mongoOpts);
      this.db = this.client.db(this.conf.dbName);

      this.logger.ok('MongoDB initialized...');
    } catch (error) {
      this.logger.error('MongoDB initialization failed: ', error.message);
    }
  }

  public async close() {
    return this.client && await this.client.close();
  }

  private async getDBInstance(retry = false): Promise<mongodb.Db> {
    if (this.db) {
      return this.db;
    }
    if (!retry) {
      await this.init();
      return this.getDBInstance(true);
    }
    throw new Error('Unable to connect.');
  }

  private async getClientInstance(): Promise<mongodb.MongoClient> {
    if (this.client) {
      return this.client;
    }
    await this.init();
    return this.getClientInstance();
  }

  public async isConnected() {
    const client: mongodb.MongoClient = await this.getClientInstance();
    return client.isConnected();
  }

  public async findDocumentById(collection: string, id: string | number): Promise<any | null> {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);
    // Find some documents
    const doc = await coll.findOne({ _id: new ObjectID(id) });
    return this.transsformData(doc);
  }

  public async findAllDocuments(collection: string): Promise<any[]> {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);
    // Find some documents
    const docs = await coll.find({}).toArray();

    return this.transsformData(docs || []);
  }

  public async findAllDocumentsByQuery(collection: string, query: any): Promise<any[]> {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);
    // Find some documents
    const docs = await coll.find(query).toArray();

    return this.transsformData(docs || []);
  }

  public async updateDocument(collection: string, query: any, data: any): Promise<any[]> {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);

    await coll.updateOne(query, { $set: data });

    return await this.findAllDocumentsByQuery(collection, query);
  }

  public async updateDocumentById(collection: string, id: string | number, data: any): Promise<any> {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);

    await coll.updateOne({ _id: new ObjectID(id) }, { $set: _.omit(data, '_id') });

    return await this.findDocumentById(collection, id);
  }

  public async insertDocument(collection: string, data: any) {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);

    if (_.has(data, '_id')) {
      data._id = new ObjectID(data._id);
    }

    const result = await coll.insertOne(data);

    return this.transsformData(result.ops[0]);
  }

  public async insertDocuments(collection: string, data: any[]) {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);

    const result = await coll.insertMany(data);

    return this.transsformData(result.ops);
  }

  public async deleteDocument(collection: string, query: any): Promise<void> {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);

    await coll.deleteOne(query);

    return;
  }

  public async deleteDocuments(collection: string, query: any): Promise<void> {
    const db: mongodb.Db = await this.getDBInstance();

    const coll = db.collection(collection);

    await coll.deleteMany(query);

    return;
  }

  public async dropCollection(collection: string) {
    const db: mongodb.Db = await this.getDBInstance();

    await db.collection(collection).drop();
  }

  private transsformData(data: any) {
    if (this.safeData) {
      return JSON.parse(JSON.stringify(data));
    }
    return data;
  }
}
