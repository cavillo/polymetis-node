import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';

// internal dependencies
import { ServiceResources } from '../ServiceBase';

export default abstract class RouteBase {
  public resources: ServiceResources;
  public url: string;

  constructor(resources: ServiceResources) {
    // extend this object with everything passed in as options
    this.resources = resources;
    this.url = '';
  }

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

  protected async requireAuthentication(req: Request) {
    // Requiring token in Authorization header in the format
    // Authorization: Bearer #accessToken#
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw Error('No authorization header provided');
    }

    const authSplit = authHeader.split(' ');

    if (authSplit.length !== 2) {
      throw Error('Malformed authentication header. \'Bearer accessToken\' syntax expected');
    } else if (authSplit[0].toLowerCase() !== 'bearer') {
      throw Error('\'Bearer\' keyword missing from front of authorization header');
    }

    const accessToken = authSplit[1];
    try {
      this.resources.logger.warn('TODO', 'validating token...');
    } catch (error) {
      throw Error('Invalid token');
    }
    return;
  }

  protected async detectKnownErrors(thrownError: Error, httpResponse: Response) {
    const message = _.get(thrownError, 'message', 'Unknown error');
    const statusCode = _.get(thrownError, 'statusCode', 500);

    this.resources.logger.error(statusCode, message, JSON.stringify(thrownError));
    return httpResponse.status(statusCode).send(message);
  }
}