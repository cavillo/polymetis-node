import * as _ from 'lodash';
import TaskHandlerBase from '../../TaskHandlerBase';
import { ServiceResources } from 'ServiceBase';

export default class Handler extends TaskHandlerBase {
  public topic = 'check.healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    this.resources.logger.log('Checking healthz...');
    this.resources.logger.log('=> Logger status...', 'ok');
    this.resources.logger.log('=> Mongo status...', await this.resources.mongo.isConnected());
    this.resources.logger.log('=> Check finished...');
  }
}