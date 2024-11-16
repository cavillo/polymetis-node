import { Request, Response } from 'express';
import Base from './Base';
export type RouteBaseTrustedMethods = 'get' | 'delete' | 'put' | 'post';
export default abstract class RouteBase extends Base {
    method: RouteBaseTrustedMethods;
    url: string;
    routeCallback(req: Request, res: Response): Promise<any>;
    protected abstract callback(req: Request, res: Response): Promise<any>;
    protected handleError(error: Error, res: Response): Response<any, Record<string, any>>;
    protected throwError(statusCode: number, message: string): void;
}
