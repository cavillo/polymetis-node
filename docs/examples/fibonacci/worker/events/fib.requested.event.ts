import * as _ from 'lodash';
import {
  EventHandlerBase,
  ServiceResources,
} from 'polymetis-node';

export default class Handler extends EventHandlerBase {
  public topic = 'fib.requested';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    const number: number = _.get(data, 'number', null); // safely get re.qbody.number or set as null if not defined

    // only integers
    if (!_.isInteger(_.toInteger(number))) {
      this.resources.logger.error('Invalid number');
    }

    await this.emitTask('calculate.fib', { number });
  }
}