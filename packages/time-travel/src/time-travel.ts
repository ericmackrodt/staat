import { internals, IScope } from 'staat';
import { TimeTravelContainer } from './time-travel-container';
import { TimeTravelTransformers, Transformer } from './types';
import { getKeys } from './utils';

function udpateHistory<TState extends object>(
  currentState: TState,
  newState: TState,
  container: TimeTravelContainer,
  scope?: IScope<TState, object>,
): TState {
  if (scope) {
    // TODO: Any here shouldn't affect api's types, but should try to resolve later.
    const newScope = internals.getScope<TState, any>(newState, scope.path);
    const currentScope = internals.getScope<TState, TState>(
      currentState,
      scope.path,
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
  scope?: IScope<TState, object>,
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

function createUndo(container: TimeTravelContainer) {
  return <TState>(currentState: TState): TState => {
    return container.undo(currentState) as TState;
  };
}

function createRedo(container: TimeTravelContainer) {
  return <TState>(currentState: TState): TState | Promise<TState> => {
    return container.redo(currentState) as TState;
  };
}

export function timeTravelTransformers<
  TState extends object,
  TTransformers extends Record<keyof TTransformers, Transformer<any, any[]>>
>(
  transformers: TTransformers,
  container: TimeTravelContainer,
  scope?: IScope<TState, object>,
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

  newTransformers.undo = scope
    ? scope.transformer(createUndo(container))
    : createUndo(container);
  newTransformers.redo = scope
    ? scope.transformer(createRedo(container))
    : createRedo(container);

  return newTransformers;
}

function timeTravel<
  TState,
  TScope,
  TTransformers extends Record<keyof TTransformers, Transformer<TState, any[]>>
>(
  transformers: TTransformers,
  scope: IScope<TState, TScope>,
): TimeTravelTransformers<TState, TTransformers>;
function timeTravel<
  TState extends object,
  TTransformers extends Record<
    keyof TTransformers,
    Transformer<any, any[]>
  > = TTransformers
>(transformers: TTransformers): TimeTravelTransformers<TState, TTransformers>;
function timeTravel<
  TState extends object,
  TTransformers extends Record<keyof TTransformers, Transformer<TState, any[]>>
>(
  transformers: TTransformers,
  scope?: IScope<TState, object>,
): TimeTravelTransformers<TState, TTransformers> {
  const container = new TimeTravelContainer();
  return timeTravelTransformers<TState, TTransformers>(
    transformers,
    container,
    scope,
  );
}

export default timeTravel;
