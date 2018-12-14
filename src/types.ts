export interface IType<T> extends Function {
  new (...args: any[]): T;
}

type NoCommonParam<TState, T extends {}> = {
  [TKey in keyof T]: T[TKey] extends (
    currentState: TState,
    ...args: infer TArgs
  ) => unknown
    ? (...args: TArgs) => Promise<TState>
    : T[TKey]
};

export type StateContainerType<TState, T extends {}> = {
  currentState: TState;
  undo(): Promise<TState>;
  redo(): Promise<TState>;
  subscribe(fn: Subscription): void;
  unsubscribe(fn: Subscription): void;
} & NoCommonParam<TState, T>;

export type StateContainers = Array<
  StateContainerType<any, any> | IType<StateContainerType<any, any>>
>;

export type Subscription = () => Promise<void>;
