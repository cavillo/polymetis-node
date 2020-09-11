import axios, { AxiosResponse } from 'axios';

export interface RPCResponsePayload {
  transactionId: string;
  data?: any;
  error?: string;
}

export const post = async (
  url: string,
  data: {
    transactionId: string,
    payload: { [key: string]: any },
  },
): Promise<RPCResponsePayload> => {
  try {
    const response: AxiosResponse<RPCResponsePayload> = await axios.post(url, data);

    return response.data;
  } catch (error) {
    return {
      transactionId: data.transactionId,
      error: error.message,
    };
  }
};
