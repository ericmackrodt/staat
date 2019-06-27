import React from 'react';
import { Staat, LegacyStaat } from 'staat';
import makeConnect from './connect';
import { makeUseStaat, makeUseReducers } from './hooks';
import makeProvider from './provider';
import { ReactStaat } from './types';

export function reactStaat<TTransformers, TState>(
  staat: LegacyStaat<TTransformers, TState>,
): ReactStaat<TState>;
export function reactStaat<TState>(staat: Staat<TState>): ReactStaat<TState>;
export function reactStaat<TState>(
  staat: Staat<TState> | LegacyStaat<unknown, TState>,
): ReactStaat<TState> {
  const context = React.createContext<any>(null);
  return {
    Provider: makeProvider(staat, context),
    connect: makeConnect<TState>(context),
    useStaat: makeUseStaat<TState>(staat),
    useReducers: makeUseReducers<TState>(staat),
  };
}
