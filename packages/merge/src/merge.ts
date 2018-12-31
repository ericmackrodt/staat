import { MergedStates, MergedTransformers, TransformersObject } from './types';
import { internals, Subscription, State } from '@staat/core';

function mergeCurrentStates<
  T extends Record<keyof T, { currentState: unknown }>
>(states: T): MergedStates<T> {
  return (Object.keys(states) as Array<keyof T>).reduce(
    (obj, key) => {
      Object.defineProperty(obj, key, {
        get() {
          return states[key].currentState;
        }
      });
      return obj;
    },
    {} as MergedStates<T>
  );
}

function getTransformers<
  TStates extends Record<
    string,
    { [K in keyof TStates]: { [KF in keyof TStates[K]]: Function } }
  >
>(states: TStates): MergedTransformers<TStates> {
  const ignore = [...Object.keys(internals.StateContainer.prototype)];
  return Object.keys(states).reduce(
    (obj, key) => {
      obj[key] = Object.keys(states[key])
        .filter(
          fnKey =>
            !ignore.includes(fnKey) && typeof states[key][fnKey] === 'function'
        )
        .reduce(
          (current, fnKey) => {
            current[fnKey] = states[key][fnKey].bind(states[key]);
            return current;
          },
          {} as TransformersObject
        );
      return obj;
    },
    {} as Record<keyof TStates, any>
  );
}

export class MergedStaat<
  TStates extends Record<keyof TStates, State<unknown, any>>
> {
  private _subscriptions: Subscription[];
  private _currentStates: MergedStates<TStates>;
  private _transformers: MergedTransformers<TStates>;

  get currentStates() {
    return this._currentStates;
  }

  get transformers() {
    return this._transformers;
  }

  constructor(states: TStates) {
    this._subscriptions = [];
    this._currentStates = mergeCurrentStates(states);
    this._transformers = getTransformers(states);
    this.subscribeToStates(states);
  }

  private fireSubscriptions = () => {
    const results = this._subscriptions.map(s => s());
    return Promise.all(results).then(() => {});
  };

  private subscribeToStates(states: Record<string, State<unknown, any>>) {
    Object.keys(states).forEach(key =>
      states[key].subscribe(this.fireSubscriptions)
    );
  }

  public subscribe(fn: Subscription) {
    this._subscriptions.push(fn);
  }

  public unsubscribe(fn: Subscription) {
    this._subscriptions = this._subscriptions.filter(s => s !== fn);
  }
}

export function mergeStaats<
  TStates extends Record<keyof TStates, State<unknown, any>>
>(states: TStates): MergedStaat<TStates> {
  return new MergedStaat<TStates>(states);
}
