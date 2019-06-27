import * as React from 'react';
import { connect, appState } from './state';
import calc from './calculator-state-definition';

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

type ReducerProps = {
  add: (val: number) => void;
  subtract: (val: number) => void;
  undo: () => void;
  redo: () => void;
};

type OwnProps = {};

type CalculatorProps = ReducerProps & StateProps & OwnProps;

export default connect<OwnProps, StateProps, ReducerProps>(
  ({ calculator }) => {
    return {
      count: calculator.count,
    };
  },
  () => {
    return {
      add: (val: number) => appState.reduce(calc.add, val),
      subtract: (val: number) => appState.reduce(calc.subtract, val),
      undo: () => appState.reduce(calc.undo),
      redo: () => appState.reduce(calc.redo),
    };
  },
)(Calculator);
