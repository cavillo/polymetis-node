import express, { Express, NextFunction, Request, Response } from 'express';
import ApiRoute from './Route';
import { ServiceResources } from '../';
export { express, Express, NextFunction, Request, Response, ApiRoute, loadRoutes, logApiRoute, };
declare const loadRoutes: (app: express.Express, resources: ServiceResources, routes?: any, dir?: string) => Promise<void>;
declare const logApiRoute: (resources: ServiceResources, req: express.Request, res: express.Response, next: express.NextFunction) => void;
