export interface IType<T> extends Function {
  new (...args: any[]): T;
}

export type Transformers<TTransformers extends {}> = {
  [TKey in keyof TTransformers]: TTransformers[TKey] extends (
    currentState: infer TState,
    ...args: infer TArgs
  ) => unknown
    ? (...args: TArgs) => Promise<TState>
    : TTransformers[TKey]
};

export type TimeTravelTransformers<
  TState,
  TTransformers extends {}
> = Transformers<TTransformers> & {
  undo(): Promise<TState>;
  redo(): Promise<TState>;
};

export type StateContainerType<TState> = {
  currentState: TState;
  subscribe(fn: Subscription): void;
  unsubscribe(fn: Subscription): void;
};

export type TimeTravelContainerType<TState> = StateContainerType<TState> & {
  undo(): Promise<TState>;
  redo(): Promise<TState>;
};

export type State<TState, TTransformers> = StateContainerType<TState> &
  Transformers<TTransformers>;

export type TimeTravelState<TState, TTransformers> = StateContainerType<
  TState
> &
  TimeTravelTransformers<TState, TTransformers>;

export type Subscription = () => Promise<void>;

export type StateContainers = Array<State<any, any>>;
