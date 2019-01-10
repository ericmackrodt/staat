export type Transformer<TState, TArgs extends any[]> = (
  currentState: TState,
  ...args: TArgs
) => TState | Promise<TState>;

export type TimeTravelTransformers<TState, TTransformers> = TTransformers & {
  undo(currentState: TState): TState | Promise<TState>;
  redo(currentState: TState): TState | Promise<TState>;
};
