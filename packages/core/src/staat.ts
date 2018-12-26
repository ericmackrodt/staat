import { StateContainer } from "./state-container";
import {
  StateContainerType,
  State,
  TimeTravelState,
  TimeTravelContainerType
} from "./types";
import { TimeTravelContainer } from "./time-travel";

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

  Object.defineProperty(obj, "currentState", {
    get: () => container.getState()
  });
  obj.subscribe = container.subscribe.bind(container);
  obj.unsubscribe = container.unsubscribe.bind(container);
  return obj as StateContainerType<TState>;
}

function initializeTimeTravelFunctions<TState>(
  obj: TimeTravelContainerType<TState>,
  container: TimeTravelContainer<TState>
): TimeTravelContainerType<TState> {
  if (container instanceof TimeTravelContainer) {
    obj.undo = container.undo.bind(container);
    obj.redo = container.redo.bind(container);
  }
  return obj;
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

export function timeTravelStaat<TState, TTransformers extends {}>(
  transformers: TTransformers,
  initialState: TState
): TimeTravelState<TState, TTransformers> {
  const container = new TimeTravelContainer(initialState);
  const obj = initializeObject(container);
  initializeTimeTravelFunctions(
    obj as TimeTravelContainerType<TState>,
    container
  );
  addFunctions(obj, transformers, container);
  return obj as TimeTravelState<TState, TTransformers>;
}
