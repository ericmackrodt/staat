import { Staat } from '@staat/core';
import { ReactStaat } from './types';
import makeConnect from './connect';
import makeProvider from './provider';

export * from '@staat/core';

function reactStaat<TState, TTransformers>(
  staat: Staat<TState, TTransformers>
): ReactStaat<TState, TTransformers> {
  return {
    Provider: makeProvider(staat),
    connect: makeConnect<TState, TTransformers>()
  };
}

export default reactStaat;
