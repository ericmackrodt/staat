export type Transformer<TState, TArgs extends any[]> = (
  currentState: TState,
  ...args: TArgs
) => TState | Promise<TState>;

export type Transformers<TTransformers extends {}> = {
  [TKey in keyof TTransformers]: TTransformers[TKey] extends (
    currentState: infer TState,
    ...args: infer TArgs
  ) => unknown
    ? Transformer<TState, TArgs>
    : TTransformers[TKey]
};

export type TransformersTree<TTransformers extends {}> = {
  [TKey in keyof TTransformers]: TTransformers[TKey] extends (
    currentState: infer TState,
    ...args: infer TArgs
  ) => unknown
    ? Transformer<TState, TArgs>
    : TTransformers[TKey] extends {}
    ? TransformersTree<TTransformers[TKey]>
    : TTransformers[TKey]
};

export type StateContainerType<TState> = {
  currentState: TState;
  subscribe(fn: Subscription): void;
  unsubscribe(fn: Subscription): void;
};

export type Staat<TState, TTransformers> = StateContainerType<TState> &
  TransformersTree<TTransformers>;

export type Subscription = () => Promise<void>;

export type TransformerSignature<TState> = Transformer<TState, any[]>;

export type TransformerOrObject<TState> =
  | TransformerSignature<TState>
  | Record<string, TransformerSignature<TState>>;

/*tslint:disable callable-types*/
export interface IScopedTransformerFactory<TState, TScope> {
  <TArgs extends any[]>(
    definition: (
      currentScope: TScope,
      ...args: TArgs
    ) => TScope | Promise<TScope>,
  ): (currentState: TState, ...args: TArgs) => TState | Promise<TState>;
}

export interface IScopedTransformer<TState> {
  <
    K1 extends keyof TState,
    K2 extends keyof TState[K1],
    K3 extends keyof TState[K1][K2],
    K4 extends keyof TState[K1][K2][K3],
    K5 extends keyof TState[K1][K2][K3][K4]
  >(
    prop1: K1,
    prop2: K2,
    prop3: K3,
    prop4: K4,
    prop5: K5,
  ): IScopedTransformerFactory<TState, TState[K1][K2][K3][K4][K5]>;
  <
    K1 extends keyof TState,
    K2 extends keyof TState[K1],
    K3 extends keyof TState[K1][K2],
    K4 extends keyof TState[K1][K2][K3]
  >(
    prop1: K1,
    prop2: K2,
    prop3: K3,
    prop4: K4,
  ): IScopedTransformerFactory<TState, TState[K1][K2][K3][K4]>;
  <
    K1 extends keyof TState,
    K2 extends keyof TState[K1],
    K3 extends keyof TState[K1][K2]
  >(
    prop1: K1,
    prop2: K2,
    prop3: K3,
  ): IScopedTransformerFactory<TState, TState[K1][K2][K3]>;
  <K1 extends keyof TState, K2 extends keyof TState[K1]>(
    prop1: K1,
    prop2: K2,
  ): IScopedTransformerFactory<TState, TState[K1][K2]>;
  <K1 extends keyof TState>(prop1: K1): IScopedTransformerFactory<
    TState,
    TState[K1]
  >;
}
