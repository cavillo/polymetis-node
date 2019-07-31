import HandlerBase from './HandlerBase';
import EventHandlerBase from './EventHandlerBase';
import TaskHandlerBase from './TaskHandlerBase';
import RPCHandlerBase from './RPCHandlerBase';
import { ServiceResources } from '../';
declare const loadEvents: (resources: ServiceResources, events?: any, dir?: string) => Promise<any>;
declare const loadTasks: (resources: ServiceResources, tasks?: any, dir?: string) => Promise<any>;
declare const loadRPC: (resources: ServiceResources, rpcs?: any, dir?: string) => Promise<any>;
export { HandlerBase, EventHandlerBase, TaskHandlerBase, RPCHandlerBase, loadEvents, loadTasks, loadRPC, };
