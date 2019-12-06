# Fibonacci Example

The most over complicated and inefficient fibonacci calculator of all time.

![](./fib-example-general.png)

## Topics

- Simple Event-Driven Design
- Scalable Fibonacci service
- API service
- Use of light RPC's


## Infrastructure

We are going to require the following:
- RabbitMQ
- MongoDB

Create a `docker-compose.yml` file and copy the following (do not use this in production):

```yml
version: '2'
services:
  rabbitmq:
    image: 'rabbitmq:3.7-management-alpine'
    restart: always
    ports:
      - '15672:15672'
      - '5672:5672'
  mongo:
    image: 'bitnami/mongodb:latest'
    restart: always
    ports:
      - '27017:27017'
    environment:
      - MONGODB_USERNAME=fibonacci
      - MONGODB_PASSWORD=fibonacci
      - MONGODB_DATABASE=fibonacci
```
Finally start the service
```bash
$ docker-compose up -d
```

# Services
We are going to create two services:
- API (server)
- Fibonacci (worker)

## API service

To access our backend we are going to create a REST API to allow provide the needed endpoints for our client application.

For this we are going to create a service using **polymetis** which provides an easy way to create REST endopints.

```sh
mkdir api
cd api
npm init
```

Specify the entry point as `index.ts`.

Install all the dependecies for typescript, mongo, lodash(super useful) and **polymetis**
```sh
npm i --save-dev @types/dotenv @types/lodash @types/mongoose @types/node ts-node typescript
npm i --save dotenv lodash mongoose polymetis-node
```

Create an `.env` file with the configuration of the service
```sh
touch .env
```
```
ENVIRONMENT='local'
SERVICE='api'

# Logger mode
# ALL='0', DEBUG='1', INFO='2', WARN='3', ERROR='4', OFF='5'
LOGGER_MODE='0'

API_PORT='8000'
API_BASE_ROUTE='/api'

RABBITMQ_HOST='localhost'
RABBITMQ_PORT='5672'
RABBITMQ_USERNAME='guest'
RABBITMQ_PASSWORD='guest'

MONGO_HOST='localhost'
MONGO_USERNAME='fibonacci'
MONGO_PASSWORD='fibonacci'
MONGO_DATABASE='fibonacci'
MONGO_PORT='27017'
```

Next create an `index.ts` file and lets create our first polymetis service

```sh
touch index.ts
```

```typescript
import { ServiceBase } from 'polymetis-node';

const service = new ServiceBase();
service.init()
  .then(async () => {
    service.logger.info('Initialized...');
  })
  .catch((error) => {
    service.logger.error('Exiting:', error);
  });
```

Start the service
```sh
$ ts-node index.ts
[local::api] [2019-12-06 07:25:58:786] [INFO] Rabbit connection initialized...
[local::api] [2019-12-06 07:25:58:788] [INFO] Initialized...
```

## ENV configuration
Another way to configure the service is via ```.env``` file. Polymetis will take all the information with the following form:
```bash
# Service
ENVIRONMENT='test'
SERVICE='service'

# Logger mode
# ALL='0', DEBUG='1', INFO='2', WARN='3', ERROR='4', OFF='5'
LOGGER_MODE='0'

# API
API_PORT='7002'
API_BASE_ROUTE='/api'

# RabbitMQ
RABBITMQ_USERNAME='guest'
RABBITMQ_PASSWORD='guest'
RABBITMQ_HOST='localhost'
RABBITMQ_PORT='5672'
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
│       │   created.event.ts
│       │   updated.event.ts
│       │   ...
│   ....
└───tasks
│   └───send
│       │   welcome.task.ts
│       │   reset-password.task.ts
│       │   ...
│   ....
└───rpc
│   └───send
│       │   custom.rpc.ts
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

RouteHandler, EventsHandler and TasksHandler define the helper method ```callRPC(service: string, procedure: string, data: any)```  that abstract the call to the remote procedure of a specific service in the same environment.
```typescript
    const result = await this.callRPC('math', 'fibonacci', { number });
```

