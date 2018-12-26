import { StateContainer } from "./state-container";
import { StateContainerType, State } from "./types";

function isPromise<T>(obj: T | Promise<T>): obj is Promise<T> {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof (obj as Promise<T>).then === "function" &&
    typeof (obj as Promise<T>).catch === "function"
  );
}

function addFunctions<
  TState,
  TTransformers extends Record<string, (arg: TState, ...args: any[]) => TState>
>(
  obj: Record<string, any>,
  transformers: TTransformers,
  container: StateContainer<TState>
) {
  Object.keys(transformers)
    .filter(key => typeof transformers[key] === "function")
    .reduce((obj, key) => {
      const actualFn = transformers[key];
      obj[key] = function(...args: any[]) {
        const state = container.getState();
        const result = actualFn(state, ...args);
        if (isPromise(result)) {
          return result.then(state => container.setState(state));
        }
        return container.setState(result);
      };
      return obj;
    }, obj);
}

function initializeObject<TState>(
  container: StateContainer<TState>
): StateContainerType<TState> {
  const obj: Partial<StateContainerType<TState>> = {};
  // if (container instanceof TimeTravelContainer) {
  //   obj.undo = () => container.undo();
  //   obj.redo = () => container.redo();
  // }

  Object.defineProperty(obj, "currentState", {
    get: () => container.getState()
  });
  obj.subscribe = fn => container.subscribe(fn);
  obj.unsubscribe = fn => container.unsubscribe(fn);
  return obj as StateContainerType<TState>;
}

export function staat<TState, TTransformers extends {}>(
  transformers: TTransformers,
  initialState: TState
): State<TState, TTransformers> {
  const container = new StateContainer(initialState);
  const obj = initializeObject(container);
  addFunctions(obj, transformers, container);
  return obj as State<TState, TTransformers>;
}
