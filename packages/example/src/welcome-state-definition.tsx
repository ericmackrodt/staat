import { scopedTransformer } from 'staat';
import { WelcomeState, AppState } from './types';

export const initialState: WelcomeState = {};

const transformer = scopedTransformer<AppState>()('welcome');

export const setName = transformer(
  (currentState: WelcomeState, name: string) => {
    return { ...currentState, name };
  },
);
