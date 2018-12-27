export type WelcomeState = {
  name?: string;
};

export const initialState: WelcomeState = {};

export function setName(currentState: WelcomeState, name: string) {
  return { ...currentState, name };
}
