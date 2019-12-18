import { Document, model, Schema } from 'mongoose';

export interface IFibonacciModel extends Document {
  number: number;
  value?: number;
}

const fibonacciSchema: Schema = new Schema(
  {
    number: { type: Number, required: true },
    value:  { type: Number },
  },
  { _id: false },
);

export default model<IFibonacciModel>(
  'FibonacciSchema',
  fibonacciSchema,
  'fibonacci',
);
