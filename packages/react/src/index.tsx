import { State } from '@staat/core';
import { MergedStaat } from '@staat/merge';
import { ReactStaat } from './types';
import makeConnect from './connect';
import makeProvider from './provider';

export * from '@staat/core';
export { mergeStaats } from '@staat/merge';

export default function reactStaat<
  TContainers extends Record<string, State<any, any>>
>(mergedStaat: MergedStaat<TContainers>): ReactStaat<TContainers> {
  return {
    Provider: makeProvider(mergedStaat),
    connect: makeConnect<TContainers>()
  };
}
