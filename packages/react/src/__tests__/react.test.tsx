import React from 'react';
import { reactStaat } from '../react';
import staat from 'staat';
import { ReactStaat } from '../types';
import { render, fireEvent } from 'react-testing-library';
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
type TransformerProps = {
  add(value: number): TestState | Promise<TestState>;
};
type TestComponentProps = TestState & OwnProps & TransformerProps;

const TestComponent: React.StatelessComponent<TestComponentProps> = ({
  count,
  add,
}) => {
  return (
    <React.Fragment>
      <div>Count: {count}</div>
      <button onClick={() => add(10)}>Add</button>
    </React.Fragment>
  );
};

describe('React', () => {
  let sut: ReactStaat<TestState>;
  let ConnectedComponent: React.ComponentType<OwnProps>;

  beforeEach(() => {
    const staatState = staat(transformers, state);
    sut = reactStaat(staatState);

    ConnectedComponent = sut.connect<OwnProps, TestState, TransformerProps>(
      ({ count }) => {
        return {
          count,
        };
      },
      () => ({
        add: staatState.add,
      }),
    )(TestComponent);
  });

  it('builds react-staat object', () => {
    expect(typeof sut.Provider).toBe('function');
    expect(typeof sut.connect).toBe('function');
  });

  it('should render component', () => {
    const tree = (
      <sut.Provider>
        <ConnectedComponent />
      </sut.Provider>
    );
    const { getByText } = render(tree);
    expect(getByText(/^Count:/).textContent).toBe('Count: 0');
  });

  it('should update component', async () => {
    const tree = (
      <sut.Provider>
        <ConnectedComponent />
      </sut.Provider>
    );
    const { getByText, rerender } = render(tree);
    await fireEvent.click(getByText('Add'));
    await rerender(
      <sut.Provider>
        <ConnectedComponent />
      </sut.Provider>,
    );
    expect(getByText(/^Count:/).textContent).toBe('Count: 10');
  });
});
