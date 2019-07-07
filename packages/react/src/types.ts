import { RequesterState } from 'staat';

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

export type Requesters<TState, TRequesters extends {}> = {
  [TKey in keyof TRequesters]: TRequesters[TKey] extends (
    state: RequesterState<TState>,
    ...args: infer TArgs
  ) => Promise<void>
    ? (...args: TArgs) => void
    : TRequesters[TKey]
};

export type ReactStaat<TState> = {
  Provider: React.ComponentType;
  useStaat<TSubset>(selector: (state: TState) => TSubset): TSubset;
  useReducers<
    TReducers extends Record<string, (state: TState, ...args: any[]) => TState>
  >(
    reducers: TReducers,
  ): Reducers<TState, TReducers>;
  useRequests<
    TRequests extends Record<
      string,
      (state: RequesterState<TState>, ...args: any[]) => Promise<void>
    >
  >(
    reducers: TRequests,
  ): Requesters<TState, TRequests>;
  connect<TOwnProps, TStateProps, TTransformerProps = {}>(
    mapStateToProps: (state: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: () => TTransformerProps,
  ): (
    WrappedComponent: React.ComponentType<
      TOwnProps & TTransformerProps & TStateProps
    >,
  ) => React.ComponentType<TOwnProps>;
};
