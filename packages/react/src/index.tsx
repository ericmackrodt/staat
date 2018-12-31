import { State, TimeTravelState } from '@staat/core';
import { MergedStaat } from '@staat/merge';
import { ReactMergedStaat, ReactStaat, TimeTravelReactStaat } from './types';
import makeConnect from './connect';
import makeProvider from './provider';

export * from '@staat/core';
export { mergeStaats } from '@staat/merge';

function reactStaat<TState, TTransformers>(
  staat: TimeTravelState<TState, TTransformers>
): TimeTravelReactStaat<TState, TTransformers>;
function reactStaat<TState, TTransformers>(
  staat: State<TState, TTransformers>
): ReactStaat<TState, TTransformers>;
function reactStaat<TContainers extends Record<string, State<any, any>>>(
  mergedStaat: MergedStaat<TContainers>
): ReactMergedStaat<TContainers>;
function reactStaat<
  TState = {},
  TTransformers = {},
  TContainers extends Record<string, State<any, any>> = {}
>(staat: MergedStaat<TContainers> | State<TState, TTransformers>) {
  return {
    Provider: makeProvider<TContainers, TState, TTransformers>(staat),
    connect: makeConnect<TContainers, TState, TTransformers>()
  };
}

export default reactStaat;
