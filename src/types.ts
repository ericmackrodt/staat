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
  undo(): void;
  redo(): void;
} & NoCommonParam<TState, T>;
