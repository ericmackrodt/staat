import staat from "./staat";
import { isPromise, getScope } from "./utils";
export {
  Transformers,
  Subscription,
  Staat,
  IType,
  StateContainerType
} from "./types";
export * from "./scoped-transformer";
export const internals = {
  isPromise,
  getScope
};

export default staat;
