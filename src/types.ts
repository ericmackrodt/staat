export interface IType<T> extends Function {
  new (...args: any[]): T;
}

export type TransformerSignatures<TState, TTransformers extends {}> = {
  [TKey in keyof TTransformers]: TTransformers[TKey] extends (
    currentState: TState,
    ...args: infer TArgs
  ) => unknown
    ? (...args: TArgs) => Promise<TState>
    : TTransformers[TKey]
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
  TransformerSignatures<TState, TTransformers>;

export type Subscription = () => Promise<void>;
