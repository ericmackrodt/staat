import { StateContainer } from "./state-container";
import { IType, StateContainerType } from "./types";

function isPromise(obj: any) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function" &&
    typeof obj.catch === "function"
  );
}

function buildProto<T>(
  prototype: Record<string, any>,
  container: StateContainer<T>
) {
  // prototype.undo = () => container.undo();
  // prototype.redo = () => container.redo();
  prototype.subscribe = fn => container.subscribe(fn);
  prototype.unsubscribe = fn => container.unsubscribe(fn);
}

function modifyProptotype<TClass, TState>(
  proto: IType<TClass>,
  container: StateContainer<TState>
): IType<StateContainerType<TState, TClass>> {
  Object.keys(proto.prototype)
    .filter(key => typeof proto.prototype[key] === "function")
    .reduce((prototype, key) => {
      const actualFn = prototype[key];
      prototype[key] = function(...args: any[]) {
        const state = container.getState();
        const result = actualFn(state, ...args);
        if (isPromise(result)) {
          return result.then(state => container.setState(state));
        }
        return container.setState(result);
      };
      return prototype;
    }, proto.prototype);
  Object.defineProperty(proto.prototype, "currentState", {
    get: () => container.getState()
  });

  buildProto(proto.prototype, container);
  return proto as IType<StateContainerType<TState, TClass>>;
}

export function staat<TState, T>(
  input: IType<T>
): IType<StateContainerType<TState, T>> {
  const stateContainer = new StateContainer<TState>(
    // TODO: CHANGE THIS TYPE
    (input as any).initialState
  );
  return modifyProptotype(input, stateContainer);
}
