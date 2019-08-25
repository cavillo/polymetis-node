import * as _ from 'lodash';
import {
  ServiceResources,
  TaskHandlerBase
} from 'polymetis-node';

export default class Handler extends TaskHandlerBase {
  public topic = 'check.healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    this.resources.logger.info('=> Check ok');
  }
}