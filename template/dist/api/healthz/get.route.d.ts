import { Request, Response, ApiRoute, ServiceResources } from 'polymetis-node';
export default class ApiRouteImpl extends ApiRoute {
    url: string;
    constructor(resources: ServiceResources);
    callback(req: Request, res: Response): Promise<any>;
}
