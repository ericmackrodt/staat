export type StaatTimeTravel<TState, TReducers> = TReducers & {
  undo(currentState: TState): TState;
  redo(currentState: TState): TState;
};
