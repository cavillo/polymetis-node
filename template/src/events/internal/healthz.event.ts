import * as _ from 'lodash';
import {
  EventHandlerBase,
  ServiceResources,
} from 'polymetis-node';

export default class Handler extends EventHandlerBase {
  public topic = 'healthz.audited';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    await this.emitTask('check.healthz', data);
  }
}