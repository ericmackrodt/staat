# Staat/React

## The React bindings for Staat

## Basic usage

```tsx
import staat from '@staat/core';
import reactStaat from '@staat/react';
import React from 'react';
import ReactDOM from 'react-dom';

const initialState = {
  count: 0
};

const state = staat(
  {
    add(currentState: typeof initialState, value: number) {
      return { ...currentState, count: currentState.count + value };
    },
    subtract(currentState: typeof initialState, value: number) {
      return { ...currentState, count: currentState.count - value };
    }
  },
  initialState
);

const { Provider, connect } = reactStaat(state);

const Calculator: React.StatelessComponent<CalculatorProps> = props => {
  return (
    <div>
      <button onClick={() => props.add(10)}>Add</button>
      <button onClick={() => props.subtract(3)}>Subtract</button>
      <div>{props.count}</div>
    </div>
  );
};

type TransformerProps = {
  add: typeof state.add;
  subtract: typeof state.subtract;
};

type OwnProps = {};

type CalculatorProps = TransformerProps & typeof initialState & OwnProps;

const Calc = connect<OwnProps, typeof initialState, TransformerProps>(
  ({ calculator }) => {
    return {
      count: calculator.count
    };
  },
  () => {
    return {
      add: calculator.add,
      subtract: calculator.subtract
    };
  }
)(Calculator);

ReactDOM.render(
  <Provider>
    <Calc />
  </Provider>,
  document.getElementById('entry')
);
```
