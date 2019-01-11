import staat from './staat';
import { isPromise, getScope } from './utils';
export {
  Transformer,
  Transformers,
  Subscription,
  Staat,
  StateContainerType,
  IScope,
} from './types';
export * from './scope';
export const internals = {
  isPromise,
  getScope,
};

export default staat;
