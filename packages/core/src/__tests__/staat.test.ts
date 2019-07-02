import staat from '../staat';
import { Staat, LegacyStaat } from '../types';

type TestState = {
  count: number;
  name?: string;
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

describe('staat', () => {
  describe('legacy', () => {
    let sut: LegacyStaat<typeof transformers, TestState>;
    beforeEach(() => {
      sut = staat(transformers, state);
    });

    it('sets up all members', () => {
      expect(sut).toHaveProperty('currentState');
      expect(sut.currentState).toBe(state);
      expect(typeof sut.subscribe).toBe('function');
      expect(typeof sut.unsubscribe).toBe('function');
      expect(typeof sut.add).toBe('function');
      expect(typeof sut.subtract).toBe('function');
    });

    it('sets up deep transformers', () => {
      const sut2 = staat({ deep: transformers }, state);
      expect(sut2).toHaveProperty('deep');
      expect(typeof sut2.deep.add).toBe('function');
      expect(typeof sut2.deep.subtract).toBe('function');
    });

    it('creates external trasformers signature and calls the declaration', async () => {
      let newState = await sut.add(100);
      expect(sut.currentState).toEqual({ count: 100 });
      expect(newState).toEqual({ count: 100 });
      expect(sut.currentState).not.toBe(state);
      newState = await sut.subtract(50);
      expect(sut.currentState).toEqual({ count: 50 });
      expect(newState).toEqual({ count: 50 });
      expect(sut.currentState).not.toBe(state);
    });

    it('fires subscription when calling transformer', async () => {
      const subscription = jest.fn();
      sut.subscribe(subscription);
      await sut.add(1);
      expect(subscription).toHaveBeenCalled();
    });

    it('unsubscribes from state', async () => {
      const subscription = jest.fn();
      sut.subscribe(subscription);
      await sut.add(1);
      sut.unsubscribe(subscription);
      await sut.add(1);
      expect(subscription).toHaveBeenCalledTimes(1);
    });

    it('calls asynchronous transformers', async () => {
      const sut2 = staat(
        {
          multiply(currentState: TestState, value: number) {
            return Promise.resolve({
              ...currentState,
              count: currentState.count * value,
            });
          },
        },
        {
          count: 2,
        },
      );

      const newState = await sut2.multiply(10);

      expect(sut2.currentState).toEqual({ count: 20 });
      expect(newState).toEqual({ count: 20 });
    });
  });

  describe('current', () => {
    let sut: Staat<TestState>;
    beforeEach(() => {
      sut = staat(state);
    });

    it('sets up all members', () => {
      expect(sut).toHaveProperty('currentState');
      expect(sut.currentState).toBe(state);
      expect(typeof sut.subscribe).toBe('function');
      expect(typeof sut.unsubscribe).toBe('function');
      expect(typeof sut.reduce).toBe('function');
      expect(typeof sut.request).toBe('function');
    });

    it('reduces the value', () => {
      const newState = sut.reduce(s => ({ ...s, count: 100 }));
      expect(sut.currentState).toEqual({ count: 100 });
      expect(newState).toEqual({ count: 100 });
      expect(sut.currentState).not.toBe(state);
    });

    it('reduces the value using external function with parameters', () => {
      function reducer(s: TestState, value: number) {
        return { ...s, count: value };
      }
      const newState = sut.reduce(reducer, 50);
      expect(sut.currentState).toEqual({ count: 50 });
      expect(newState).toEqual({ count: 50 });
      expect(sut.currentState).not.toBe(state);
    });

    it('fires subscription when reducing', async () => {
      const subscription = jest.fn();
      sut.subscribe(subscription);
      sut.reduce(s => ({ ...s, count: 1 }));
      await new Promise(resolve => setTimeout(resolve, 1));
      expect(subscription).toHaveBeenCalled();
    });

    it('unsubscribes from state', async () => {
      const subscription = jest.fn();
      sut.subscribe(subscription);
      sut.reduce(s => ({ ...s, count: 1 }));
      await new Promise(resolve => setTimeout(resolve, 1));
      sut.unsubscribe(subscription);
      sut.reduce(s => ({ ...s, count: 2 }));
      await new Promise(resolve => setTimeout(resolve, 1));
      expect(subscription).toHaveBeenCalledTimes(1);
    });

    describe('select', () => {
      it('gets the whole state if no parameter is passed', () => {
        expect(sut.select()).toBe(state);
      });

      it('gets single value', () => {
        sut.reduce(s => ({ ...s, count: 77 }));
        expect(sut.select(s => s.count)).toBe(77);
      });

      it('gets different object with value', () => {
        sut.reduce(s => ({ ...s, count: 77, name: 'test' }));
        expect(sut.select(s => ({ result: s.name }))).toEqual({
          result: 'test',
        });
      });
    });
  });
});
