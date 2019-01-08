import { internals, scopedTransformer } from 'staat';
import { TimeTravelContainer } from './time-travel-container';
import { TimeTravelTransformers, Transformer } from './types';

const getKeys = <TObj>(obj: TObj): Array<keyof TObj> =>
  Object.keys(obj) as Array<keyof TObj>;

function udpateHistory<TState>(
  currentState: TState,
  newState: TState,
  container: TimeTravelContainer<TState>,
  scope?: keyof TState,
): TState {
  if (scope) {
    const newScope = internals.getScope<TState, any>(newState, [
      scope as string,
    ]);
    const currentScope = internals.getScope<TState, TState>(currentState, [
      scope as string,
    ]);
    container.setPresent(currentScope, newScope);
  } else {
    container.setPresent(currentState, newState);
  }

  return newState;
}

function createTimeTravelTransformer<TState, TArgs extends any[]>(
  transformer: Transformer<TState, TArgs>,
  container: TimeTravelContainer<TState>,
  scope?: keyof TState,
) {
  return (currentState: TState, ...args: TArgs) => {
    const result = transformer(currentState, ...args);
    if (internals.isPromise(result)) {
      return result.then(state =>
        udpateHistory(currentState, state, container, scope),
      );
    }
    return udpateHistory(currentState, result, container, scope);
  };
}

function createUndo<TState>(container: TimeTravelContainer<TState>) {
  return (currentState: TState): TState => {
    return container.undo(currentState);
  };
}

function createRedo<TState>(container: TimeTravelContainer<TState>) {
  return (currentState: TState): TState => {
    return container.redo(currentState);
  };
}

export function timeTravelTransformers<
  TState,
  TTransformers extends Record<keyof TTransformers, Transformer<any, any[]>>
>(
  transformers: TTransformers,
  container: TimeTravelContainer<TState>,
  scope?: keyof TState,
): TimeTravelTransformers<TState, TTransformers> {
  const newTransformers: TimeTravelTransformers<
    TState,
    TTransformers
  > = getKeys(transformers).reduce(
    (obj, key) => {
      const current = transformers[key];
      obj[key] = createTimeTravelTransformer<TState, any[]>(
        current,
        container,
        scope,
      );

      return obj;
    },
    {} as Record<keyof TTransformers, Transformer<TState, any[]>>,
  ) as TimeTravelTransformers<TState, TTransformers>;

  const scoped = scope ? scopedTransformer<TState>()(scope) : undefined;

  newTransformers.undo = scoped
    ? scoped(createUndo(container))
    : createUndo(container);
  newTransformers.redo = scoped
    ? scoped(createRedo(container))
    : createRedo(container);

  return newTransformers;
}

export function timeTravel<
  TState,
  TTransformers extends Record<keyof TTransformers, Transformer<any, any[]>>
>(
  transformers: TTransformers,
  scope?: keyof TState,
): TimeTravelTransformers<TState, TTransformers> {
  const container = new TimeTravelContainer<TState>();
  return timeTravelTransformers(transformers, container, scope);
}
