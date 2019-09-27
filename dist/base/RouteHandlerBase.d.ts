import { Request, Response } from 'express';
import Base from './.base';
export default abstract class RouteBase extends Base {
    url: string;
    routeCallback(req: Request, res: Response): Promise<any>;
    callRPC(service: string, procedure: string, data: any): Promise<import("../rabbit").RPCResponsePayload>;
    protected abstract callback(req: Request, res: Response): Promise<any>;
    protected detectKnownErrors(error: Error, res: Response): Promise<import("express-serve-static-core").Response>;
}
