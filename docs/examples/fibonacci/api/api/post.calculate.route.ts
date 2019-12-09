import {
  Request,
  Response,
  ApiRoute,
  ServiceResources,
} from 'polymetis-node';
import * as _ from 'lodash';

export default class Route extends ApiRoute {
  public url: string = '/calculate';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async callback(req: Request, res: Response): Promise<any> {
    const number: number = _.get(req.body, 'number', null); // safely get re.qbody.number or set as null if not defined
    // only integers
    if (!_.isInteger(number)) {
      return res.status(400).send('Invalid number');
    }

    // Here goes our logic
    this.resources.logger.debug('Calculating fibonacci for', number);
    // Here goes our logic

    res.sendStatus(200);
  }
}