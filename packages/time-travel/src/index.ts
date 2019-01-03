import { applyChange, diff } from "deep-diff";
import { internals, ScopedTransformer } from "@staat/core";

export type TimeTravelState<TState> = {
  _isTimeTraveler: boolean;
  pastDiffs: deepDiff.IDiff[][];
  futureDiffs: deepDiff.IDiff[][];
  present: TState;
};

export type ReturnState<TState> = TimeTravelState<TState> | TState;

export type Transformer<TState, TArgs extends any[]> = (
  currentState: TState,
  ...args: TArgs
) => TState | Promise<TState>;

export type TimeTravelTransformers<TState, TTransformers> = TTransformers & {
  undo(currentState: TimeTravelState<TState>): TimeTravelState<TState>;
  redo(currentState: TimeTravelState<TState>): TimeTravelState<TState>;
};

export type TimeTravelStaat<
  TState,
  TTransformers extends Record<keyof TTransformers, Transformer<TState, any[]>>,
  TScope = TState
> = {
  initialState: TimeTravelState<TScope>;
  transformers: TimeTravelTransformers<TState, TTransformers>;
};

export const isTimeTravelState = <TState>(
  state: TimeTravelState<TState> | TState
): state is TimeTravelState<TState> => {
  return (
    (state as TimeTravelState<TState>)._isTimeTraveler === true &&
    (state as TimeTravelState<TState>).futureDiffs instanceof Array &&
    (state as TimeTravelState<TState>).pastDiffs instanceof Array
  );
};

function isScopedTransformer<T, TArgs extends any[]>(
  transformer: ScopedTransformer<T, TArgs> | Transformer<T, TArgs>
): transformer is ScopedTransformer<T, TArgs> {
  return !!(transformer as ScopedTransformer<T, TArgs>).scope;
}

export function canUndo<TState>(state: TimeTravelState<TState>) {
  return !!state.pastDiffs.length;
}

export function canRedo<TState>(state: TimeTravelState<TState>) {
  return !!state.futureDiffs.length;
}

function timeTravelTransformer<TScope>(
  currentState: TimeTravelState<TScope>,
  newState: TScope
): TimeTravelState<TScope> {
  const current: TScope = JSON.parse(JSON.stringify(newState));
  const difference = diff(current, currentState.present);
  return {
    ...currentState,
    pastDiffs: [...currentState.pastDiffs, difference],
    futureDiffs: [],
    present: { ...currentState.present, ...newState }
  };
}

function resolveTimeTravel<TState extends TimeTravelState<{}> | {}>(
  currentState: TState,
  newState: TState,
  scope?: string
): TState {
  if (scope && !isTimeTravelState(currentState)) {
    const newScope = internals.getScope<TState, any>(
      newState,
      scope + ".present"
    );
    const currentScope = internals.getScope<TState, TimeTravelState<any>>(
      currentState,
      scope
    );
    const result = timeTravelTransformer(currentScope, newScope);
    return internals.setScope<TimeTravelState<any>, TState>(
      { ...currentState },
      result,
      scope
    );
  }

  if (isTimeTravelState(currentState) && isTimeTravelState(newState)) {
    return timeTravelTransformer<{}>(currentState, newState.present) as TState;
  }

  return { ...currentState };
}

function createTimeTravelTransformer<TState, TArgs extends any[]>(
  transformer: ScopedTransformer<TState, TArgs> | Transformer<TState, TArgs>
) {
  const scope = isScopedTransformer(transformer)
    ? transformer.scope
    : undefined;

  return (currentState: TState, ...args: TArgs) => {
    const result = transformer(currentState, ...args);
    if (internals.isPromise(result)) {
      return result.then(state =>
        resolveTimeTravel(currentState, state, scope)
      );
    }
    return resolveTimeTravel(currentState, result, scope);
  };
}

function resolvePresent<TState>(state: TState, diffs: deepDiff.IDiff[]) {
  const current = JSON.parse(JSON.stringify(state));
  diffs.forEach(c => applyChange(current, {}, c!));
  const newDiffs = diff(current, state);
  return {
    newDiffs,
    current
  };
}

function createUndo<TState>() {
  return (currentState: TimeTravelState<TState>): TimeTravelState<TState> => {
    if (!canUndo(currentState)) {
      return currentState;
    }
    const { pastDiffs, futureDiffs, present } = currentState;

    const diffsToApply = pastDiffs[pastDiffs.length - 1];
    const { current, newDiffs } = resolvePresent(present, diffsToApply);
    return {
      ...currentState,
      pastDiffs: pastDiffs.slice(0, -1),
      present: current,
      futureDiffs: [newDiffs, ...futureDiffs]
    };
  };
}

function createRedo<TState>() {
  return (currentState: TimeTravelState<TState>): TimeTravelState<TState> => {
    if (!canRedo(currentState)) {
      return currentState;
    }
    const { pastDiffs, futureDiffs, present } = currentState;

    const diffsToApply = futureDiffs[0];
    const { current, newDiffs } = resolvePresent(present, diffsToApply);
    return {
      ...currentState,
      pastDiffs: [...pastDiffs, newDiffs],
      present: current,
      futureDiffs: futureDiffs.slice(1)
    };
  };
}

function getKeys<TObj>(obj: TObj): (keyof TObj)[] {
  return Object.keys(obj) as (keyof TObj)[];
}

export function timeTravelTransformers<
  TState,
  TTransformers extends Record<keyof TTransformers, Transformer<any, any[]>>
>(transformers: TTransformers): TimeTravelTransformers<TState, TTransformers> {
  const newTransformers: TimeTravelTransformers<
    TState,
    TTransformers
  > = getKeys(transformers).reduce(
    (obj, key) => {
      const current = transformers[key];
      obj[key] = createTimeTravelTransformer<TState, any[]>(current);

      return obj;
    },
    {} as Record<keyof TTransformers, Transformer<TState, any[]>>
  ) as TimeTravelTransformers<TState, TTransformers>;

  newTransformers.undo = createUndo();
  newTransformers.redo = createRedo();

  return newTransformers;
}

export function timeTravelInitialState<TScope>(
  state: TScope
): TimeTravelState<TScope> {
  return {
    _isTimeTraveler: true,
    pastDiffs: [],
    futureDiffs: [],
    present: state
  };
}

export function timeTravel<
  TState,
  TTransformers extends Record<keyof TTransformers, Transformer<any, any[]>>,
  TScope
>(
  state: TScope,
  transformers: TTransformers
): TimeTravelStaat<TState, TTransformers, TScope> {
  return {
    initialState: timeTravelInitialState(state),
    transformers: timeTravelTransformers(transformers)
  };
}
