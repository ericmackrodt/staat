import staat from "@staat/core";
import { timeTravel } from "@staat/time-travel";
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

const {
  initialState: timeTravelCalcInitialState,
  transformers: timeTravelCalcTransformers
} = timeTravel(calcInitialState, calcTransformers);

const initialState = {
  calculator: timeTravelCalcInitialState,
  welcome: welcomeInitialState
};

const transformers = {
  calculator: timeTravelCalcTransformers,
  welcome: welcomeTransformers
};

export const appState = staat(transformers, initialState);

export const { calculator, welcome } = appState;

export const { connect, Provider } = reactStaat(appState);
