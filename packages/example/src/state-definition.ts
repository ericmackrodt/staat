export type ThisState = {
  count: number;
};

export const initialState: ThisState = {
  count: 0
};

export function add(currentState: ThisState): ThisState {
  return { ...currentState, count: currentState.count + 1 };
}

export function subtract(currentState: ThisState): ThisState {
  return { ...currentState, count: currentState.count - 1 };
}
