import { TransformersTree } from './../../core/src/types';

export type ProviderProps<T> = {
  states: T;
};

export type ReactStaat<TState, TTransformers> = {
  Provider: React.ComponentType;
  useStaat<TSubset>(selector: (state: TState) => TSubset): TSubset;
  useTransformers(): TransformersTree<TTransformers>;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (state: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: () => TTransformerProps,
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >,
  ) => React.ComponentType<TOwnProps>;
};
