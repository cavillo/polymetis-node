import * as _ from 'lodash';
import {
  Request,
  Response,
  ApiRoute,
  ServiceResources,
} from 'polymetis-node';

export default class ApiRouteImpl extends ApiRoute {
  public url: string = '/healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async callback(req: Request, res: Response): Promise<any> {
    await this.emitTask('check.healthz', {});

    res.status(200).send('ok');
  }
}