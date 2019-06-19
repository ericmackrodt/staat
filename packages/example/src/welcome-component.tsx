import * as React from 'react';

import { useTransformers, useStaat } from './state';

const Welcome: React.FunctionComponent = () => {
  console.log('arerender');
  const name = useStaat(({ welcome }) => welcome.name);
  const { welcome } = useTransformers();
  return (
    <div>
      <h1>Welcome, {name}</h1>
      <input type='text' onChange={evt => welcome.setName(evt.target.value)} />
      {/* <button onClick={() => props.undo()}>Undo</button>
      <button onClick={() => props.redo()}>Redo</button> */}
    </div>
  );
};

export default Welcome;
