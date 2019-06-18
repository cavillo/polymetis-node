import * as _ from 'lodash';
import TaskHandlerBase from '../../TaskHandlerBase';
import { ServiceResources } from 'ServiceBase';

export default class Handler extends TaskHandlerBase {
  public topic = 'send.welcome';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    const email = _.get(data, 'email', null);
    this.resources.logger.log('Sending email to', email);
  }
}