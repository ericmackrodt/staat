import * as React from "react";
import * as ReactDOM from "react-dom";
import { timeTravelStaat } from "@staat/core";
import reactStaat from "@staat/react";
import * as stateDefinition from "./state-definition";

const { initialState, ...transformers } = stateDefinition;
console.log(initialState);

const state = timeTravelStaat(transformers, initialState);
console.log(state.currentState);

const { connect, Provider } = reactStaat({ state });

const Calculator: React.StatelessComponent<CalculatorProps> = props => (
  <div>
    <div>Hello World</div>
    <button onClick={() => props.add()}>Add</button>
    <button onClick={() => props.subtract()}>Subtract</button>
    <button onClick={() => props.undo()}>Undo</button>
    <button onClick={() => props.redo()}>Redo</button>
    <div>{props.count}</div>
  </div>
);

type StateProps = {
  count: number;
  add: typeof state.add;
  subtract: typeof state.subtract;
  undo: typeof state.undo;
  redo: typeof state.redo;
};

type OwnProps = {};

type CalculatorProps = StateProps & OwnProps;

const Calc = connect<OwnProps, StateProps>(({ state }) => {
  return {
    count: state.currentState.count,
    add: state.add,
    subtract: state.subtract,
    undo: state.undo.bind(state),
    redo: state.redo.bind(state)
  };
})(Calculator);

ReactDOM.render(
  <Provider>
    <Calc />
  </Provider>,
  document.getElementById("entry")
);
