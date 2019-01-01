import staat from '@staat/core';
import reactStaat from '@staat/react';
import * as calculatorStateDefinition from './calculator-state-definition';
import * as welcomeStateDefinition from './welcome-state-definition';
import { AppState } from './types';

const {
  initialState: calcInitialState,
  ...calcTransformers
} = calculatorStateDefinition;
const {
  initialState: welcomeInitialState,
  ...welcomeTransformers
} = welcomeStateDefinition;

const initialState: AppState = {
  calculator: calcInitialState,
  welcome: welcomeInitialState
};

const transformers = {
  calculator: calcTransformers,
  welcome: welcomeTransformers
};

export const appState = staat(transformers, initialState);

export const { calculator, welcome } = appState;

export const { connect, Provider } = reactStaat(appState);
