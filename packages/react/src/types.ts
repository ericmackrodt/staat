import { MergedStates, Transformers } from '@staat/merge';
import { State } from '@staat/core';

export type ProviderProps<T> = {
  states: T;
};

export type ReactStaat<TStates extends Record<string, State<any, any>>> = {
  Provider: React.ComponentType;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (
      states: MergedStates<TStates>,
      ownProps: TOwnProps
    ) => TStateProps,
    mapTransformersToProps?: (
      transformers: Transformers<TStates>
    ) => TTransformerProps
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >
  ) => React.ComponentType<TOwnProps>;
};
