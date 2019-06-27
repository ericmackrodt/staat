import { useState, useEffect } from 'react';
import { Staat } from 'staat';
import { Reducers } from './types';

function shallowEqual<T extends {}>(left: T, right: T) {
  const leftKeys = Object.keys(left || {});
  const rightKeys = Object.keys(right || {});

  if (left === right) {
    return true;
  }

  if (
    leftKeys.length !== rightKeys.length ||
    !leftKeys.every(l => rightKeys.includes(l))
  ) {
    return false;
  }

  return leftKeys.every(
    key =>
      (left as Record<string, unknown>)[key] ===
      (right as Record<string, unknown>)[key],
  );
}

export function makeUseStaat<TState>(staat: Staat<TState>) {
  return function<TSubset>(selector: (state: TState) => TSubset): TSubset {
    const [currentState, setState] = useState<TSubset>(
      selector(staat.currentState),
    );

    useEffect(() => {
      let didUnsubscribe = false;

      function stateChanged() {
        setTimeout(() => {
          if (didUnsubscribe) {
            return;
          }

          const newState = selector(staat.currentState);

          setState((oldState: TSubset) => {
            if (!shallowEqual(oldState, newState)) {
              return newState;
            }

            return oldState;
          });
        });
        return Promise.resolve();
      }

      staat.subscribe(stateChanged);

      return () => {
        didUnsubscribe = true;
        staat.unsubscribe(stateChanged);
      };
    }, []);

    return currentState;
  };
}

export function makeUseReducers<TState>(
  staat: Staat<TState>,
): <
  TReducers extends Record<string, (state: TState, ...args: any[]) => TState>
>(
  reducers: TReducers,
) => Reducers<TState, TReducers> {
  return function(reducers) {
    const result = Object.keys(reducers).reduce(
      (acc, key) => {
        acc[key] = (...args: any[]) => {
          const reducer = reducers[key];
          return staat.reduce(reducer, ...args);
        };
        return acc;
      },
      {} as Record<string, unknown>,
    );
    return result as Reducers<TState, any>;
  };
}
