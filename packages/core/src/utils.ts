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
  value: TScope,
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
  path: string[],
): TState {
  return setProperty(state, path, scope);
}

export function getProperty<TScope, TState extends Record<string, any>>(
  state: TState,
  path: string[],
): TScope {
  const key = path.shift();
  if (path.length === 0) {
    return state[key!];
  }
  return getProperty(state[key!], path);
}

export function getScope<TState extends Record<string, any>, TScope>(
  state: TState,
  path: string[],
): TScope {
  return getProperty(state, path);
}
