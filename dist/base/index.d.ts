import Base from './Base';
import HandlerBase from './HandlerBase';
import EventHandlerBase from './EventHandlerBase';
import TaskHandlerBase from './TaskHandlerBase';
import RPCHandlerBase from './RPCHandlerBase';
import RouteHandlerBase from './RouteHandlerBase';
import ServiceBase from '../ServiceBase';
declare const loadEvents: (service: ServiceBase, dir?: string) => Promise<void>;
declare const loadTasks: (service: ServiceBase, dir?: string) => Promise<void>;
declare const loadRPC: (service: ServiceBase, dir?: string) => Promise<void>;
export { Base, HandlerBase, EventHandlerBase, TaskHandlerBase, RPCHandlerBase, RouteHandlerBase, loadEvents, loadTasks, loadRPC, };
