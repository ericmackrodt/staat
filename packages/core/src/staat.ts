import { StateContainer } from './state-container';
import {
  StateContainerType,
  Staat,
  TransformerOrObject,
  LegacyStaat,
  RequesterState,
  Select,
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

function makeSelect<TState>(container: StateContainer<TState>): Select<TState> {
  return <TSubset>(selector?: (state: TState) => TSubset | TState) => {
    const state = container.getState();
    if (!selector) {
      return state;
    }
    return selector(state);
  };
}

function makeRequester<TState>(container: StateContainer<TState>) {
  return <TArgs extends any[]>(
    requester: (state: RequesterState<TState>, ...args: TArgs) => Promise<void>,
    ...args: TArgs
  ): Promise<void> => {
    const reduce = makeReduce<TState>(container);
    const select = makeSelect<TState>(container);
    return requester({ reduce, select }, ...args);
  };
}

function initializeObject<TState>(
  container: StateContainer<TState>,
): StateContainerType<TState> {
  const obj: Partial<StateContainerType<TState>> = {
    subscribe: container.subscribe.bind(container),
    unsubscribe: container.unsubscribe.bind(container),
    reduce: makeReduce(container),
    select: makeSelect(container),
    request: makeRequester(container),
  };

  Object.defineProperty(obj, 'currentState', {
    get: () => {
      console.warn(
        '[Staat - Warning] currentState will no longer be supported, use the select function instead',
      );
      return container.getState();
    },
  });
  return obj as StateContainerType<TState>;
}

function staat<TState>(initialState: TState): Staat<TState>;
function staat<TTransformers, TState>(
  transformers: TTransformers,
  initialState: TState,
): LegacyStaat<TTransformers, TState>;
function staat<TState>(...args: Array<TState | Record<string, any>>): unknown {
  const initialState: TState = (args[1] || args[0]) as TState;
  const transformers = args[1] ? (args[0] as Record<string, any>) : undefined;

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
