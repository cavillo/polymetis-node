import { Request, Response } from 'express';
import Base from './Base';
export default abstract class RPCHandlerBase extends Base {
    procedure: string;
    routeCallback(req: Request, res: Response): Promise<any>;
    protected abstract callback(data: {
        transactionId: string;
        payload: any;
    }): Promise<any>;
    protected handleSuccess(transactionId: string, data: any, res: Response): Response<any, Record<string, any>>;
    protected handleError(error: Error, req: Request, res: Response): Response<any, Record<string, any>>;
    protected throwError(statusCode: number, message: string): void;
}
