import { Staat } from 'staat';
import { ReactStaat } from './types';
import makeConnect from './connect';
import makeProvider from './provider';

export function reactStaat<TState, TTransformers>(
  staat: Staat<TState, TTransformers>,
): ReactStaat<TState> {
  return {
    Provider: makeProvider(staat),
    connect: makeConnect<TState>(),
  };
}
