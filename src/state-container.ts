import { applyChange, diff } from "deep-diff";
import deepFreeze = require("deep-freeze");

export class StateContainer<T> {
  private pastDiffs: deepDiff.IDiff[][];
  private state: deepFreeze.DeepReadonly<T>;
  private futureDiffs: deepDiff.IDiff[][];

  constructor() {
    this.pastDiffs = [];
    this.futureDiffs = [];
  }

  public get canUndo() {
    return !!this.pastDiffs.length;
  }

  public get canRedo() {
    return !!this.futureDiffs.length;
  }

  private updatePresent(diffs: deepDiff.IDiff[]) {
    const current = JSON.parse(JSON.stringify(this.state));
    diffs.forEach(c => applyChange(current, {}, c!));
    const differ = diff(current, this.state);
    this.state = deepFreeze(current);
    return differ;
  }

  public setState(state: T) {
    return Promise.resolve().then(() => {
      const current: T = JSON.parse(JSON.stringify(state));
      const difference = diff(current, this.state);
      this.pastDiffs.push(difference);
      this.state = deepFreeze(current);
      this.futureDiffs = [];
      return this.state;
    });
  }

  public getState() {
    return this.state;
  }

  public undo() {
    return Promise.resolve().then(() => {
      if (!this.canUndo) {
        return;
      }
      const diffsToApply = this.pastDiffs.pop()!;
      const newDiffs = this.updatePresent(diffsToApply);
      this.futureDiffs.unshift(newDiffs);
      return this.state;
    });
  }

  public redo() {
    return Promise.resolve().then(() => {
      if (!this.canRedo) {
        return;
      }
      const diffsToApply = this.futureDiffs.shift()!;
      const newDiffs = this.updatePresent(diffsToApply);
      this.pastDiffs.push(newDiffs);
      return this.state;
    });
  }
}
