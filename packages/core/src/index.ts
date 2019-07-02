import staat from './staat';
import { isPromise, getScope } from './utils';
export {
  Transformer,
  Transformers,
  Subscription,
  Staat,
  LegacyStaat,
  StateContainerType,
  IScope,
  TransformersTree,
  RequesterState,
} from './types';
export * from './scope';
export const internals = {
  isPromise,
  getScope,
};

export default staat;
