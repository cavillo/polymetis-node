import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import HttpErrors from 'http-errors';

// internal dependencies
import Base from './Base';

export default abstract class RPCHandlerBase extends Base {
  public procedure: string;

  /*
  Parent method that wraps the logic implementation
  callback method in a try catch for detecting errors
  and responding with the right codes and messages.
  */
  public async routeCallback(req: Request, res: Response): Promise<any> {
    try {
      return await this.callback(req, res);
    } catch (error) {
      await this.handleError(error, res);
    }
  }

  /*
  Method to implement when adding an endpoint.
  Each RouteImpl should place the logic of the
  ExpressJS callback methods in here. The handling
  of errors and checking for authentication token,
  has been abstracted to the Route base class.
  */
  protected abstract async callback(req: Request, res: Response): Promise<any>;

  protected async handleError(error: Error, res: Response) {
    const message = _.get(error, 'message', 'Unknown error');

    this.resources.logger.error('RPC Error', this.procedure, message, JSON.stringify(error));
    return res.json({ error: { message } });
  }

  protected throwError(statusCode: number, message: string) {
    throw HttpErrors.createError(statusCode, message);
  }
}
