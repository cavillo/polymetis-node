# polymetis-node

[![Build Status](http://cloud.drone.io/api/badges/cavillo/polymetis-node/status.svg)](http://cloud.drone.io/cavillo/polymetis-node)

Wrapper for building micro-services ecosystems. Polymetis creates microservices with a connection to a rabbit message broker for handling events, task and RPC; and a connection to data storages such as redis, mongodb and postgres.

  - REST API for external or internal http consumption
  - RabbitMQ for event-task mesaging and Remote Procedure Calls
  - Redis connection provided for pub-sub or fast storage (cache maybe)
  - MongoDB specific collections usage per service for isolated data storage
  - Postgres connection for persistance storage shared between services

Polymetis is a boilerplate that provides a solid base for the creation of an ecosystem of isolated microservices. Eache service can implements its own functionality and coexists with other services within the same infrastucture.
Each microservice can create its own http(s) **REST API**, and its own event-task handling of events coming from the **RabitMQ** message broker.

# Installation

> **Note:** polymetis-node assumes your server is already running the services required for your microservices (RabbitMQ, Redis, Postgres, MongoDB).

Just install the npm package
```bash
$ npm install polymetis-node --save
```

## Infrastructure for services needed docker-compose

In case you dont have the needed infrastructure runing you can do it really easily with docker. The simplest and fastest way is by using docker-compose. (Do not use this in production).
In your server create a `docker-compose.yml` file and copy the following:

```yml
version: '2'
services:
  postgres:
    image: postgres
    restart: always
    environment:
      POSTGRES_USER: service
      POSTGRES_PASSWORD: service
      POSTGRES_DB: service
    ports:
      - '5432:5432'
  mongo:
    image: 'bitnami/mongodb:latest'
    restart: always
    ports:
      - '27017:27017'
    environment:
      - MONGODB_USERNAME=service
      - MONGODB_PASSWORD=service
      - MONGODB_DATABASE=service
  redis:
    image: 'redis:4.0-alpine'
    ports:
      - '6379:6379'
  rabbitmq:
    image: 'rabbitmq:3.7-management-alpine'
    ports:
      - '15671:15671'
      - '15672:15672'
      - '25672:25672'
      - '4369:4369'
      - '5671:5671'
      - '5672:5672'
```
Finally start your polymetis-node
```bash
$ docker-compose up --build --detach
```

# Usage

```typescript
import { ServiceBase, Configuration } from 'polymetis-node';

const conf: Configuration = {
  baseDir: __dirname,
  service: {
    environment: 'local',
    service: 'email',
  },
  api: {
    port: 8001,
  },
  mongo: {
    auth: {
      user: 'mongo_user',
      password: 'mongo_pass',
    },
    dbName: 'mongo_db',
    port: 27017,
    url: 'mongodb://localhost',
  },
  postgres: {
    database: 'pg_database',
    user: 'pg_user',
    password: 'pg_pass',
    port: 5432,
    ssl: true,
  },
  rabbit: {
    host: '',
    port: 5672,
    username: 'guest',
    password: 'guest',
  },
  redis: {
    host: 'localhost',
    port: 6379,
  },
};

const service = new ServiceBase(conf);
service
  .init()
  .then(
    () => console.log(),
  ).catch(
    (error: any) => service.logger.error(error),
  );

```

## ENV configuration
Another way to configure the service is via ```.env``` file. Polymetis will take all the information with the following form:
```bash
ENVIRONMENT='local'
SERVICE='email'

API_PORT='8001'

POSTGRES_HOST='localhost'
POSTGRES_PORT='5432'
POSTGRES_USERNAME='pg_user'
POSTGRES_PASSWORD='pg_pass'
POSTGRES_DATABASE='pg_database'
POSTGRES_SSL='true'

MONGO_URL='mongodb://localhost'
MONGO_USERNAME='mongo_user'
MONGO_PASSWORD='mongo_pass'
MONGO_DATABASE='mongo_db'
MONGO_PORT='27017'

RABBITMQ_HOST='localhost'
RABBITMQ_PORT='5672'
RABBITMQ_USERNAME='guest'
RABBITMQ_PASSWORD='guest'

REDIS_HOST='localhost'
REDIS_PORT='6379'
```

## Dir Structure
## Base Dir
A directory should be specified to the **configuration.baseDir** to locate the reources (events, tasks and API REST endpoints) to be deployed by the service.
```
base_dir
│
└───api
│   └───healthz
│       │   get.route.ts
│       │   ...
│   └───users
│       │   get.route.ts
│       │   post.route.ts
│       │   ...
│   ....
│
└───events
│   └───user
│       │   created.handler.ts
│       │   updated.handler.ts
│       │   ...
│   ....
└───tasks
│   └───send
│       │   welcome.handler.ts
│       │   reset-password.handler.ts
│       │   ...
│   ....
```

### API
Polymetis creates an **ExpressJS REST API** for the service on the port specified in the configuration. The endpoints should be implemented as follow:
All endpoints name should follow the following rules
- endpoints are defined in the ```baseDir/api``` directory specified un the service configuration
- endpoints **must start with** the method to implement ```get.``` | ```post.``` | ```put.``` | ```delete.```
- endpoints **must end with** ```.route.ts```
- endpoints **must define**  ```this.url``` wich wil be the url to be subscribe
- endpoints **must implement**  ```this.callback(req: Request, res: Response): Promise<any>``` wich wil be the function that will handle the request and produce a response
All files that follow this rules will be loaded as endpoints when the service starts
```typescript
// baseDir/healthz/get.route.ts
// endpoints must start with the method to implement [ get. | post. | put. | delete. ]
// endpoints must end with .route.ts
import {
  Request,
  Response,
  ApiRoute,
  ServiceResources,
} from 'polymetis-node';

export default class ApiRouteImpl extends ApiRoute {
  public url: string = '/healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  public async callback(req: Request, res: Response): Promise<any> {
    await this.resources.rabbit.emit('audited.healthz', {});
    res.status(200).send('Im ok!');
  }
}
```
### Events and Tasks
Polymetis tries to implement the **tasks-events** pattern for microservices. For this it relies in RabbitMQ for messaging between services. You can read further in this [article](https://runnable.com/blog/event-driven-microservices-using-rabbitmq)
- Events are notifications that tell subscribed applications when something has happened. Applications subscribe to certain events and respond by creating tasks for themselves. Events should never modify state directly.
- Tasks are actions which modify state. The only thing that can create a task for a given application is the application itself. This way, applications cannot directly modify each other‘s states.

Events and Tasks implements a handler class defined to abstract some logic and make the handling more straight forward.

All handlers name should follow the following ruules
- handlers are defined in the ```baseDir/events``` or ```baseDir/tasks```  directory specified un the service configuration
- handlers **must end with** ```.handler.ts```
- handlers **must define** ```this.topic``` to specify the rabbit topic to be subscribed
- handlers **must implement** ```this.handleCallback``` to handle the event/task
All files that follow this rules will be loaded as handlers when the service starts

**Event**
```typescript
import * as _ from 'lodash';
import { ServiceResources, EventHandlerBase } from 'polymetis-node';

export default class Handler extends EventHandlerBase {
  public topic = 'audited.healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    await this.emitTask('check.healthz', data);
  }
}
```
**Task**
```typescript
import * as _ from 'lodash';
import { ServiceResources, TaskHandlerBase } from 'polymetis-node';

export default class Handler extends TaskHandlerBase {
  public topic = 'check.healthz';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<void> {
    this.resources.logger.log('Checking healthz...');
    this.resources.logger.log('=> Logger status...', 'ok');
    this.resources.logger.log('=> Mongo status...', await this.resources.mongo.isConnected());
    this.resources.logger.log('=> Check finished...');
  }
}
```

> **Note:** polymetis prefixs task topic's automaticaly with the service name specified in the configuration **configuration.service.service**. In the example (asumming the service name is `email`), the real topic to listen is check.healthz, but polymetis abstract this so every event emits and listens only for its own tasks.

### RPC
Polymetis allows to call remote procedures defined and published by the microservices in the ecosystem. Remote procedures are called using RabbitMQ.
All defined RCP in a service:
- are defined in the ```baseDir/rpc``` directory specified un the service configuration
- **must end with** ```.rpc.ts```
- **must define**  ```this.topic``` wich represents the name of the procedure
- **must implement**  ```this.handleCallback(data: any): Promise<any>``` wich will be the function that implements the logic of the procedure
All files that follow this rules will be loaded as rpc when the service starts following the format ```environment.service.rpc.PROC_NAME```

```typescript
import * as _ from 'lodash';
import { ServiceResources, RPCHandlerBase } from 'polymetis-node';

export default class Handler extends RPCHandlerBase {
  public topic = 'fibonacci';

  constructor(resources: ServiceResources) {
    super(resources);
  }

  protected async handleCallback(data: any): Promise<any> {
    return this.fibonacci(_.toInteger(_.get(data, 'number', '0')));
  }

  private fibonacci(n: number): number {
    if (n === 0 || n === 1) {
      return n;
    }
    return n + this.fibonacci(n - 1);
  }
}
```

APIRouteHandler, EventsHandler and TasksHandler define the helper method ```callRPC(service: string, procedure: string, data: any)```  that abstract the call to the remote procedure of a specific service in the same environment.
```typescript
    const result = await this.callRPC('math', 'fibonacci', { number });
```

