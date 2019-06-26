// import { AppState } from './types';
// // async function aTrip({ calculator, currentState }: typeof appState) {
// //   calculator.add(10);
// //   calculator.subtract(4);
// // }

// import * as calculatorStateDefinition from './calculator-state-definition';

// export type Transformers<TTransformers extends {}> = {
//   [TKey in keyof TTransformers]: TTransformers[TKey] extends (
//     currentState: infer TState,
//     ...args: infer TArgs
//   ) => unknown
//     ? Transformer<TState, TArgs>
//     : TTransformers[TKey]
// };

// function callr<TState, TArgs extends any[]>(
//   transformer: (currentState: TState, ...args: TArgs) => TState,
//   ...args: TArgs
// ) {}

// type TripInput<TState> = {
//   call<TArgs extends any[]>(
//     transformer: (currentState: TState, ...args: TArgs) => TState,
//     ...args: TArgs
//   ): TState;
//   select<T>(selector: (state: TState) => T): T;
// };

// function bah<TState>() {
//   return {
//     createTrip<TArgs extends any[]>(
//       trip: (input: TripInput<TState>, ...args: TArgs) => Promise<void>,
//     ) {
//       return function(...args: TArgs) {
//         trip({} as any, ...args);
//       };
//     },
//   };
// }

// const tripDef = bah<AppState>().createTrip(
//   async ({ call, select }, value: number) => {
//     call(calculatorStateDefinition.add, 10);
//     const hell = select(s => s.calculator.count);
//   },
// );

// tripDef(10);

// callr(calculatorStateDefinition.add, 10);

// const blarb = async ({ call, select }: TripInput<{}>, hello: string) => {
//   const blar = select(s => s);

//   call(state => state);
// };

// function tripCall<TState, TArgs extends any[]>(
//   trip: (input: TripInput<TState>, ...args: TArgs) => Promise<void>,
//   ...args: TArgs
// ) {}

// tripCall(blarb, '');
