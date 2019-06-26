import timeTravel from '../time-travel';
import { scope } from 'staat';
import { TimeTravelContainer } from '../time-travel-container';

type State = {
  argument0: string;
  argument1: string;
  argument2: number;
  scope: {
    scopeArgument: string;
  };
};

const baseState: State = {
  argument0: 'str',
  argument1: '',
  argument2: 0,
  scope: { scopeArgument: '0' },
};

function reducer(state: State, argument1: string, argument2: number): State {
  return { ...state, argument1, argument2 };
}

describe('timeTravel', () => {
  let setPresentStub: jest.Mock<{}>;
  let undoStub: jest.Mock<{}>;
  let redoStub: jest.Mock<{}>;
  beforeEach(() => {
    setPresentStub = jest.fn(TimeTravelContainer.prototype.setPresent);
    undoStub = jest.fn(TimeTravelContainer.prototype.undo);
    redoStub = jest.fn(TimeTravelContainer.prototype.redo);
    TimeTravelContainer.prototype.setPresent = setPresentStub;
    TimeTravelContainer.prototype.undo = undoStub;
    TimeTravelContainer.prototype.redo = redoStub;
  });

  it('retains reducer functionality', () => {
    const sut = timeTravel({ reducer });
    expect(reducer(baseState, 'a', 1)).not.toBe(sut.reducer(baseState, 'a', 1));
    expect(sut.reducer(baseState, 'a', 1)).toEqual(reducer(baseState, 'a', 1));
  });

  it('builds object with time travel functions', () => {
    const sut = timeTravel({ reducer });
    expect(sut).toHaveProperty('undo');
    expect(sut).toHaveProperty('redo');
  });

  it('sets up scoped reducers', () => {
    const testScope = scope<State, 'scope'>('scope');
    const scopedReducer = testScope.reducer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedReducer }, testScope);
    expect(sut.scopedReducer(baseState, 'scoped_value')).not.toBe(
      scopedReducer(baseState, 'scoped_value'),
    );
    expect(sut.scopedReducer(baseState, 'scoped_value')).toEqual(
      scopedReducer(baseState, 'scoped_value'),
    );
  });

  it('calls setPresent when calling reducer', () => {
    const sut = timeTravel({ reducer });
    sut.reducer(baseState, 'a', 1);
    expect(setPresentStub).toHaveBeenCalledTimes(1);
  });

  it('calls scoped setPresent when calling reducer', () => {
    const testScope = scope<State, 'scope'>('scope');
    const scopedReducer = testScope.reducer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedReducer }, testScope);
    sut.scopedReducer(baseState, 'scoped_value');
    expect(setPresentStub).toHaveBeenCalledTimes(1);
    expect(setPresentStub).toHaveBeenCalledWith(
      { scopeArgument: '0' },
      { scopeArgument: 'scoped_value' },
    );
  });

  it('calls undo', () => {
    const sut = timeTravel({ reducer });
    const newState = sut.reducer(baseState, 'new_value', 10) as State;
    sut.undo(newState);
    expect(undoStub).toHaveBeenCalledTimes(1);
    expect(undoStub).toHaveBeenCalledWith({
      argument0: 'str',
      argument1: 'new_value',
      argument2: 10,
      scope: { scopeArgument: '0' },
    });
  });

  it('calls scoped undo', () => {
    const testScope = scope<State, 'scope'>('scope');
    const scopedReducer = testScope.reducer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedReducer }, testScope);
    const newState = sut.scopedReducer(baseState, 'scoped_value') as State;
    sut.undo(newState);
    expect(undoStub).toHaveBeenCalledTimes(1);
    expect(undoStub).toHaveBeenCalledWith({ scopeArgument: 'scoped_value' });
  });

  it('calls redo', () => {
    const sut = timeTravel({ reducer });
    let newState = sut.reducer(baseState, 'new_value', 10) as State;
    newState = sut.undo(newState) as State;
    sut.redo(newState);
    expect(redoStub).toHaveBeenCalledTimes(1);
    expect(redoStub).toHaveBeenCalledWith({
      argument0: 'str',
      argument1: '',
      argument2: 0,
      scope: { scopeArgument: '0' },
    });
  });

  it('calls scoped redo', () => {
    const testScope = scope<State, 'scope'>('scope');
    const scopedReducer = testScope.reducer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedReducer }, testScope);
    let newState = sut.scopedReducer(baseState, 'scoped_value') as State;
    newState = sut.undo(newState) as State;
    sut.redo(newState);
    expect(redoStub).toHaveBeenCalledTimes(1);
    expect(redoStub).toHaveBeenCalledWith({ scopeArgument: '0' });
  });
});
