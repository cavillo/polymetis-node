import { expect } from 'chai';
import * as _ from 'lodash';
import axios from 'axios';
import 'mocha';
import {
  ServiceBase,
  configuration,
  RouteHandlerBase,
  EventHandlerBase,
  TaskHandlerBase,
  RPCHandlerBase,
  Request,
  Response,
  RouteBaseTrustedMethods,
} from '../dist';

import testConfiguration from './conf/service.conf';
import { assert } from 'console';

/**
 * The objective of the test is to verify
 * the basic service communication for Events and Tasks.
 * - A global tmp variable (boolean) is defined as false.
 * - A PUT request is made to the API where an event
 * [tmp-variable-update.required] is emitted that
 * creates the task [update.tmp-variable].
 * - After the task is performed, the variable tmp should be true.
 */

let service: ServiceBase;
let tmp: boolean = false;

// api route
class ApiRouteImpl extends RouteHandlerBase {
  public url: string = '/tmp-variable';
  public method: RouteBaseTrustedMethods = 'put';

  public async callback(req: Request, res: Response): Promise<any> {
    this.emitEvent('tmp-variable-update.required', {});
    return res.status(200).send('ok');
  }
}
class ApiRouteImplSync extends RouteHandlerBase {
  public url = '/tmp-variable-sync';
  public method: RouteBaseTrustedMethods = 'put';

  public async callback(req: Request, res: Response): Promise<any> {
    try {
      await this.callRPC<void>(
        'http://localhost:8111/update-tmp-variable-err',
        { value: true },
      );
      assert(false);
    } catch (error) {
      assert(true, error.message);
    }

    await this.callRPC<void>(
      'http://localhost:8111/update-tmp-variable',
      { value: true },
    );
    return res.status(200).send('ok');
  }
}

// event
class EventImpl extends EventHandlerBase {
  public topic: string = 'tmp-variable-update.required';

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
  public procedure: string = 'update-tmp-variable';

  protected async callback({ transactionId, payload }): Promise<void> {
    const value = _.get(payload, 'value');

    if (_.isNil(value)) throw Error('Invalid param');

    tmp = value;
    return;
  }
}
class RPCImplErr extends RPCHandlerBase {
  public procedure: string = 'update-tmp-variable-err';

  protected async callback({ transactionId, payload }): Promise<void> {
    throw new Error(this.procedure);
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
    service = new ServiceBase({ configuration: { ...configuration, ...testConfiguration } });
    await service.init();

    // load event
    const event = new EventImpl(service.resources);
    await service.loadEvent(event);

    // load task
    const task = new TaskImpl(service.resources);
    await service.loadTask(task);

    // load route
    const route = new ApiRouteImpl(service.resources);
    const routeSync = new ApiRouteImplSync(service.resources);
    await service.loadRoute(route);
    await service.loadRoute(routeSync);
    await service.startAPI();

    // load rpc
    const rpc = new RPCImpl(service.resources);
    const rpcErr = new RPCImplErr(service.resources);
    await service.loadRPC(rpc);
    await service.loadRPC(rpcErr);
    await service.startRPCs();
  });

  beforeEach(async () => {
    tmp = false;
  });

  it('API, events and task', async () => {
    // initial value is false
    expect(tmp).to.equal(false);

    // PUT request for update tmp variable
    const response = await axios.put('http://localhost:8000/tmp-variable', {});
    expect(response.status).to.equal(200);

    // delay 1 sec to be sure the events went on.
    await delay(1);

    expect(tmp).to.equal(true);
  });

  it('API, RPC', async () => {
    // initial value is false
    expect(tmp).to.equal(false);

    // PUT request for update tmp variable
    const response = await axios.put('http://localhost:8000/tmp-variable-sync', {});
    expect(response.status).to.equal(200);

    // delay 1 sec to be sure the events went on.
    await delay(1);

    expect(tmp).to.equal(true);
  });
});
