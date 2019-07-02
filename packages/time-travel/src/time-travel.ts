import { internals, IScope } from 'staat';
import { TimeTravelContainer } from './time-travel-container';
import { StaatTimeTravel } from './types';
import { getKeys } from './utils';

function udpateHistory<TState>(
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

function createTimeTravelReducer<TState>(
  reducer: (state: TState, ...args: any[]) => TState,
  container: TimeTravelContainer,
  scope?: IScope<TState, object>,
) {
  return (currentState: TState, ...args: any[]) => {
    const result = reducer(currentState, ...args);
    return udpateHistory(currentState, result, container, scope);
  };
}

function createUndo(container: TimeTravelContainer) {
  return <TState>(currentState: TState): TState => {
    return container.undo(currentState) as TState;
  };
}

function createRedo(container: TimeTravelContainer) {
  return <TState>(currentState: TState): TState => {
    return container.redo(currentState) as TState;
  };
}

export function staatTimeTravel<
  TState,
  TReducers extends Record<keyof TReducers, unknown>
>(
  reducers: TReducers,
  container: TimeTravelContainer,
  scope?: IScope<TState, object>,
): StaatTimeTravel<TState, TReducers> {
  const newReducers: StaatTimeTravel<TState, TReducers> = getKeys(
    reducers,
  ).reduce(
    (obj, key) => {
      const current = reducers[key] as ((
        state: TState,
        ...args: any[]
      ) => TState);
      obj[key] = createTimeTravelReducer<TState>(current, container, scope);

      return obj;
    },
    {} as Record<keyof TReducers, (state: TState, ...args: any[]) => TState>,
  ) as StaatTimeTravel<TState, TReducers>;

  newReducers.undo = scope
    ? scope.reducer(createUndo(container))
    : createUndo(container);
  newReducers.redo = scope
    ? scope.reducer(createRedo(container))
    : createRedo(container);

  return newReducers;
}

function timeTravel<TState, TScope, TReducers>(
  reducers: TReducers,
  scope: IScope<TState, TScope>,
): StaatTimeTravel<TState, TReducers>;
function timeTravel<TState, TReducers>(
  reducers: TReducers,
): StaatTimeTravel<TState, TReducers>;
function timeTravel<TState, TReducers>(
  reducers: TReducers,
  scope?: IScope<TState, object>,
): StaatTimeTravel<TState, TReducers> {
  const container = new TimeTravelContainer();
  return staatTimeTravel<TState, TReducers>(reducers, container, scope);
}

export default timeTravel;
