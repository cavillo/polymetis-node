import express, { Express, NextFunction, Request, Response } from 'express';
import { ServiceResources } from '../../ServiceBase';
declare const logApiRoute: (resources: ServiceResources, req: Request, res: Response, next: NextFunction) => void;
export { express, Express, NextFunction, Request, Response, logApiRoute, };
