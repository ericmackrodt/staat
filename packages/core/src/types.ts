export type Transformer<TState, TArgs extends any[]> = (
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
  reduce<TArgs extends any[]>(
    reducer: (state: TState, ...args: TArgs) => TState,
    ...args: TArgs
  ): TState;
  subscribe(fn: Subscription): void;
  unsubscribe(fn: Subscription): void;
};

export type Staat<TState> = StateContainerType<TState>;

export type LegacyStaat<TState, TTransformers> = StateContainerType<TState> &
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

export interface IScope<TState, TScope> {
  path: string[];

  reducer<TArgs extends any[]>(
    definition: (currentScope: TScope, ...args: TArgs) => TScope,
  ): (currentState: TState, ...args: TArgs) => TState;

  /**
   * Deprecated
   */
  transformer<TArgs extends any[]>(
    definition: (
      currentScope: TScope,
      ...args: TArgs
    ) => TScope | Promise<TScope>,
  ): (currentState: TState, ...args: TArgs) => TState | Promise<TState>;
}
