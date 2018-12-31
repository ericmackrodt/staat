import * as React from 'react';

import { welcomeState, connect } from './state';

const Welcome: React.StatelessComponent<WelcomeProps> = props => {
  return (
    <div>
      <h1>Welcome, {props.name}</h1>
      <input type='text' onChange={evt => props.setName(evt.target.value)} />
      <button onClick={() => props.undo()}>Undo</button>
      <button onClick={() => props.redo()}>Redo</button>
    </div>
  );
};
type StateProps = {
  name?: string;
};

type TrasformerProps = {
  setName: typeof welcomeState.setName;
  undo: typeof welcomeState.undo;
  redo: typeof welcomeState.redo;
};

type OwnProps = {};

type WelcomeProps = StateProps & TrasformerProps & OwnProps;

export default connect<OwnProps, StateProps, TrasformerProps>(
  ({ welcomeState }) => {
    return {
      name: welcomeState.name
    };
  },
  ({ welcomeState }) => {
    return {
      setName: welcomeState.setName,
      undo: welcomeState.undo.bind(welcomeState),
      redo: welcomeState.redo.bind(welcomeState)
    };
  }
)(Welcome);
