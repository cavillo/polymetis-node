import * as _ from 'lodash';
import { ServiceResources, RPCHandlerBase } from 'polymetis-node';

export default class Handler extends RPCHandlerBase {
  // Name of the procedure that will be use to call it from other services
  public topic = 'fib-get-one';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  // RPC main functions
  // here it will return a number if it is in the database
  // or null if it isnt calculated yet
  protected async handleCallback(data: any): Promise<number | null> {
    this.resources.logger.debug('Executing fib-get-one RPC', data);

    return null;
  }
}