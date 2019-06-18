import * as _ from 'lodash';
import EventHandlerBase from '../../EventHandlerBase';
import { ServiceResources } from 'ServiceBase';

export default class Handler extends EventHandlerBase {
  public topic = 'user.registered';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    if (_.has(data, 'email')) {
      await this.emitTask('send.welcome', data);
    }
  }
}