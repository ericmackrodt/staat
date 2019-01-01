import { Staat } from '@staat/core';

export type ProviderProps<T> = {
  states: T;
};

export type ReactStaat<TState, TTransformers> = {
  Provider: React.ComponentType;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (state: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: (
      staat: Staat<TState, TTransformers>
    ) => TTransformerProps
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >
  ) => React.ComponentType<TOwnProps>;
};
