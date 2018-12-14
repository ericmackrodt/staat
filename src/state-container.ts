import { applyChange, diff } from "deep-diff";
import deepFreeze = require("deep-freeze");
import { Subscription } from "./types";

export class StateContainer<T> {
  private pastDiffs: deepDiff.IDiff[][];
  private state: deepFreeze.DeepReadonly<T>;
  private futureDiffs: deepDiff.IDiff[][];
  private subscriptions: Subscription[];

  constructor(initialState: T) {
    this.state = deepFreeze(initialState);
    this.pastDiffs = [];
    this.futureDiffs = [];
    this.subscriptions = [];
  }

  public get canUndo() {
    return !!this.pastDiffs.length;
  }

  public get canRedo() {
    return !!this.futureDiffs.length;
  }

  private fireSubscriptions = () => {
    const results = this.subscriptions.map(s => s());
    return Promise.all(results);
  };

  private updatePresent(diffs: deepDiff.IDiff[]) {
    const current = JSON.parse(JSON.stringify(this.state));
    diffs.forEach(c => applyChange(current, {}, c!));
    const differ = diff(current, this.state);
    this.state = deepFreeze(current);
    return this.fireSubscriptions().then(() => differ);
  }

  public setState(state: T) {
    return Promise.resolve().then(() => {
      const current: T = JSON.parse(JSON.stringify(state));
      const difference = diff(current, this.state);
      this.pastDiffs.push(difference);
      this.state = deepFreeze(current);
      this.futureDiffs = [];
      return this.fireSubscriptions().then(() => this.state);
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
      return this.updatePresent(diffsToApply).then(newDiffs => {
        this.futureDiffs.unshift(newDiffs);
        return this.state;
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
        return this.state;
      });
    });
  }

  public subscribe(fn: Subscription) {
    this.subscriptions.push(fn);
  }

  public unsubscribe(fn: Subscription) {
    this.subscriptions = this.subscriptions.filter(s => s !== fn);
  }
}
