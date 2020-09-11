export interface RPCResponsePayload {
    transactionId: string;
    data?: any;
    error?: string;
}
export declare const post: (url: string, data: {
    transactionId: string;
    payload: {
        [key: string]: any;
    };
}) => Promise<RPCResponsePayload>;
