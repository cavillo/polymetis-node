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
      const transactionId: string = _.get(req.body, 'transactionId');
      const payload: any = _.get(req.body, 'payload', {});

      if (
            _.isNil(transactionId) || !_.isString(transactionId)
        ||  _.isNil(payload) || !_.isObject(payload)
      ) {
        throw new Error('Invalid params');
      }

      this.resources.logger.info('RPC-start', this.procedure, transactionId);

      const result = await this.callback({ transactionId, payload });
      return this.handleSuccess(transactionId, result, res);
    } catch (error) {
      this.handleError(error, req, res);
    }
  }

  /*
  Method to implement when adding an endpoint.
  Each RouteImpl should place the logic of the
  ExpressJS callback methods in here. The handling
  of errors and checking for authentication token,
  has been abstracted to the Route base class.
  */
  protected abstract async callback(data: { transactionId: string, payload: any }): Promise<any>;

  protected handleSuccess(transactionId: string, data: any, res: Response) {
    this.resources.logger.info('RPC-success', this.procedure, transactionId);
    return res.status(200).send({
      transactionId,
      data,
    });
  }

  protected handleError(error: Error, req: Request, res: Response) {
    const message = _.get(error, 'message', 'Unknown error');
    const transactionId: string = _.get(req.body, 'transactionId');

    this.resources.logger.error('RPC-error', this.procedure, transactionId, message);
    return res.json({ transactionId, error: message });
  }

  protected throwError(statusCode: number, message: string) {
    throw HttpErrors.createError(statusCode, message);
  }
}
