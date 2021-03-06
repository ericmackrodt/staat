import staat from 'staat';
import timeTravel from 'staat-timetravel';
import reactStaat from 'staat-react';
import * as calculatorStateDefinition from './calculator-state-definition';
import * as welcomeStateDefinition from './welcome-state-definition';

const {
  calculatorScope,
  initialState: calcInitialState,
  ...calcTransformers
} = calculatorStateDefinition;
const {
  initialState: welcomeInitialState,
  ...welcomeTransformers
} = welcomeStateDefinition;

const initialState = {
  calculator: calcInitialState,
  welcome: welcomeInitialState,
};

const transformers = {
  calculator: timeTravel(calcTransformers, calculatorScope),
  welcome: welcomeTransformers,
};

export const appState = staat(transformers, initialState);

export const { calculator, welcome } = appState;

export const { connect, Provider } = reactStaat(appState);
