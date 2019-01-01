export type CalculatorState = {
  count: number;
};

export type WelcomeState = {
  name?: string;
};

export type AppState = {
  calculator: CalculatorState;
  welcome: WelcomeState;
};
