import { expect } from 'chai';
import * as _ from 'lodash';
import axios from 'axios';
import 'mocha';
import {
  ServiceBase,
  Configuration,
  RouteHandlerBase,
  EventHandlerBase,
  TaskHandlerBase,
  RPCHandlerBase,
  Request,
  Response,
} from '../dist';

import configuration from './conf/service.conf';

/**
 * The objective of the test is to verify
 * the basic service comunication for Events and Tasks.
 * - A global tmp variable (boolean) is defined as false.
 * - A PUT request is made to the API where an event
 * [tmp-variable-update.requrired] is emited that
 * creates the task [update.tmp-variable].
 * - After the task is performed, the variable tmp should be true.
 */

let service: ServiceBase;
let tmp: boolean = false;

// api route
class ApiRouteImpl extends RouteHandlerBase {
  public url: string = '/tmp-variable';

  public async callback(req: Request, res: Response): Promise<any> {
    this.emitEvent('tmp-variable-update.requrired', {});
    return res.status(200).send('ok');
  }
}
class ApiRouteImplSync extends RouteHandlerBase {
  public url: string = '/tmp-variable-sync';

  public async callback(req: Request, res: Response): Promise<any> {
    const { error, status, transactionId, data } = await this.callRPC(configuration.service.service, 'update-tmp-variable', { value: true });
    if (error) return res.status(500).send(error);

    return res.status(200).send('ok');
  }
}

// event
class EventImpl extends EventHandlerBase {
  public topic: string = 'tmp-variable-update.requrired';

  protected async handleCallback(data: any): Promise<void> {
    await this.emitTask('update.tmp-variable', {});
  }
}

// task
class TaskImpl extends TaskHandlerBase {
  public topic: string = 'update.tmp-variable';

  protected async handleCallback(data: any): Promise<void> {
    tmp = true;
  }
}

// rpc
class RPCImpl extends RPCHandlerBase {
  public topic: string = 'update-tmp-variable';

  protected async handleCallback(data: any): Promise<void> {
    const value = _.get(data, 'value');

    if (_.isNil(value)) throw Error('Invalid param');

    tmp = value;
  }
}

// helper
const delay = (seconds: number): Promise <void> => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

describe('Start service', () => {
  before(async () => {
    service = new ServiceBase({ configuration });
    await service.init();

    // load event
    const event = new EventImpl(service.resources);
    await service.loadEvent(event);

    // load task
    const task = new TaskImpl(service.resources);
    await service.loadTask(task);

    // load rpc
    const rpc = new RPCImpl(service.resources);
    await service.loadRPC(rpc);

    // load route
    const route = new ApiRouteImpl(service.resources);
    const routeSync = new ApiRouteImplSync(service.resources);
    await service.loadRoute(route, 'put');
    await service.loadRoute(routeSync, 'put');
    await service.startAPI();
  });

  beforeEach(async () => {
    tmp = false;
  });

  it('API, events and task', async () => {
    // initial value is fasle
    expect(tmp).to.equal(false);

    // PUT request for update tmp variable
    const response = await axios.put('http://localhost:8000/tmp-variable', {});
    expect(response.status).to.equal(200);

    // delay 1 sec to be sure the events went on.
    await delay(1);

    expect(tmp).to.equal(true);
  });

  it('API, RPC', async () => {
    // initial value is fasle
    expect(tmp).to.equal(false);

    // PUT request for update tmp variable
    const response = await axios.put('http://localhost:8000/tmp-variable-sync', {});
    expect(response.status).to.equal(200);

    // delay 1 sec to be sure the events went on.
    await delay(1);

    expect(tmp).to.equal(true);
  });
});
