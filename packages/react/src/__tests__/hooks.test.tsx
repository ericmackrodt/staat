import { reactStaat } from '../react';
import staat from 'staat';
import { renderHook, act } from '@testing-library/react-hooks';
import { wait } from '@testing-library/react';

type TestState = {
  count: number;
  other: string;
};

const state: TestState = {
  count: 0,
  other: 'tst',
};

it('builds react-staat object', () => {
  const staatState = staat({ ...state });
  const sut = reactStaat(staatState);
  expect(typeof sut.Provider).toBe('function');
  expect(typeof sut.connect).toBe('function');
  expect(typeof sut.useStaat).toBe('function');
  expect(typeof sut.useReducers).toBe('function');
});

describe('Hooks', () => {
  describe('useStaat', () => {
    it('updates the value', async () => {
      const staatState = staat({ ...state });
      const { useStaat } = reactStaat(staatState);

      const { result } = renderHook(() => useStaat(({ count }) => count));

      act(() => {
        staatState.reduce(s => ({ ...s, count: 1000 }));
      });

      await wait(() => expect(result.current).toBe(1000));
    });
  });

  it('unsubscribes from staat', async () => {
    const staatState = staat({ ...state });
    const { useStaat } = reactStaat(staatState);
    staatState.unsubscribe = jest.fn();
    const { unmount } = renderHook(() => useStaat(({ count }) => count));
    unmount();
    expect(staatState.unsubscribe).toHaveBeenCalled();
  });

  it('updates if number of members is different', async () => {
    const staatState = staat({ ...state });
    const { useStaat } = reactStaat(staatState);

    const { result } = renderHook(() => useStaat(({ count }) => count));

    act(() => {
      staatState.reduce(sts => {
        return { ...sts, count: 200, another: '1' };
      });
    });

    await wait(() => expect(result.current).toBe(200));
  });

  it('does not update the component if state is same object', async () => {
    const original = { ...state };
    const staatState = staat(original);
    const { useStaat } = reactStaat(staatState);

    const { result } = renderHook(() => useStaat(sts => sts));

    act(() => {
      staatState.reduce(sts => {
        sts.count = 200;
        return sts;
      });
    });
    await wait(() => expect(result.current).toBe(original), { timeout: 100 });
    expect(original.count).toBe(200);
  });

  it('does not update the component if state members are equal', async () => {
    const original = { ...state };
    const staatState = staat(original);
    const { useStaat } = reactStaat(staatState);

    const { result } = renderHook(() => useStaat(sts => sts));

    act(() => {
      staatState.reduce(sts => {
        return { ...sts };
      });
    });
    await wait(() => expect(result.current).toBe(original), { timeout: 100 });
    expect(result.current).toBe(original);
  });

  it('updates when same number of properties but different name', async () => {
    const original: { a: string; b?: number; c?: number } = { a: '1', b: 2 };
    const staatState = staat(original);
    const { useStaat } = reactStaat(staatState);

    const { result } = renderHook(() => useStaat(sts => sts));

    act(() => {
      staatState.reduce(() => {
        return { a: '1', c: 2 };
      });
    });
    await wait(() => expect(result.current).toEqual({ a: '1', c: 2 }), {
      timeout: 100,
    });
  });

  describe('useReducers', () => {
    it('changes the state without arguments', () => {
      const staatState = staat({ ...state });
      const { useReducers } = reactStaat(staatState);
      const newValue = 10;

      const { result } = renderHook(() =>
        useReducers({
          testReducer: (sts: TestState) => ({ ...sts, count: newValue }),
        }),
      );
      act(() => {
        result.current.testReducer();
      });

      expect(staatState.currentState.count).toBe(10);
    });

    it('changes the state with arguments', () => {
      const staatState = staat({ ...state });
      const { useReducers } = reactStaat(staatState);

      const { result } = renderHook(() =>
        useReducers({
          testReducer: (sts: TestState, value: number) => ({
            ...sts,
            count: value,
          }),
        }),
      );
      act(() => {
        result.current.testReducer(300);
      });

      expect(staatState.currentState.count).toBe(300);
    });
  });
});
