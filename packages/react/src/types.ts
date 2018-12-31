import { MergedStates } from '@staat/merge';
import { State, Transformers, TimeTravelTransformers } from '@staat/core';

export type ProviderProps<T> = {
  states: T;
};

export type ReactStaat<TState, TTransformers> = {
  Provider: React.ComponentType;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (state: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: (
      transformers: Transformers<TTransformers>
    ) => TTransformerProps
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >
  ) => React.ComponentType<TOwnProps>;
};

export type TimeTravelReactStaat<TState, TTransformers> = {
  Provider: React.ComponentType;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (state: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: (
      transformers: TimeTravelTransformers<TState, TTransformers>
    ) => TTransformerProps
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >
  ) => React.ComponentType<TOwnProps>;
};

export type ReactMergedStaat<
  TStates extends Record<string, State<any, any>>
> = {
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
