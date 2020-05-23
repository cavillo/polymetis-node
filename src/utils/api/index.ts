import * as _ from 'lodash';
import express, { Express, NextFunction, Request, Response } from 'express';

import { ServiceResources } from '../../ServiceBase';

const logApiRoute = (resources: ServiceResources, req: Request, res: Response, next: NextFunction) => {
  resources.logger.info(req.method, req.originalUrl);

  const cleanup = () => {
    res.removeListener('finish', logFinish);
  };

  const logFinish = () => {
    cleanup();

    if (res.statusCode >= 500) {
      resources.logger.error(req.method, req.originalUrl, res.statusCode);
    } else if (res.statusCode >= 400) {
      resources.logger.error(req.method, req.originalUrl, res.statusCode);
    } else if (res.statusCode < 300 && res.statusCode >= 200) {
      resources.logger.info(req.method, req.originalUrl, res.statusCode);
    } else {
      resources.logger.info(req.method, req.originalUrl, res.statusCode);
    }
  };

  res.on('finish', logFinish);

  next();
};

export {
  express,
  Express,
  NextFunction,
  Request,
  Response,
  logApiRoute,
};
