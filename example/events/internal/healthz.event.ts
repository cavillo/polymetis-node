import * as _ from 'lodash';
import EventHandlerBase from '../../EventHandlerBase';
import { ServiceResources } from 'ServiceBase';

export default class Handler extends EventHandlerBase {
  public topic = 'audited.healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    await this.emitTask('check.healthz', data);
  }
}