import { Request, Response } from 'express';
import Base from './Base';
export default abstract class RPCHandlerBase extends Base {
    procedure: string;
    routeCallback(req: Request, res: Response): Promise<any>;
    protected abstract callback(data: {
        transactionId: string;
        payload: any;
    }): Promise<any>;
    protected handleSuccess(transactionId: string, data: any, res: Response): import("express-serve-static-core").Response;
    protected handleError(error: Error, req: Request, res: Response): import("express-serve-static-core").Response;
    protected throwError(statusCode: number, message: string): void;
}
