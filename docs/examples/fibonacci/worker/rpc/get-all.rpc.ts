import * as _ from 'lodash';
import { ServiceResources, RPCHandlerBase } from 'polymetis-node';
import Fibonacci from '../Fibonacci';
export default class Handler extends RPCHandlerBase {
  // Name of the procedure that will be use to call it from other services
  public topic = 'fib-get-all';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  // RPC main functions
  // here it will return all numbers calculated in the database
  protected async handleCallback(data: any): Promise<any[]> {
    const fibSvc = new Fibonacci(this.resources);
    const retval = await fibSvc.getAll();

    return retval;
  }
}