import { applyChange, diff } from 'deep-diff';
import { scopedTransformer, internals } from '@staat/core';
import { TransformerOrObject } from '@staat/core/build/types';

export type TimeTravelState<TState> = {
  _isTimeTraveler: boolean;
  pastDiffs: deepDiff.IDiff[][];
  futureDiffs: deepDiff.IDiff[][];
  present: TState;
};

export type TimeTravelTransformer<TState, TArgs extends any[]> = (
  currentState: TimeTravelState<TState>,
  ...args: TArgs
) => TimeTravelState<TState> | Promise<TimeTravelState<TState>>;

export type Transformer<TState> = (
  currentState: TState,
  ...args: any[]
) => TState | Promise<TState>;

export type TimeTravelTransformers<
  TState extends {},
  TTransformers extends Transformer<TState>
> = TTransformers & {
  undo(currentState: TimeTravelState<TState>): TimeTravelState<TState>;
  redo(currentState: TimeTravelState<TState>): TimeTravelState<TState>;
};

export type TimeTravelStaat<
  TState,
  TTransformers extends Transformer<TState>
> = {
  initialState: TimeTravelState<TState>;
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

export function canUndo<TState>(state: TimeTravelState<TState>) {
  return !!state.pastDiffs.length;
}

export function canRedo<TState>(state: TimeTravelState<TState>) {
  return !!state.futureDiffs.length;
}

function resolveTimeTravel<TState>(
  currentState: TimeTravelState<TState>,
  newState: TState
): TimeTravelState<TState> {
  const current: TState = JSON.parse(JSON.stringify(newState));
  const difference = diff(current, currentState);
  return {
    ...currentState,
    pastDiffs: [...currentState.pastDiffs, difference],
    futureDiffs: [],
    present: { ...currentState.present, ...newState }
  };
}

function createTimeTravelTransformer<TState, TArgs extends any[]>(
  transformer: (
    currentState: TState,
    ...args: TArgs
  ) => TState | Promise<TState>
) {
  return (currentState: TimeTravelState<TState>, ...args: TArgs) => {
    const result = transformer(currentState.present, ...args);
    if (internals.isPromise(result)) {
      return result.then(state => resolveTimeTravel(currentState, state));
    }
    return resolveTimeTravel(currentState, result);
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

export function timeTravelTransformers<
  TState extends {},
  TTransformers extends Record<string, Transformer<TState>>,
  TScope = {}
>(transformers: TTransformers, scope?: string) {
  const scoped = scope
    ? scopedTransformer<TState, TimeTravelState<TScope>>(scope)
    : undefined;
  const newTransformers = Object.keys(transformers).reduce(
    (obj, key) => {
      const current = transformers[key];
      obj[key] = scoped
        ? scoped(createTimeTravelTransformer<TScope, any[]>(current))
        : createTimeTravelTransformer<TState, any[]>(current);

      return obj;
    },
    {} as Record<string, TimeTravelTransformer<TScope, any[]>>
  );

  newTransformers.undo = createUndo();
  newTransformers.redo = createRedo();

  return newTransformers;
}

export function timeTravelInitialState<TState>(
  state: TState
): TimeTravelState<TState> {
  return {
    _isTimeTraveler: true,
    pastDiffs: [],
    futureDiffs: [],
    present: state
  };
}

export function timeTravel<
  TState,
  TTransformers extends Record<string, TransformerOrObject<TState>>
>(
  state: TState,
  transformers: TTransformers
): TimeTravelStaat<TState, TTransformers> {
  return {
    initialState: timeTravelInitialState(state),
    transformers: timeTravelTransformers(transformers)
  };
}
