import express, { Express, NextFunction, Request, Response } from 'express';
import ServiceBase, { ServiceResources } from '../ServiceBase';
declare type TrustedEndpoints = 'get' | 'delete' | 'put' | 'post';
declare const loadRoutes: (service: ServiceBase, dir?: string) => Promise<void>;
declare const logApiRoute: (resources: ServiceResources, req: express.Request, res: express.Response, next: express.NextFunction) => void;
export { express, Express, NextFunction, Request, Response, TrustedEndpoints, loadRoutes, logApiRoute, };
