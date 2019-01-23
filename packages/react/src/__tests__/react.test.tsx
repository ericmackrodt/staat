import React from 'react';
import { reactStaat } from '../react';
import staat from 'staat';
import { ReactStaat } from '../types';
import { render } from 'react-testing-library';
/* tslint:disable no-submodule-imports */
import 'jest-dom/extend-expect';

type TestState = {
  count: number;
};

const state: TestState = {
  count: 0,
};

const transformers = {
  add(currentState: TestState, value: number) {
    return { ...currentState, count: currentState.count + value };
  },
  subtract(currentState: TestState, value: number) {
    return { ...currentState, count: currentState.count - value };
  },
};

type OwnProps = {};
type TestComponentProps = TestState & OwnProps;

const TestComponent: React.StatelessComponent<TestComponentProps> = ({ count }) => {
  return <div>Count: {count}</div>
};

describe('React', () => {
  let sut: ReactStaat<TestState>;
  let ConnectedComponent: React.ComponentType<OwnProps>;

  beforeEach(() => {
    const staatState = staat(transformers, state);
    sut = reactStaat(staatState);

    ConnectedComponent = sut.connect<OwnProps, TestState>(({ count }) => {
      return {
        count,
      };
    })(TestComponent);

  it('builds react-staat object', () => {
    expect(typeof sut.Provider).toBe('function');
    expect(typeof sut.connect).toBe('function');
  });

  it('should update component', () => {
    const tree = (
      <sut.Provider>
        <ConnectedComponent />
      </sut.Provider>
    );
    const { getByText } = render(tree);
    expect(getByText(/^Received:/).textContent).toBe('Received: Boba Fett');
  });
});
