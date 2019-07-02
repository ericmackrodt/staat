export type ProviderProps<T> = {
  states: T;
};

export type ReactStaat<TState> = {
  Provider: React.ComponentType;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (state: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: () => TTransformerProps,
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >,
  ) => React.ComponentType<TOwnProps>;
};
