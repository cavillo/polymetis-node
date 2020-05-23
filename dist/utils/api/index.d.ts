import express, { Express, NextFunction, Request, Response } from 'express';
import { ServiceResources } from '../../ServiceBase';
declare const logApiRoute: (resources: ServiceResources, req: express.Request, res: express.Response, next: express.NextFunction) => void;
export { express, Express, NextFunction, Request, Response, logApiRoute, };
