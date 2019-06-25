import React from 'react';
import { useStaat } from './state';

export const LongListItem: React.FunctionComponent = () => {
  const name = useStaat(({ welcome }) => welcome.name);
  return <div>Value: {name}</div>;
};

export const LongList: React.FunctionComponent = () => {
  return (
    <div>
      {Array(5000)
        .fill(undefined)
        .map((_, index) => (
          <LongListItem key={index} />
        ))}
    </div>
  );
};
