import { TransformerOrObject, TransformerSignature } from './types';

export function isPromise<T>(obj: T | Promise<T>): obj is Promise<T> {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof (obj as Promise<T>).then === 'function' &&
    typeof (obj as Promise<T>).catch === 'function'
  );
}

export function isTransformer<TState>(
  input: TransformerOrObject<TState>,
): input is TransformerSignature<TState> {
  return typeof input === 'function';
}

export function setProperty<TScope, TState extends Record<string, any>>(
  state: TState,
  path: string[],
  index: number,
  value: TScope,
): TState {
  const key = path[index];
  if (!key || !state[key!]) {
    throw new Error(`The property [${key}] in path is invalid or undefined`);
  }

  const current = state[key];

  let result: {
    [x: string]: any;
  };
  if (path.length - 1 <= index) {
    result = { [key]: { ...current, ...value } };
  } else {
    result = {
      [key]: { ...current, ...setProperty(current, path, index++, value) },
    };
  }

  return { ...state, ...result };
}

export function setScope<TScope, TState extends Record<string, any>>(
  state: TState,
  scope: TScope,
  path: string[],
): TState {
  return setProperty(state, path, 0, scope);
}

export function getProperty<TScope, TState extends Record<string, any>>(
  state: TState,
  path: string[],
  index: number,
): TScope {
  const key = path[index];
  if (path.length - 1 <= index) {
    return state[key!];
  }
  return getProperty(state[key!], path, index++);
}

export function getScope<TState extends Record<string, any>, TScope>(
  state: TState,
  path: string[],
): TScope {
  return getProperty(state, path, 0);
}
