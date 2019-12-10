import {
  Request,
  Response,
  ApiRoute,
  ServiceResources,
} from 'polymetis-node';
import * as _ from 'lodash';

export default class Route extends ApiRoute {
  public url: string = '/fib';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async callback(req: Request, res: Response): Promise<any> {
    // Calling rpc fib-get-all in service worker
    // this.callRPC method comes with the ApiRoute class from polymetis
    // It receives as the first argument the name of the service where the RCP is defiend.
    // It receives as the second argument the name of the RCP topic defined.
    // It receives as the third argument the payload that the procedure will receive.
    // The async call returns a status and an error or the response data we receive from the procedure.
    const { status, data, error } = await this.callRPC('worker', 'fib-get-all', {});
    if (status === 'error') {
      this.resources.logger.error(error);
      return res.status(400).send(error);
    }
    if (status === 'timeout') {
      this.resources.logger.error(error);
      return res.status(500).send('timeout');
    }
    const retval: [] = data;

    res.send(retval);
  }
}