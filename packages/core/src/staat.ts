import { StateContainer } from './state-container';
import { StateContainerType, Staat, TransformerOrObject } from './types';
import { isPromise, isTransformer } from './utils';

function addTransformers<
  TState,
  TTransformers extends Record<string, TransformerOrObject<TState>>
>(
  obj: Record<string, any>,
  transformers: TTransformers,
  container: StateContainer<TState>
) {
  return Object.keys(transformers).reduce((obj, key) => {
    const current = transformers[key];
    if (isTransformer(current)) {
      obj[key] = function(...args: any[]) {
        const state = container.getState();
        const result = current(state, ...args);
        if (isPromise(result)) {
          return result.then(state => container.setState(state));
        }
        return container.setState(result);
      };
    } else {
      obj[key] = addTransformers({}, current, container);
    }

    return obj;
  }, obj);
}

function initializeObject<TState>(
  container: StateContainer<TState>
): StateContainerType<TState> {
  const obj: Partial<StateContainerType<TState>> = {};

  Object.defineProperty(obj, 'currentState', {
    get: () => container.getState()
  });
  obj.subscribe = container.subscribe.bind(container);
  obj.unsubscribe = container.unsubscribe.bind(container);
  return obj as StateContainerType<TState>;
}

export default function staat<TState, TTransformers extends {}>(
  transformers: TTransformers,
  initialState: TState
): Staat<TState, TTransformers> {
  const container = new StateContainer(initialState);
  const obj = initializeObject(container);
  addTransformers(obj, transformers, container);
  return obj as Staat<TState, TTransformers>;
}
