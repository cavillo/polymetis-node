import { Request, Response } from 'express';
import Base from './Base';
export declare type RouteBaseTrustedMethods = 'get' | 'delete' | 'put' | 'post';
export default abstract class RouteBase extends Base {
    method: RouteBaseTrustedMethods;
    url: string;
    routeCallback(req: Request, res: Response): Promise<any>;
    protected abstract callback(req: Request, res: Response): Promise<any>;
    protected handleError(error: Error, res: Response): Promise<import("express-serve-static-core").Response>;
}
