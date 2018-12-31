import * as React from 'react';
import { calculatorState, connect } from './state';

const Calculator: React.StatelessComponent<CalculatorProps> = props => {
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
};

type TransformerProps = {
  add: typeof calculatorState.add;
  subtract: typeof calculatorState.subtract;
  undo: typeof calculatorState.undo;
  redo: typeof calculatorState.redo;
};

type OwnProps = {};

type CalculatorProps = TransformerProps & StateProps & OwnProps;

export default connect<OwnProps, StateProps, TransformerProps>(
  ({ calculatorState }) => {
    return {
      count: calculatorState.count
    };
  },
  ({ calculatorState }) => {
    return {
      add: calculatorState.add,
      subtract: calculatorState.subtract,
      undo: calculatorState.undo.bind(calculatorState),
      redo: calculatorState.redo.bind(calculatorState)
    };
  }
)(Calculator);
