import { TransformersTree } from './../../core/src/types';
import { useContext } from 'react';
import context from './context';
import { Staat } from 'staat';

export function makeUseStaat<TState>() {
  return function<TSubset>(selector: (state: TState) => TSubset): TSubset {
    const currentState = useContext(context);
    const result = selector(currentState);
    // There should be some shallow comparison here
    return result;
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
