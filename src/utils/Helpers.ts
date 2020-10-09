import _ from 'lodash';
import { ServiceResources } from '..';
import { post, RPCResponsePayload } from './rpcs';

export const emitEvent = async (resources: ServiceResources, topic: string, data: any): Promise<void> => {
  return resources.rabbit.emit(
    topic,
    data,
  );
};

export const emitTask = async (resources: ServiceResources, task: string, data: any): Promise<void> => {
  const topic = `${resources.configuration.service.service}.${task}`;
  resources.rabbit.emit(
    topic,
    data,
  );
};

export const callRPC = async <T>(resources: ServiceResources, url: string, data: any, transactionId: string = this.generateTransactionId()): Promise<T> => {
  resources.logger.info('RPC-calling', url, transactionId);
  try {
    const response: RPCResponsePayload = await post(
      url,
      {
        transactionId,
        payload: data,
      },
    );

    if (response.transactionId !== transactionId) {
      throw new Error('Invalid transactionId');
    }
    if (!_.isNil(response.error)) {
      throw new Error(response.error);
    }

    return response.data;
  } catch (error) {
    resources.logger.error('RPC-calling-error', url, transactionId, error.message);
    throw new Error(error.message);
  }
};

export const generateTransactionId = (): string => {
  return `${_.random(1e10).toString()}-${_.random(1e10).toString()}-${Date.now()}`;
};
