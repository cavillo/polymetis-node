import * as _ from 'lodash';
import { ServiceResources, RPCHandlerBase } from 'polymetis-node';
import Fibonacci, { IFibonacci } from '../Fibonacci';

export default class Handler extends RPCHandlerBase {
  // Name of the procedure that will be use to call it from other services
  public topic = 'fib-get-one';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  // RPC main functions
  // here it will return a number if it is in the database
  // or null if it isnt calculated yet
  protected async handleCallback(data: any): Promise<IFibonacci> {
    const number = _.get(data, 'number', null);

    if (_.isNil(number)) {
      throw Error('Wrong number');
    }

    const fibSvc = new Fibonacci(this.resources);
    const retval = await fibSvc.getOne(number);

    if (_.isNil(retval.value)) {
      this.emitEvent('fib.requested', { number });
    }

    return retval;
  }
}