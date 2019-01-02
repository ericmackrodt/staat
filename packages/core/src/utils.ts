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
  input: TransformerOrObject<TState>
): input is TransformerSignature<TState> {
  return typeof input === 'function';
}
