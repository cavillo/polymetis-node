import { Request, Response } from 'express';
import { ServiceResources } from '../ServiceBase';
export default abstract class RouteBase {
    resources: ServiceResources;
    url: string;
    constructor(resources: ServiceResources);
    routeCallback(req: Request, res: Response): Promise<any>;
    callRPC(service: string, procedure: string, data: any): Promise<unknown>;
    protected abstract callback(req: Request, res: Response): Promise<any>;
    protected requireAuthentication(req: Request): Promise<any>;
    protected detectKnownErrors(thrownError: Error, httpResponse: Response): Promise<import("express-serve-static-core").Response>;
}
