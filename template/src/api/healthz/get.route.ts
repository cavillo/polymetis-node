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
    await this.resources.rabbit.emit('healthz.audited', {});

    const response = await this.callRPC(this.resources.configuration.service.service, 'check-healthz', {});

    res.status(200).send(_.get(response, 'data', 'Something is not ok'));
  }
}