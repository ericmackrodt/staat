import React from 'react';
import { Staat } from 'staat';
import makeConnect from './connect';
import { makeUseStaat, makeUseTransformers } from './hooks';
import makeProvider from './provider';
import { ReactStaat } from './types';

export function reactStaat<TState, TTransformers>(
  staat: Staat<TState, TTransformers>,
): ReactStaat<TState, TTransformers> {
  const context = React.createContext<any>(null);
  return {
    Provider: makeProvider(staat, context),
    connect: makeConnect<TState>(context),
    useStaat: makeUseStaat<TState, TTransformers>(staat),
    useTransformers: makeUseTransformers<TState, TTransformers>(staat),
  };
}
