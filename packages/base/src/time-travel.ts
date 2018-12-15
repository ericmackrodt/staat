import { applyChange, diff } from "deep-diff";
import deepFreeze = require("deep-freeze");
import { Subscription } from "./types";
import { StateContainer } from "./state-container";

export class TimeTravelContainer<T> extends StateContainer<T> {
  private pastDiffs: deepDiff.IDiff[][];
  private futureDiffs: deepDiff.IDiff[][];
  private timeTraveling: boolean;
  constructor(initialState: T) {
    super(initialState);
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
    this.timeTraveling = true;
    const state = this.getState();
    const current = JSON.parse(JSON.stringify(state));
    diffs.forEach(c => applyChange(current, {}, c!));
    const differ = diff(current, state);
    return this.setState(current).then(() => differ);
  }

  public setState(state: T) {
    return Promise.resolve().then(() => {
      const current: T = JSON.parse(JSON.stringify(state));
      if (!this.timeTraveling) {
        const difference = diff(current, this.getState());
        this.pastDiffs.push(difference);
        this.futureDiffs = [];
      }
      this.timeTraveling = false;
      return super.setState(current);
    });
  }

  public undo() {
    return Promise.resolve().then(() => {
      if (!this.canUndo) {
        return;
      }
      const diffsToApply = this.pastDiffs.pop()!;
      return this.updatePresent(diffsToApply).then(newDiffs => {
        this.futureDiffs.unshift(newDiffs);
        return this.getState();
      });
    });
  }

  public redo() {
    return Promise.resolve().then(() => {
      if (!this.canRedo) {
        return;
      }
      const diffsToApply = this.futureDiffs.shift()!;
      return this.updatePresent(diffsToApply).then(newDiffs => {
        this.pastDiffs.push(newDiffs);
        return this.getState();
      });
    });
  }
}
