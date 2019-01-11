import { applyChange, diff } from 'deep-diff';

export class TimeTravelContainer {
  private pastDiffs: deepDiff.IDiff[][];
  private futureDiffs: deepDiff.IDiff[][];
  constructor() {
    this.pastDiffs = [];
    this.futureDiffs = [];
  }

  private resolvePresent<TState>(state: TState, diffs: deepDiff.IDiff[]) {
    const current = JSON.parse(JSON.stringify(state));
    diffs.forEach(c => applyChange(current, {}, c!));
    const newDiffs = diff(current, state);
    return {
      newDiffs,
      current,
    };
  }

  public get canUndo() {
    return !!this.pastDiffs.length;
  }

  public get canRedo() {
    return !!this.futureDiffs.length;
  }

  public setPresent<TState>(current: TState, next: TState): TState {
    next = JSON.parse(JSON.stringify(next));
    const difference = diff(next, current);
    this.pastDiffs.push(difference);
    this.futureDiffs = [];
    return next;
  }

  public undo<TState>(state: TState): TState {
    if (!this.canUndo) {
      return state;
    }

    const diffsToApply = this.pastDiffs.pop();
    const { current, newDiffs } = this.resolvePresent(state, diffsToApply!);
    this.futureDiffs = [newDiffs, ...this.futureDiffs];
    return {
      ...state,
      ...current,
    };
  }

  public redo<TState>(state: TState): TState {
    if (!this.canRedo) {
      return state;
    }

    const diffsToApply = this.futureDiffs.shift();
    const { current, newDiffs } = this.resolvePresent(state, diffsToApply!);
    this.pastDiffs = [...this.pastDiffs, newDiffs];
    return {
      ...state,
      ...current,
    };
  }
}
