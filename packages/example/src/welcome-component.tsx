import * as React from 'react';

import { connect, appState } from './state';
import * as welcome from './welcome-state-definition';

const Welcome: React.StatelessComponent<WelcomeProps> = props => {
  return (
    <div>
      <h1>Welcome, {props.name}</h1>
      <input type='text' onChange={evt => props.setName(evt.target.value)} />
      {/* <button onClick={() => props.undo()}>Undo</button>
      <button onClick={() => props.redo()}>Redo</button> */}
    </div>
  );
};
type StateProps = {
  name?: string;
};

type TrasformerProps = {
  setName: (name: string) => void;
  // undo: typeof welcomeState.undo;
  // redo: typeof welcomeState.redo;
};

type OwnProps = {};

type WelcomeProps = StateProps & TrasformerProps & OwnProps;

export default connect<OwnProps, StateProps, TrasformerProps>(
  state => {
    return {
      name: state.welcome.name,
    };
  },
  () => {
    return {
      setName: (name: string) => appState.reduce(welcome.setName, name),
      // undo: welcome.undo.bind(welcomeState),
      // redo: welcomeState.redo.bind(welcomeState)
    };
  },
)(Welcome);
