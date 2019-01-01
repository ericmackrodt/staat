import { isPromise } from './utils';

function setProperty<TScope, TState extends Record<string, any>>(
  state: TState,
  path: string[],
  value: TScope
): TState {
  const key = path.shift();
  if (!key || !state[key!]) {
    throw new Error(`The property [${key}] in path is invalid or undefined`);
  }

  const current = state[key];

  let result: {
    [x: string]: any;
  };
  if (path.length === 0) {
    result = { [key]: { ...current, ...value } };
  } else {
    result = { [key]: { ...current, ...setProperty(current, path, value) } };
  }

  return { ...state, ...result };
}

export function setScope<TScope, TState extends Record<string, any>>(
  state: TState,
  scope: TScope,
  path: string
): TState {
  const parts = path.split('.');
  return setProperty(state, parts, scope);
}

function getProperty<TScope, TState extends Record<string, any>>(
  state: TState,
  path: string[]
): TScope {
  const key = path.shift();
  if (path.length === 0) {
    return state[key!];
  }
  return getProperty(state[key!], path);
}

function getScope<TState extends Record<string, any>, TScope>(
  state: TState,
  path: string
): TScope {
  const parts = path.split('.');
  return getProperty(state, parts);
}

export function scopedTransformer<
  TState extends Record<keyof TState, unknown>,
  TScope
>(scope: string) {
  return function<TArgs extends any[]>(
    definition: (currentScope: TScope, ...args: TArgs) => TScope
  ) {
    return function(currentState: TState, ...args: TArgs) {
      const s = getScope<TState, TScope>(currentState, scope);
      const result = definition(s, ...args);
      if (isPromise(result)) {
        return result.then(scopeResult =>
          setScope({ ...currentState }, scopeResult, scope)
        );
      }
      return setScope({ ...currentState }, result, scope);
    };
  };
}
