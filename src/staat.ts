import { StateContainer } from './state-container';
import {
  IType,
  StateContainerType,
  TransformerSignatures,
  State
} from './types';
import { TimeTravelContainer } from './time-travel';
import { DeepReadonly } from 'deep-freeze';

function isPromise<T>(obj: T | Promise<T>): obj is Promise<T> {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof (obj as Promise<T>).then === 'function' &&
    typeof (obj as Promise<T>).catch === 'function'
  );
}

function addFunctions<T, TTransformers>(
  obj: Record<string, any>,
  transformers: TTransformers,
  container: StateContainer<T>
) {
  Object.keys(transformers)
    .filter(key => typeof transformers[key] === 'function')
    .reduce((obj, key) => {
      const actualFn = transformers[key];
      obj[key] = function(...args: any[]) {
        const state = container.getState();
        const result = actualFn(state, ...args);
        if (isPromise(result)) {
          return result.then(state => container.setState(state));
        }
        return container.setState(result);
      };
      return obj;
    }, obj);
}

// function buildProto<T>(
//   prototype: Record<string, any>,
//   container: StateContainer<T>
// ) {
//   if (container instanceof TimeTravelContainer) {
//     prototype.undo = () => container.undo();
//     prototype.redo = () => container.redo();
//   }

//   Object.defineProperty(prototype, "currentState", {
//     get: () => container.getState()
//   });
//   prototype.subscribe = fn => container.subscribe(fn);
//   prototype.unsubscribe = fn => container.unsubscribe(fn);
// }

// function modifyProptotype<TClass, TState>(
//   proto: IType<TClass>,
//   container: StateContainer<TState>
// ): IType<StateContainerType<TState, TClass>> {
//   modifyFunctions(proto.prototype, container);
//   buildProto(proto.prototype, container);
//   return proto as IType<StateContainerType<TState, TClass>>;
// }

// export function staat<TState, T>(
//   input: IType<T>
// ): IType<StateContainerType<TState, T>> {
//   const stateContainer = new StateContainer<TState>(
//     // TODO: CHANGE THIS TYPE
//     (input as any).initialState
//   );
//   return modifyProptotype(input, stateContainer);
// }

// export function timeTravelStaat<TState, T>(
//   input: IType<T>
// ): IType<StateContainerType<TState, T>> {
//   const stateContainer = new TimeTravelContainer<TState>(
//     // TODO: CHANGE THIS TYPE
//     (input as any).initialState
//   );
//   return modifyProptotype(input, stateContainer);
// }

export function initializeObject<TState>(
  container: StateContainer<TState>
): StateContainerType<TState> {
  const obj: Partial<StateContainerType<TState>> = {};
  // if (container instanceof TimeTravelContainer) {
  //   obj.undo = () => container.undo();
  //   obj.redo = () => container.redo();
  // }

  Object.defineProperty(obj, 'currentState', {
    get: () => container.getState()
  });
  obj.subscribe = fn => container.subscribe(fn);
  obj.unsubscribe = fn => container.unsubscribe(fn);
  return obj as StateContainerType<TState>;
}

export function staat<TState, TTransformers>(
  transformers: TTransformers,
  initialState?: TState
): State<TState, TTransformers> {
  const container = new StateContainer(initialState);
  const obj = initializeObject(container);
  addFunctions(obj, transformers, container);
  return obj as State<TState, TTransformers>;
}
