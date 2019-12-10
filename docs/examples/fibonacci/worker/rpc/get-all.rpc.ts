import * as _ from 'lodash';
import { ServiceResources, RPCHandlerBase } from 'polymetis-node';

export default class Handler extends RPCHandlerBase {
  // Name of the procedure that will be use to call it from other services
  public topic = 'fib-get-all';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  // RPC main functions
  // here it will return all numbers calculated in the database
  protected async handleCallback(data: any): Promise<any[]> {
    this.resources.logger.debug('Executing fib-get-one RPC', data);

    return [];
  }
}