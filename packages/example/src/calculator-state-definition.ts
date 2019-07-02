import { scope } from 'staat';
import { CalculatorState, AppState } from './types';

export const calculatorScope = scope<AppState, 'calculator'>('calculator');

export const initialState: CalculatorState = {
  count: 0,
};

export const add = calculatorScope.transformer(
  (currentState, val: number): CalculatorState => {
    return {
      ...currentState,
      count: currentState.count + val,
    };
  },
);

export const subtract = calculatorScope.transformer(
  (currentState, val: number): CalculatorState => {
    return {
      ...currentState,
      count: currentState.count - val,
    };
  },
);
