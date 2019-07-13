import {
  Request,
  Response,
  ApiRoute,
  ServiceResources,
} from '../../Api';

export default class ApiRouteImpl extends ApiRoute {
  public url: string = '/healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async callback(req: Request, res: Response): Promise<any> {
    await this.resources.rabbit.emit('audited.healthz', {});
    res.status(200).send('Im ok!');
  }
}