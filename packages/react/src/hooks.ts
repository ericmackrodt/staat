import { useState, useEffect } from 'react';
import { Staat, TransformersTree } from 'staat';

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

export function makeUseStaat<TState, TTRansformers>(
  staat: Staat<TState, TTRansformers>,
) {
  return function<TSubset>(selector: (state: TState) => TSubset): TSubset {
    const [currentState, setState] = useState<TSubset>(
      selector(staat.currentState),
    );

    useEffect(() => {
      let didUnsubscribe = false;

      function stateChanged() {
        if (didUnsubscribe) {
          return Promise.resolve();
        }

        const newState = selector(staat.currentState);

        setState((oldState: TSubset) => {
          if (!shallowEqual(oldState, newState)) {
            return newState;
          }

          return oldState;
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

export function makeUseTransformers<TState, TTransformers>(
  staat: Staat<TState, TTransformers>,
): () => TransformersTree<TTransformers> {
  const transformers = Object.keys(staat).reduce(
    (acc, key) => {
      if (!['currentState', 'subscribe', 'unsubscribe'].includes(key)) {
        acc[key] = (staat as Record<string, unknown>)[key];
      }
      return acc;
    },
    {} as Record<string, unknown>,
  ) as TransformersTree<TTransformers>;
  return function() {
    return transformers;
  };
}
