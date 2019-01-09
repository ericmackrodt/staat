import { getScope, isPromise, setScope } from './utils';
import { IScopedTransformer } from './types';

export function scopedTransformer<TState>(): IScopedTransformer<TState> {
  return function scopedFn(...scope: string[]) {
    return function(definition: (currentScope: any, ...args: any) => unknown) {
      return function(currentState: any, ...args: any) {
        const s = getScope<TState, any>(currentState, scope);
        const result = definition(s, ...args);
        if (isPromise(result)) {
          return result.then(promiseResult =>
            setScope({ ...currentState }, promiseResult, scope),
          );
        }
        return setScope({ ...currentState }, result, scope);
      };
    };
  };
}
