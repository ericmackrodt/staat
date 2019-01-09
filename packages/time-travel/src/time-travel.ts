import { internals, scopedTransformer } from 'staat';
import { TimeTravelContainer } from './time-travel-container';
import {
  TimeTravelTransformers,
  Transformer,
  ITimeTravelTransformers,
} from './types';
import { getKeys, asArray } from './utils';

function udpateHistory<TState extends object>(
  currentState: TState,
  newState: TState,
  container: TimeTravelContainer,
  scope?: string[],
): TState {
  if (scope) {
    // TODO: Any here shouldn't affect api's types, but should try to resolve later.
    const newScope = internals.getScope<TState, any>(newState, scope);
    const currentScope = internals.getScope<TState, TState>(
      currentState,
      scope,
    );
    container.setPresent(currentScope, newScope);
  } else {
    container.setPresent(currentState, newState);
  }

  return newState;
}

function createTimeTravelTransformer<
  TState extends object,
  TArgs extends any[]
>(
  transformer: Transformer<TState, TArgs>,
  container: TimeTravelContainer,
  scope?: string[],
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

function createUndo<TState extends object>(container: TimeTravelContainer) {
  return (currentState: TState): TState => {
    return container.undo(currentState) as TState;
  };
}

function createRedo<TState extends object>(container: TimeTravelContainer) {
  return (currentState: TState): TState => {
    return container.redo(currentState) as TState;
  };
}

export function timeTravelTransformers<
  TState extends object,
  TTransformers extends Record<keyof TTransformers, Transformer<any, any[]>>
>(
  transformers: TTransformers,
  container: TimeTravelContainer,
  scope?: string[],
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

  const scoped = scope ? scopedTransformer<TState>()(scope as any) : undefined;

  newTransformers.undo = scoped
    ? scoped(createUndo(container))
    : createUndo(container);
  newTransformers.redo = scoped
    ? scoped(createRedo(container))
    : createRedo(container);

  return newTransformers;
}

function timeTravel<TState>(): ITimeTravelTransformers<TState> {
  return <
    TTransformers extends Record<
      keyof TTransformers,
      Transformer<TState, any[]>
    >
  >(
    transformers: TTransformers,
    scope?: string | string[],
  ) => {
    const container = new TimeTravelContainer();
    const scopeAsArray = scope ? asArray(scope) : undefined;
    return timeTravelTransformers(transformers, container, scopeAsArray);
  };
}

export default timeTravel;
