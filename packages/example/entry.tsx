import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { staat } from '@staat/base';
import { StaatProvider, connect } from '@staat/react';
import * as stateDefinition from './state-definition';

const { initialState, ...tranformers } = stateDefinition;

const state = staat(tranformers, initialState);

const Calculator: React.StatelessComponent<CalculatorProps> = props => (
  <div>
    <div>Hello World</div>
    <button onClick={() => props.state.add()}>Add</button>
    <button onClick={() => props.state.subtract()}>Subtract</button>
    <div>{props.state.currentState.count}</div>
  </div>
);

type StateProps = {
  state: typeof state;
};

type OwnProps = {};

type CalculatorProps = StateProps & OwnProps;

const Calc = connect<OwnProps, StateProps>({ state })(Calculator);

ReactDOM.render(
  <StaatProvider>
    <Calc />
  </StaatProvider>,
  document.getElementById('entry')
);
