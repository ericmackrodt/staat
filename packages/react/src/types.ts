export type ProviderProps<T> = {
  states: T;
};

export type ReactStaat<T> = {
  Provider: React.ComponentType;
  connect<TOwnProps, TStateProps>(
    mapStateToProps: (states: T, ownProps: TOwnProps) => TStateProps
  ): (
    WrappedComponent: React.ComponentType<TOwnProps & TStateProps>
  ) => React.ComponentType<TOwnProps>;
};
