import { scope } from '../scope';

type State = {
  level1: {
    value1: string;
    level2: {
      value2: string;
    };
  };
  another1: {
    count1: number;
    another2: {
      count2: number;
    };
  };
};

const initialState: State = {
  level1: {
    value1: '',
    level2: {
      value2: '',
    },
  },
  another1: {
    count1: 0,
    another2: {
      count2: 0,
    },
  },
};

describe('scope', () => {
  it('returns scope object for one level', () => {
    const sut1 = scope<State, 'level1'>('level1');

    expect(sut1).toHaveProperty('path');
    expect(sut1).toHaveProperty('transformer');
    expect(sut1.path).toEqual(['level1']);

    const sut2 = scope<State, 'another1'>('another1');

    expect(sut2).toHaveProperty('path');
    expect(sut2).toHaveProperty('transformer');
    expect(sut2.path).toEqual(['another1']);
  });

  it('returns scope object for deeper level', () => {
    const sut1 = scope<State, 'level1', 'level2'>('level1', 'level2');

    expect(sut1).toHaveProperty('path');
    expect(sut1).toHaveProperty('transformer');
    expect(sut1.path).toEqual(['level1', 'level2']);

    const sut2 = scope<State, 'another1', 'another2'>('another1', 'another2');

    expect(sut2).toHaveProperty('path');
    expect(sut2).toHaveProperty('transformer');
    expect(sut2.path).toEqual(['another1', 'another2']);
  });

  describe('transformer', () => {
    it('is called with scope', () => {
      const sut = scope<State, 'level1'>('level1');
      const stub = jest.fn();
      const transformer = sut.transformer(stub);
      transformer(initialState);
      expect(stub).toHaveBeenCalledWith(initialState.level1);
    });

    it('is called with deeper scope', () => {
      const sut = scope<State, 'level1', 'level2'>('level1', 'level2');
      const stub = jest.fn();
      const transformer = sut.transformer(stub);
      transformer(initialState);
      expect(stub).toHaveBeenCalledWith(initialState.level1.level2);
    });

    it('updates scope', () => {
      const sut = scope<State, 'level1'>('level1');
      const transformer = sut.transformer((currentScope, value: string) => {
        return { ...currentScope, value1: value };
      });
      expect(transformer(initialState, 'new_value')).toEqual({
        level1: {
          value1: 'new_value',
          level2: {
            value2: '',
          },
        },
        another1: {
          count1: 0,
          another2: {
            count2: 0,
          },
        },
      });
    });

    it('updates deeper scope', () => {
      const sut = scope<State, 'level1', 'level2'>('level1', 'level2');
      const transformer = sut.transformer((currentScope, value2: string) => {
        return { ...currentScope, value2 };
      });
      expect(transformer(initialState, 'new_value')).toEqual({
        level1: {
          value1: '',
          level2: {
            value2: 'new_value',
          },
        },
        another1: {
          count1: 0,
          another2: {
            count2: 0,
          },
        },
      });
    });
  });

  it('asynchronously updates scope', async () => {
    const sut = scope<State, 'level1'>('level1');
    const transformer = sut.transformer((currentScope, value1: string) => {
      return Promise.resolve({ ...currentScope, value1 });
    });
    expect(await transformer(initialState, 'new_value')).toEqual({
      level1: {
        value1: 'new_value',
        level2: {
          value2: '',
        },
      },
      another1: {
        count1: 0,
        another2: {
          count2: 0,
        },
      },
    });
  });

  it('asynchronously updates deeper scope', async () => {
    const sut = scope<State, 'level1', 'level2'>('level1', 'level2');
    const transformer = sut.transformer((currentScope, value2: string) => {
      return Promise.resolve({ ...currentScope, value2 });
    });
    expect(await transformer(initialState, 'new_value')).toEqual({
      level1: {
        value1: '',
        level2: {
          value2: 'new_value',
        },
      },
      another1: {
        count1: 0,
        another2: {
          count2: 0,
        },
      },
    });
  });

  describe('reducer', () => {
    it('is called with scope', () => {
      const sut = scope<State, 'level1'>('level1');
      const stub = jest.fn();
      const reducer = sut.reducer(stub);
      reducer(initialState);
      expect(stub).toHaveBeenCalledWith(initialState.level1);
    });

    it('is called with deeper scope', () => {
      const sut = scope<State, 'level1', 'level2'>('level1', 'level2');
      const stub = jest.fn();
      const reducer = sut.reducer(stub);
      reducer(initialState);
      expect(stub).toHaveBeenCalledWith(initialState.level1.level2);
    });

    it('updates scope', () => {
      const sut = scope<State, 'level1'>('level1');
      const reducer = sut.reducer((currentScope, value: string) => {
        return { ...currentScope, value1: value };
      });
      expect(reducer(initialState, 'new_value')).toEqual({
        level1: {
          value1: 'new_value',
          level2: {
            value2: '',
          },
        },
        another1: {
          count1: 0,
          another2: {
            count2: 0,
          },
        },
      });
    });

    it('updates deeper scope', () => {
      const sut = scope<State, 'level1', 'level2'>('level1', 'level2');
      const reducer = sut.reducer((currentScope, value2: string) => {
        return { ...currentScope, value2 };
      });
      expect(reducer(initialState, 'new_value')).toEqual({
        level1: {
          value1: '',
          level2: {
            value2: 'new_value',
          },
        },
        another1: {
          count1: 0,
          another2: {
            count2: 0,
          },
        },
      });
    });
  });
});
