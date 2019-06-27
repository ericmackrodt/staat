import * as React from 'react';

import { useReducers, useStaat } from './state';
import * as welcomeDefinition from './welcome-state-definition';

const Welcome: React.FunctionComponent = () => {
  const name = useStaat(({ welcome }) => welcome.name);
  const { setName } = useReducers({
    setName: welcomeDefinition.setName,
  });
  return (
    <div>
      <h1>Welcome, {name}</h1>
      <input type='text' onChange={evt => setName(evt.target.value)} />
      {/* <button onClick={() => props.undo()}>Undo</button>
      <button onClick={() => props.redo()}>Redo</button> */}
    </div>
  );
};

export default Welcome;
