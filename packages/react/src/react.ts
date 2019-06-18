import { Staat } from 'staat';
import { ReactStaat } from './types';
import makeConnect from './connect';
import makeProvider from './provider';
import { makeUseTransformers, makeUseStaat } from './hooks';

export function reactStaat<TState, TTransformers>(
  staat: Staat<TState, TTransformers>,
): ReactStaat<TState, TTransformers> {
  return {
    Provider: makeProvider(staat),
    connect: makeConnect<TState>(),
    useStaat: makeUseStaat<TState>(),
    useTransformers: makeUseTransformers<TState, TTransformers>(staat),
  };
}
