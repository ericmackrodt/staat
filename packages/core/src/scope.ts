import { getScope, isPromise, setScope } from './utils';
import { IScope } from './types';

class Scope<TState> implements IScope<TState, unknown> {
  public get path() {
    return this.properties;
  }

  constructor(private properties: string[]) {}

  public reducer<TArgs extends any[]>(
    definition: (currentScope: unknown, ...args: TArgs) => unknown,
  ): (currentState: TState, ...args: TArgs) => TState {
    return (currentState: any, ...args: any) => {
      const s = getScope<TState, any>(currentState, this.properties);
      const result = definition(s, ...args);
      return setScope({ ...currentState }, result, this.properties);
    };
  }

  public transformer<TArgs extends any[]>(
    definition: (currentScope: unknown, ...args: TArgs) => unknown,
  ): (currentState: TState, ...args: TArgs) => TState | Promise<TState> {
    console.warn(
      '[Staat] Scope transformer has been discontinued, please use reducer instead',
    );
    return (currentState: any, ...args: any) => {
      const s = getScope<TState, any>(currentState, this.properties);
      const result = definition(s, ...args);
      if (isPromise(result)) {
        return result.then(promiseResult =>
          setScope({ ...currentState }, promiseResult, this.properties),
        );
      }
      return setScope({ ...currentState }, result, this.properties);
    };
  }
}

function scope<
  TState,
  K1 extends keyof TState,
  K2 extends keyof TState[K1],
  K3 extends keyof TState[K1][K2],
  K4 extends keyof TState[K1][K2][K3],
  K5 extends keyof TState[K1][K2][K3][K4]
>(
  scope1: K1,
  scope2: K2,
  scope3: K3,
  scope4: K4,
  scope5: K5,
): IScope<TState, TState[K1][K2][K3][K4][K5]>;
function scope<
  TState,
  K1 extends keyof TState,
  K2 extends keyof TState[K1],
  K3 extends keyof TState[K1][K2],
  K4 extends keyof TState[K1][K2][K3]
>(
  scope1: K1,
  scope2: K2,
  scope3: K3,
  scope4: K4,
): IScope<TState, TState[K1][K2][K3][K4]>;
function scope<
  TState,
  K1 extends keyof TState,
  K2 extends keyof TState[K1],
  K3 extends keyof TState[K1][K2]
>(scope1: K1, scope2: K2, scope3: K3): IScope<TState, TState[K1][K2][K3]>;
function scope<TState, K1 extends keyof TState, K2 extends keyof TState[K1]>(
  scope1: K1,
  scope2: K2,
): IScope<TState, TState[K1][K2]>;
function scope<TState, K1 extends keyof TState>(
  scope1: K1,
): IScope<TState, TState[K1]>;
function scope<TState>(...properties: string[]): any {
  return new Scope<TState>(properties);
}

export { scope };
