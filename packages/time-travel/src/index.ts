import { internals, scopedTransformer } from 'staat';
import { TimeTravelContainer } from './time-travel-container';

export type Transformer<TState, TArgs extends any[]> = (
  currentState: TState,
  ...args: TArgs
) => TState | Promise<TState>;

export type TimeTravelTransformers<TState, TTransformers> = TTransformers & {
  undo(currentState: TState): TState | Promise<TState>;
  redo(currentState: TState): TState | Promise<TState>;
};

function udpateHistory<TState>(
  currentState: TState,
  newState: TState,
  container: TimeTravelContainer<TState>,
  scope?: string
): TState {
  if (scope) {
    const newScope = internals.getScope<TState, any>(newState, scope);
    const currentScope = internals.getScope<TState, TState>(
      currentState,
      scope
    );
    container.setPresent(currentScope, newScope);
  } else {
    container.setPresent(currentState, newState);
  }

  return newState;
}

function createTimeTravelTransformer<TState, TArgs extends any[]>(
  transformer: Transformer<TState, TArgs>,
  container: TimeTravelContainer<TState>,
  scope?: string
) {
  return (currentState: TState, ...args: TArgs) => {
    const result = transformer(currentState, ...args);
    if (internals.isPromise(result)) {
      return result.then(state =>
        udpateHistory(currentState, state, container, scope)
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

function getKeys<TObj>(obj: TObj): (keyof TObj)[] {
  return Object.keys(obj) as (keyof TObj)[];
}

export function timeTravelTransformers<
  TState,
  TTransformers extends Record<keyof TTransformers, Transformer<any, any[]>>
>(
  transformers: TTransformers,
  container: TimeTravelContainer<TState>,
  scope?: string
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
        scope
      );

      return obj;
    },
    {} as Record<keyof TTransformers, Transformer<TState, any[]>>
  ) as TimeTravelTransformers<TState, TTransformers>;

  const scoped = scope ? scopedTransformer<TState, TState>(scope) : undefined;

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
  scope?: string
): TimeTravelTransformers<TState, TTransformers> {
  const container = new TimeTravelContainer<TState>();
  return timeTravelTransformers(transformers, container, scope);
}
