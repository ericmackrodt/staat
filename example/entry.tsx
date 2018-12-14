import * as React from "react";
import * as ReactDOM from "react-dom";
import { staat } from "../src/staat";
import { StaatSubscription, StaatProvider, connect } from "../src/react";
type ThisState = {
  count: number;
};

export class AppState {
  public static initialState: ThisState = {
    count: 0
  };

  public add(currentState: ThisState): ThisState {
    return { ...currentState, count: currentState.count + 1 };
  }

  public subtract(currentState: ThisState): ThisState {
    return { ...currentState, count: currentState.count - 1 };
  }
}

const TheState = staat<ThisState, AppState>(AppState);

const theState = new TheState();

const Calculator: React.StatelessComponent<CalculatorProps> = props => (
  <div>
    <div>Hello World</div>
    <button onClick={() => props.state.add()}>Add</button>
    <button onClick={() => props.state.subtract()}>Subtract</button>
    <div>{props.state.currentState.count}</div>
  </div>
);

type StateProps = {
  state: typeof theState;
};

type OwnProps = {};

type CalculatorProps = StateProps & OwnProps;

const Calc = connect<OwnProps, StateProps>({ state: TheState })(Calculator);

ReactDOM.render(
  <StaatProvider>
    <Calc />
  </StaatProvider>,
  document.getElementById("entry")
);
