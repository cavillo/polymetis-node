import _ from 'lodash';
import {
  emitEvent,
  emitTask,
  callRPC,
  generateTransactionId,
} from '../utils/Helpers';
import { ServiceResources } from '..';

export default class Base {
  constructor(protected resources: ServiceResources) {
    this.resources = resources;
  }

  public async emitEvent(topic: string, data: any) {
    return emitEvent(
      this.resources,
      topic,
      data,
    );
  }

  public async emitTask(task: string, data: any) {
    emitTask(this.resources, task, data);
  }

  public async callRPC<T>(url: string, data: any, transactionId: string = this.generateTransactionId()): Promise<T> {
    return callRPC(this.resources, url, data, transactionId);
  }

  protected generateTransactionId(): string {
    return generateTransactionId();
  }
}
