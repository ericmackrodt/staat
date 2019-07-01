export type ProviderProps<T> = {
  states: T;
};

export type Reducers<TState, TReducers extends {}> = {
  [TKey in keyof TReducers]: TReducers[TKey] extends (
    state: TState,
    ...args: infer TArgs
  ) => unknown
    ? (...args: TArgs) => TState
    : TReducers[TKey]
};

export type ReactStaat<TState> = {
  Provider: React.ComponentType;
  useStaat<TSubset>(selector: (state: TState) => TSubset): TSubset;
  useReducers<
    TReducers extends Record<string, (state: TState, ...args: any[]) => TState>
  >(
    reducers: TReducers,
  ): Reducers<TState, TReducers>;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (state: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: () => TTransformerProps,
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >,
  ) => React.ComponentType<TOwnProps>;
};
