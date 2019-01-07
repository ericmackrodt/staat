import { TimeTravelContainer } from '../time-travel-container';

type TestState = {
  count: number;
};

const state: TestState = {
  count: 0,
};

describe('TimeTravelContainer', () => {
  describe('setPresent', () => {
    it('sets canUndo and canRedo', () => {
      const sut = new TimeTravelContainer<TestState>();
      const result = sut.setPresent(state, {
        count: 1,
      });
      expect(result).toEqual({ count: 1 });
      expect(sut.canUndo).toBe(true);
      expect(sut.canRedo).toBe(false);
    });
  });

  describe('undo', () => {
    let sut: TimeTravelContainer<TestState>;
    let currentState: TestState;

    beforeEach(() => {
      sut = new TimeTravelContainer<TestState>();
      currentState = sut.setPresent(state, {
        count: 1,
      });
      currentState = sut.setPresent(currentState, {
        count: 2,
      });
      currentState = sut.setPresent(currentState, {
        count: 3,
      });
    });

    it('returns previous state', () => {
      currentState = sut.undo(currentState);
      expect(currentState).toEqual({ count: 2 });
      currentState = sut.undo(currentState);
      expect(currentState).toEqual({ count: 1 });
      currentState = sut.undo(currentState);
      expect(currentState).toEqual({ count: 0 });
    });

    it('sets canUndo and canRedo', () => {
      expect(sut.canUndo).toBe(true);
      expect(sut.canRedo).toBe(false);
      currentState = sut.undo(currentState);
      expect(sut.canUndo).toBe(true);
      expect(sut.canRedo).toBe(true);
      currentState = sut.undo(currentState);
      expect(sut.canUndo).toBe(true);
      expect(sut.canRedo).toBe(true);
      currentState = sut.undo(currentState);
      expect(sut.canUndo).toBe(false);
      expect(sut.canRedo).toBe(true);
    });

    it('returns the same state if cannot undo', () => {
      currentState = sut.undo(currentState);
      currentState = sut.undo(currentState);
      currentState = sut.undo(currentState);
      const result = sut.undo(currentState);
      expect(result).toBe(currentState);
    });
  });

  describe('redo', () => {
    let sut: TimeTravelContainer<TestState>;
    let currentState: TestState;

    beforeEach(() => {
      sut = new TimeTravelContainer<TestState>();
      currentState = sut.setPresent(state, {
        count: 1,
      });
      currentState = sut.setPresent(currentState, {
        count: 2,
      });
      currentState = sut.setPresent(currentState, {
        count: 3,
      });
      currentState = sut.undo(currentState);
      currentState = sut.undo(currentState);
      currentState = sut.undo(currentState);
    });

    it('returns next state', () => {
      currentState = sut.redo(currentState);
      expect(currentState).toEqual({ count: 1 });
      currentState = sut.redo(currentState);
      expect(currentState).toEqual({ count: 2 });
      currentState = sut.redo(currentState);
      expect(currentState).toEqual({ count: 3 });
    });

    it('sets canUndo and canRedo', () => {
      expect(sut.canUndo).toBe(false);
      expect(sut.canRedo).toBe(true);
      currentState = sut.redo(currentState);
      expect(sut.canUndo).toBe(true);
      expect(sut.canRedo).toBe(true);
      currentState = sut.redo(currentState);
      expect(sut.canUndo).toBe(true);
      expect(sut.canRedo).toBe(true);
      currentState = sut.redo(currentState);
      expect(sut.canUndo).toBe(true);
      expect(sut.canRedo).toBe(false);
    });

    it('returns the same state if cannot redo', () => {
      currentState = sut.redo(currentState);
      currentState = sut.redo(currentState);
      currentState = sut.redo(currentState);
      const result = sut.redo(currentState);
      expect(result).toBe(currentState);
    });
  });
});
