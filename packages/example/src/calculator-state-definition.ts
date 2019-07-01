import { scope } from 'staat';
import { CalculatorState, AppState } from './types';
import timeTravel from 'staat-timetravel';

const calculatorScope = scope<AppState, 'calculator'>('calculator');

export const initialState: CalculatorState = {
  count: 0,
};

const add = calculatorScope.reducer(
  (currentState, val: number): CalculatorState => {
    return {
      ...currentState,
      count: currentState.count + val,
    };
  },
);

const subtract = calculatorScope.reducer(
  (currentState, val: number): CalculatorState => {
    return {
      ...currentState,
      count: currentState.count - val,
    };
  },
);

export default timeTravel(
  {
    add,
    subtract,
  },
  calculatorScope,
);
