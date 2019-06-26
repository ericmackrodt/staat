import { StateContainer } from './state-container';
import {
  StateContainerType,
  Staat,
  TransformerOrObject,
  LegacyStaat,
} from './types';
import { isPromise, isTransformer } from './utils';

function addTransformers<
  TState,
  TTransformers extends Record<string, TransformerOrObject<TState>>
>(
  obj: Record<string, any>,
  transformers: TTransformers,
  container: StateContainer<TState>,
) {
  return Object.keys(transformers).reduce((acc, key) => {
    const current = transformers[key];
    if (isTransformer(current)) {
      acc[key] = function(...args: any[]) {
        const state = container.getState();
        const result = current(state, ...args);
        if (isPromise(result)) {
          return result.then(s => container.setState(s));
        }
        return container.setState(result);
      };
    } else {
      acc[key] = addTransformers({}, current, container);
    }

    return acc;
  }, obj);
}

function makeReduce<TState>(container: StateContainer<TState>) {
  return <TArgs extends any[]>(
    reducer: (state: TState, ...args: TArgs) => TState,
    ...args: TArgs
  ) => {
    const state = container.getState();
    const result = reducer(state, ...args);
    return container.setState(result) as TState;
  };
}

function initializeObject<TState>(
  container: StateContainer<TState>,
): StateContainerType<TState> {
  const obj: Partial<StateContainerType<TState>> = {};

  Object.defineProperty(obj, 'currentState', {
    get: () => container.getState(),
  });
  obj.subscribe = container.subscribe.bind(container);
  obj.unsubscribe = container.unsubscribe.bind(container);
  obj.reduce = makeReduce(container);
  return obj as StateContainerType<TState>;
}

function staat<TState>(initialState: TState): Staat<TState>;
function staat<TState, TTransformers extends {}>(
  initialState: TState,
  transformers?: TTransformers,
): LegacyStaat<TState, TTransformers>;
function staat<TState>(
  initialState: TState,
  transformers?: Record<string, any>,
): Staat<TState> | LegacyStaat<TState, unknown> {
  const container = new StateContainer(initialState);
  const obj = initializeObject(container);
  if (transformers) {
    console.warn(
      '[Staat - Warning] Transformers will no longer be supported, use the reduce function instead',
    );
    addTransformers(obj, transformers, container);
  }
  return obj;
}

export default staat;
