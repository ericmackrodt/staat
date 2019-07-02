import staat from '../staat';
import { Staat } from '../types';

type TestState = {
  count: number;
};

const state: TestState = {
  count: 37,
};

describe('requester', () => {
  let sut: Staat<TestState>;
  beforeEach(() => {
    sut = staat(state);
  });

  it('selects from state', async () => {
    let value: number = 10;
    await sut.request(async ({ select }) => {
      value = select(s => s.count);
    });

    expect(value).toBe(37);
  });

  it('reduces state', async () => {
    await sut.request(async ({ reduce }) => {
      reduce(s => ({ ...s, count: 99 }));
    });

    expect(sut.currentState.count).toBe(99);
  });

  it('accepts arguments', async () => {
    await sut.request(async ({ reduce }, value: number) => {
      reduce(s => ({ ...s, count: value }));
    }, 489);

    expect(sut.currentState.count).toBe(489);
  });
});
