import { ServiceResources } from '../';
import { RPCResponsePayload } from '../rabbit';

export default abstract class Base {
  constructor(protected resources: ServiceResources) {
    this.resources = resources;
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
