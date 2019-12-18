import * as _ from 'lodash';
import {
  ServiceResources,
  TaskHandlerBase,
} from 'polymetis-node';
import Fibonacci from '../Fibonacci';

export default class Handler extends TaskHandlerBase {
  public topic = 'calculate.fib';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    const number: number = _.get(data, 'number');

    const fib = new Fibonacci(this.resources);

    this.resources.logger.info('Calculating fibonacci value for:', number);
    const value = fib.calculate(number);

    await fib.upsert({ number, value });
  }
}
