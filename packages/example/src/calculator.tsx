import * as React from "react";
import { calculatorState, connect } from "./state";

const Calculator: React.StatelessComponent<CalculatorProps> = props => {
  console.log("Calculator Render");
  return (
    <div>
      <div>Hello World</div>
      <button onClick={() => props.add()}>Add</button>
      <button onClick={() => props.subtract()}>Subtract</button>
      <button onClick={() => props.undo()}>Undo</button>
      <button onClick={() => props.redo()}>Redo</button>
      <div>{props.count}</div>
    </div>
  );
};

type StateProps = {
  count: number;
  add: typeof calculatorState.add;
  subtract: typeof calculatorState.subtract;
  undo: typeof calculatorState.undo;
  redo: typeof calculatorState.redo;
};

type OwnProps = {};

type CalculatorProps = StateProps & OwnProps;

export default connect<OwnProps, StateProps>(({ calculatorState }) => {
  return {
    count: calculatorState.currentState.count,
    add: calculatorState.add,
    subtract: calculatorState.subtract,
    undo: calculatorState.undo.bind(calculatorState),
    redo: calculatorState.redo.bind(calculatorState)
  };
})(Calculator);
