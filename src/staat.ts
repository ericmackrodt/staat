import { StateContainer } from "./state-container";
import { IType, StateContainerType } from "./types";

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
        return container.setState(result);
      };
      return prototype;
    }, proto.prototype);
  Object.defineProperty(proto.prototype, "currentState", {
    get: () => container.getState()
  });

  proto.prototype.undo = () => container.undo();
  proto.prototype.redo = () => container.redo();
  return proto as IType<StateContainerType<TState, TClass>>;
}

export function staat<TState, T>(
  input: IType<T>
): IType<StateContainerType<TState, T>> {
  const stateContainer = new StateContainer<TState>();
  return modifyProptotype(input, stateContainer);
}
