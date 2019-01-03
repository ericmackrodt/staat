import * as React from "react";
import { calculator, connect } from "./state";

const Calculator: React.StatelessComponent<CalculatorProps> = props => {
  return (
    <div>
      <div>Hello World</div>
      <button onClick={() => props.add(1)}>Add</button>
      <button onClick={() => props.subtract(1)}>Subtract</button>
      <button onClick={() => props.undo()}>Undo</button>
      <button onClick={() => props.redo()}>Redo</button>
      <div>{props.count}</div>
    </div>
  );
};

type StateProps = {
  count: number;
};

type TransformerProps = {
  add: typeof calculator.add;
  subtract: typeof calculator.subtract;
  undo: typeof calculator.undo;
  redo: typeof calculator.redo;
};

type OwnProps = {};

type CalculatorProps = TransformerProps & StateProps & OwnProps;

export default connect<OwnProps, StateProps, TransformerProps>(
  ({ calculator }) => {
    return {
      count: calculator.present.count
    };
  },
  () => {
    return {
      add: calculator.add,
      subtract: calculator.subtract,
      undo: calculator.undo,
      redo: calculator.redo
    };
  }
)(Calculator);
