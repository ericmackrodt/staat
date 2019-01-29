import { StateContainer } from '../state-container';

type TestState = {
  count: number;
};

const state: TestState = {
  count: 0,
};

describe('StateContainer', () => {
  let sut: StateContainer<TestState>;
  beforeEach(() => {
    sut = new StateContainer(state);
  });

  it('returns initial state', () => {
    expect(sut.getState()).toBe(state);
  });

  it('sets new state', async () => {
    const newState = { ...state, count: 1 };
    await sut.setState(newState);
    expect(sut.getState()).toEqual(newState);
    expect(sut).not.toBe(state);
  });

  it('fires subscription when setting state', async () => {
    const subscriptionMock = jest.fn();
    sut.subscribe(subscriptionMock);
    const newState = { ...state, count: 1 };
    await sut.setState(newState);
    expect(subscriptionMock).toHaveBeenCalled();
  });

  it('fires multiple subscriptions when setting state', async () => {
    const subscriptionMock1 = jest.fn();
    const subscriptionMock2 = jest.fn();
    sut.subscribe(subscriptionMock1);
    sut.subscribe(subscriptionMock2);
    const newState = { ...state, count: 1 };
    await sut.setState(newState);
    expect(subscriptionMock1).toHaveBeenCalled();
    expect(subscriptionMock2).toHaveBeenCalled();
  });

  it('does not fire multiple subscriptions when unsubscribed', async () => {
    const subscriptionMock1 = jest.fn();
    const subscriptionMock2 = jest.fn();
    sut.subscribe(subscriptionMock1);
    sut.subscribe(subscriptionMock2);
    const newState = { ...state, count: 1 };
    sut.unsubscribe(subscriptionMock1);
    await sut.setState(newState);
    expect(subscriptionMock1).not.toHaveBeenCalled();
    expect(subscriptionMock2).toHaveBeenCalled();
  });
});
