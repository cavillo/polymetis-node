import * as _ from 'lodash';
import mongoose from 'mongoose';
import { ServiceResources } from 'polymetis-node';
import FibonacciSchema, { IFibonacciModel } from './FibonacciModel';

export interface IFibonacci {
  number: number;
  value?: number;
}

export default class MongoDBConnection {
  constructor(protected resources: ServiceResources) { }

  async connectDB() {
    try {
      const mongoConf = {
        auth: {
          user: _.get(process.env, 'MONGO_USERNAME'),
          password: _.get(process.env, 'MONGO_PASSWORD'),
        },
        host: _.get(process.env, 'MONGO_HOST'),
        port: _.toNumber(_.get(process.env, 'MONGO_PORT')),
        dbName: _.get(process.env, 'MONGO_DATABASE'),
      };

      const url = `mongodb://${mongoConf.auth.user}:${mongoConf.auth.password}@${mongoConf.host}:${mongoConf.port}/${mongoConf.dbName}`;
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
      this.resources.logger.info(`Connected to database ${this.resources.configuration.service.service} service`);
    } catch {
      this.resources.logger.error(`connection to database ${this.resources.configuration.service.service} service fail`);
    }
  }

  async getAll(): Promise<IFibonacci[]> {
    await this.connectDB();

    const data: IFibonacciModel[] = await FibonacciSchema.find();
    return data.map(this.toPublic);
  }

  async getOne(number: number): Promise<IFibonacci> {
    await this.connectDB();

    const data: IFibonacciModel[] = await FibonacciSchema.find({ number});
    if (_.isEmpty(data)) {
      await this.upsert({ number });
      return { number };
    }
    return this.toPublic(data[0]);
  }

  async upsert(fibonacci: IFibonacci): Promise<void> {
    await this.connectDB();

    await FibonacciSchema.updateOne(
      { number: fibonacci.number },
      fibonacci,
      { upsert: true },
    );
  }

  calculate(number: number) {
    if (number === 0) return 0;
    if (number === 1) return 1;

    return this.calculate(number - 1) + this.calculate(number - 2);
  }

  private toPublic(fib: IFibonacciModel): IFibonacci {
    return _.pick(fib, ['number', 'value']);
  }
}
