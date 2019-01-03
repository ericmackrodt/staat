import { StateContainer } from "./state-container";
import staat from "./staat";
import { isTransformer, isPromise, getScope, setScope } from "./utils";
export {
  Transformers,
  Subscription,
  Staat,
  IType,
  StateContainerType,
  ScopedTransformer
} from "./types";
export * from "./scoped-transformer";
export const internals = {
  StateContainer,
  isTransformer,
  isPromise,
  getScope,
  setScope
};

export default staat;
