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

function transformer(
  state: State,
  argument1: string,
  argument2: number,
): State {
  return { ...state, argument1, argument2 };
}

function transformerPromised(
  state: State,
  argument1: string,
  argument2: number,
): Promise<State> {
  return Promise.resolve({ ...state, argument1, argument2 });
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

  it('retains transformer functionality', () => {
    const sut = timeTravel({ transformer });
    expect(transformer(baseState, 'a', 1)).not.toBe(
      sut.transformer(baseState, 'a', 1),
    );
    expect(sut.transformer(baseState, 'a', 1)).toEqual(
      transformer(baseState, 'a', 1),
    );
  });

  it('retains transformer functionality with promise', async () => {
    const sut = timeTravel({ transformerPromised });
    expect(await sut.transformerPromised(baseState, 'a', 1)).not.toBe(
      await transformerPromised(baseState, 'a', 1),
    );
    expect(await sut.transformerPromised(baseState, 'a', 1)).toEqual(
      await transformerPromised(baseState, 'a', 1),
    );
  });

  it('builds object with time travel functions', () => {
    const sut = timeTravel({ transformer });
    expect(sut).toHaveProperty('undo');
    expect(sut).toHaveProperty('redo');
  });

  it('sets up scoped transformers', () => {
    const testScope = scope<State, 'scope'>('scope');
    const scopedTransformer = testScope.transformer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedTransformer }, testScope);
    expect(sut.scopedTransformer(baseState, 'scoped_value')).not.toBe(
      scopedTransformer(baseState, 'scoped_value'),
    );
    expect(sut.scopedTransformer(baseState, 'scoped_value')).toEqual(
      scopedTransformer(baseState, 'scoped_value'),
    );
  });

  it('calls setPresent when calling transformer', () => {
    const sut = timeTravel({ transformer });
    sut.transformer(baseState, 'a', 1);
    expect(setPresentStub).toHaveBeenCalledTimes(1);
  });

  it('calls scoped setPresent when calling transformer', () => {
    const testScope = scope<State, 'scope'>('scope');
    const scopedTransformer = testScope.transformer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedTransformer }, testScope);
    sut.scopedTransformer(baseState, 'scoped_value');
    expect(setPresentStub).toHaveBeenCalledTimes(1);
    expect(setPresentStub).toHaveBeenCalledWith(
      { scopeArgument: '0' },
      { scopeArgument: 'scoped_value' },
    );
  });

  it('calls undo', () => {
    const sut = timeTravel({ transformer });
    const newState = sut.transformer(baseState, 'new_value', 10) as State;
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
    const scopedTransformer = testScope.transformer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedTransformer }, testScope);
    const newState = sut.scopedTransformer(baseState, 'scoped_value') as State;
    sut.undo(newState);
    expect(undoStub).toHaveBeenCalledTimes(1);
    expect(undoStub).toHaveBeenCalledWith({ scopeArgument: 'scoped_value' });
  });

  it('calls redo', () => {
    const sut = timeTravel({ transformer });
    let newState = sut.transformer(baseState, 'new_value', 10) as State;
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
    const scopedTransformer = testScope.transformer(
      (currentScope, scopeArgument: string) => {
        return { ...currentScope, scopeArgument };
      },
    );
    const sut = timeTravel({ scopedTransformer }, testScope);
    let newState = sut.scopedTransformer(baseState, 'scoped_value') as State;
    newState = sut.undo(newState) as State;
    sut.redo(newState);
    expect(redoStub).toHaveBeenCalledTimes(1);
    expect(redoStub).toHaveBeenCalledWith({ scopeArgument: '0' });
  });
});
