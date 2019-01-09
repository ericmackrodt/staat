export type Transformer<TState, TArgs extends any[]> = (
  currentState: TState,
  ...args: TArgs
) => TState | Promise<TState>;

export type TimeTravelTransformers<TState, TTransformers> = TTransformers & {
  undo(currentState: TState): TState | Promise<TState>;
  redo(currentState: TState): TState | Promise<TState>;
};

/* tslint:disable callable-types */
export interface ITimeTravelTransformers<TState> {
  <
    TTransformers extends Record<
      keyof TTransformers,
      Transformer<TState, any[]>
    >,
    K1 extends keyof TState,
    K2 extends keyof TState[K1],
    K3 extends keyof TState[K1][K2],
    K4 extends keyof TState[K1][K2][K3],
    K5 extends keyof TState[K1][K2][K3][K4]
  >(
    transformers: TTransformers,
    scope: [K1, K2, K3, K4, K5],
  ): TimeTravelTransformers<TState, TTransformers>;
  <
    TTransformers extends Record<
      keyof TTransformers,
      Transformer<TState, any[]>
    >,
    K1 extends keyof TState,
    K2 extends keyof TState[K1],
    K3 extends keyof TState[K1][K2],
    K4 extends keyof TState[K1][K2][K3]
  >(
    transformers: TTransformers,
    scope: [K1, K2, K3, K4],
  ): TimeTravelTransformers<TState, TTransformers>;
  <
    TTransformers extends Record<
      keyof TTransformers,
      Transformer<TState, any[]>
    >,
    K1 extends keyof TState,
    K2 extends keyof TState[K1],
    K3 extends keyof TState[K1][K2]
  >(
    transformers: TTransformers,
    scope: [K1, K2, K3],
  ): TimeTravelTransformers<TState, TTransformers>;
  <
    TTransformers extends Record<
      keyof TTransformers,
      Transformer<TState, any[]>
    >,
    K1 extends keyof TState,
    K2 extends keyof TState[K1]
  >(
    transformers: TTransformers,
    scope: [K1, K2],
  ): TimeTravelTransformers<TState, TTransformers>;
  <
    TTransformers extends Record<
      keyof TTransformers,
      Transformer<TState, any[]>
    >,
    K1 extends keyof TState
  >(
    transformers: TTransformers,
    scope: K1,
  ): TimeTravelTransformers<TState, TTransformers>;
  <
    TTransformers extends Record<
      keyof TTransformers,
      Transformer<TState, any[]>
    >
  >(
    transformers: TTransformers,
  ): TimeTravelTransformers<TState, TTransformers>;
}
