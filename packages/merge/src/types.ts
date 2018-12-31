export type MergedStates<
  TStates extends Record<keyof TStates, { currentState: unknown }>
> = { [StatesKey in keyof TStates]: TStates[StatesKey]['currentState'] };

type TransformerNames<TState> = {
  [StateKey in keyof TState]: TState[StateKey] extends (
    ...args: any[]
  ) => Promise<unknown>
    ? StateKey
    : never
}[keyof TState];
export type TransformersOnly<TState> = Pick<TState, TransformerNames<TState>>;

export type Transformers<TStates> = {
  [StatesKey in keyof TStates]: TransformersOnly<TStates[StatesKey]>
};

export type TransformersObject = {
  [key: string]: (...args: any[]) => Promise<unknown>;
};
