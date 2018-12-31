import { timeTravelStaat, TimeTravelTransformers } from '@staat/core';
import reactStaat, { mergeStaats } from '@staat/react';
import * as calculatorStateDefinition from './calculator-state-definition';
import * as welcomeStateDefinition from './welcome-state-definition';

const {
  initialState: calcInitialState,
  ...calcTransformers
} = calculatorStateDefinition;
const {
  initialState: welcomeInitialState,
  ...welcomeTransformers
} = welcomeStateDefinition;

export type MergedStates = {
  calculatorState: calculatorStateDefinition.ThisState;
  welcomeState: welcomeStateDefinition.WelcomeState;
};

export type MergedTransformers = {
  calculatorState: TimeTravelTransformers<
    calculatorStateDefinition.ThisState,
    typeof calcTransformers
  >;
  welcomeState: TimeTravelTransformers<
    welcomeStateDefinition.WelcomeState,
    typeof welcomeTransformers
  >;
};

export const calculatorState = timeTravelStaat(
  calcTransformers,
  calcInitialState
);

export const welcomeState = timeTravelStaat(
  welcomeTransformers,
  welcomeInitialState
);

const mergedStaats = mergeStaats({ calculatorState, welcomeState });

export const { connect, Provider } = reactStaat(mergedStaats);
