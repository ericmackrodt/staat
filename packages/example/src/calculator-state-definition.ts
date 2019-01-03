import { scopedTransformer } from "@staat/core";
import { CalculatorState, AppState } from "./types";
import { TimeTravelState } from "@staat/time-travel";

const transformer = scopedTransformer<
  AppState,
  TimeTravelState<CalculatorState>
>("calculator");

export const initialState: CalculatorState = {
  count: 0
};

export const add = transformer(
  (
    currentState: TimeTravelState<CalculatorState>,
    val: number
  ): TimeTravelState<CalculatorState> => {
    return {
      ...currentState,
      present: {
        ...currentState.present,
        count: currentState.present.count + val
      }
    };
  }
);

export const subtract = transformer(
  (
    currentState: TimeTravelState<CalculatorState>,
    val: number
  ): TimeTravelState<CalculatorState> => {
    return {
      ...currentState,
      present: {
        ...currentState.present,
        count: currentState.present.count - val
      }
    };
  }
);
