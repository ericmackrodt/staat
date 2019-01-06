import { scopedTransformer } from 'staat';
import { CalculatorState, AppState } from './types';

const transformer = scopedTransformer<AppState, CalculatorState>('calculator');

export const initialState: CalculatorState = {
  count: 0
};

export const add = transformer((currentState: CalculatorState) => {
  return { ...currentState, count: currentState.count + 1 };
});

export const subtract = transformer((currentState: CalculatorState) => {
  return { ...currentState, count: currentState.count - 1 };
});
