import staat from 'staat';
import reactStaat from 'staat-react';
import { initialState as calcInitialState } from './calculator-state-definition';
import { initialState as welcomeInitialState } from './welcome-state-definition';

const initialState = {
  calculator: calcInitialState,
  welcome: welcomeInitialState,
};

export const appState = staat(initialState);

export const { connect, Provider, useReducers, useStaat } = reactStaat(
  appState,
);
