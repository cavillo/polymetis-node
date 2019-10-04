import { Request, Response } from 'express';
import Base from './Base';
export default abstract class RouteBase extends Base {
    url: string;
    routeCallback(req: Request, res: Response): Promise<any>;
    callRPC(service: string, procedure: string, data: any): Promise<import("../rabbit").RPCResponsePayload>;
    protected abstract callback(req: Request, res: Response): Promise<any>;
    protected requireAuthentication(req: Request): Promise<any>;
    protected detectKnownErrors(thrownError: Error, httpResponse: Response): Promise<import("express-serve-static-core").Response>;
}
