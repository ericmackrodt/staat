import { isPromise, getScope, setScope } from "./utils";
import { ScopedTransformer } from "./types";

export function scopedTransformer<
  TState extends Record<keyof TState, unknown>,
  TScope
>(scope: string) {
  return function<TArgs extends any[]>(
    definition: (
      currentScope: TScope,
      ...args: TArgs
    ) => TScope | Promise<TScope>
  ): ScopedTransformer<TState, TArgs> {
    const transformer = function(
      this: ScopedTransformer<TState, TArgs>,
      currentState: TState,
      ...args: TArgs
    ) {
      const s = getScope<TState, TScope>(currentState, scope);
      const result = definition(s, ...args);
      if (isPromise(result)) {
        return result.then(promiseResult =>
          setScope({ ...currentState }, promiseResult, scope)
        );
      }
      return setScope({ ...currentState }, result, scope);
    } as ScopedTransformer<TState, TArgs>;
    transformer.scope = scope;
    return transformer;
  };
}
