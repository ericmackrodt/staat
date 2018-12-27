import { timeTravelStaat } from "@staat/core";
import reactStaat from "@staat/react";
import * as calculatorStateDefinition from "./calculator-state-definition";
import * as welcomeStateDefinition from "./welcome-state-definition";

const {
  initialState: calcInitialState,
  ...calcTransformers
} = calculatorStateDefinition;
const {
  initialState: welcomeInitialState,
  ...welcomeTransformers
} = welcomeStateDefinition;

export const calculatorState = timeTravelStaat(
  calcTransformers,
  calcInitialState
);

export const welcomeState = timeTravelStaat(
  welcomeTransformers,
  welcomeInitialState
);

export const { connect, Provider } = reactStaat({
  calculatorState,
  welcomeState
});
