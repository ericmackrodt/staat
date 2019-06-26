import { scope } from 'staat';
import { WelcomeState, AppState } from './types';

export const initialState: WelcomeState = {};

const welcomeScope = scope<AppState, 'welcome'>('welcome');

export const setName = welcomeScope.reducer((currentState, name: string) => {
  return { ...currentState, name };
});
