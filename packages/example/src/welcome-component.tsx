import * as React from "react";

import { welcomeState, connect } from "./state";

const Welcome: React.StatelessComponent<WelcomeProps> = props => {
  console.log("Welcome Render");
  return (
    <div>
      <h1>Welcome, {props.name}</h1>
      <input type="text" onChange={evt => props.setName(evt.target.value)} />
      <button onClick={() => props.undo()}>Undo</button>
      <button onClick={() => props.redo()}>Redo</button>
    </div>
  );
};
type StateProps = {
  name?: string;
  setName: typeof welcomeState.setName;
  undo: typeof welcomeState.undo;
  redo: typeof welcomeState.redo;
};

type OwnProps = {};

type WelcomeProps = StateProps & OwnProps;

export default connect<OwnProps, StateProps>(({ welcomeState }) => {
  return {
    name: welcomeState.currentState.name,
    setName: welcomeState.setName,
    undo: welcomeState.undo.bind(welcomeState),
    redo: welcomeState.redo.bind(welcomeState)
  };
})(Welcome);
