import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';

// internal dependencies
import Base from './.base';

export default abstract class RouteBase extends Base {
  public url: string;

  /*
  Parent method that wraps the logic implementation
  callback method in a try catch for detecting errors
  and responding with the right codes and messages.
  */
  public async routeCallback(req: Request, res: Response): Promise<any> {
    try {
      return await this.callback(req, res);
    } catch (error) {
      await this.detectKnownErrors(error, res);
    }
  }

  /*
  Method to implement when adding an endpoint.
  Each RouteImpl should place the logic of the
  ExpressJS callback methods in here. The handling
  of errors and checking for authentication token,
  has benn abstracted to the Route base class.
  */
  protected abstract async callback(req: Request, res: Response): Promise<any>;

  protected async detectKnownErrors(error: Error, res: Response) {
    const message = _.get(error, 'message', 'Unknown error');
    const statusCode = _.get(error, 'statusCode', 500);

    this.resources.logger.error(statusCode, message, JSON.stringify(error));
    return res.status(statusCode).send(message);
  }
}