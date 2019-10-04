import { ServiceResources } from '..';
import { RPCResponsePayload } from '../rabbit';

export default class Base {
  constructor(protected resources: ServiceResources) {
    this.resources = resources;
  }

  public async emitEvent(topic: string, data: any) {
    return this.resources.rabbit.emit(
      topic,
      data,
    );
  }

  public async callRPC(service: string, procedure: string, data: any): Promise<RPCResponsePayload> {
    const { environment } = this.resources.configuration.service;
    const topic = `${environment}.${service}.rpc.${procedure}`;
    return this.resources.rabbit.callProcedure(
      topic,
      data,
    );
  }
}
