import { scopedTransformer } from "@staat/core";
import { CalculatorState, AppState } from "./types";

const transformer = scopedTransformer<AppState, CalculatorState>("calculator");

export const initialState: CalculatorState = {
  count: 0
};

export const add = transformer(
  (currentState: CalculatorState, val: number): CalculatorState => {
    return {
      ...currentState,
      count: currentState.count + val
    };
  }
);

export const subtract = transformer(
  (currentState: CalculatorState, val: number): CalculatorState => {
    return {
      ...currentState,
      count: currentState.count - val
    };
  }
);
