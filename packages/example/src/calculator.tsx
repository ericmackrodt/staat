import * as React from 'react';
import { calculator as calculatorTransformers, connect } from './state';

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
  add: typeof calculatorTransformers.add;
  subtract: typeof calculatorTransformers.subtract;
  undo: typeof calculatorTransformers.undo;
  redo: typeof calculatorTransformers.redo;
};

type OwnProps = {};

type CalculatorProps = TransformerProps & StateProps & OwnProps;

export default connect<OwnProps, StateProps, TransformerProps>(
  ({ calculator }) => {
    return {
      count: calculator.count,
    };
  },
  () => {
    return {
      add: calculatorTransformers.add,
      subtract: calculatorTransformers.subtract,
      undo: calculatorTransformers.undo,
      redo: calculatorTransformers.redo,
    };
  },
)(Calculator);
