import { StateContainer } from './state-container';
import staat from './staat';
import { isTransformer, isPromise } from './utils';
export {
  Transformers,
  Subscription,
  Staat,
  IType,
  StateContainerType,
  StateContainers
} from './types';
export * from './scoped-transformer';
export const internals = {
  StateContainer,
  isTransformer,
  isPromise
};

export default staat;
