import { applyChange, diff } from "deep-diff";
import deepFreeze = require("deep-freeze");
import { Subscription } from "./types";

export class StateContainer<T> {
  private state: deepFreeze.DeepReadonly<T>;
  private subscriptions: Subscription[];

  constructor(initialState: T) {
    this.state = deepFreeze(initialState);
    this.subscriptions = [];
  }

  private fireSubscriptions = () => {
    const results = this.subscriptions.map(s => s());
    return Promise.all(results);
  };

  public setState(state: T) {
    return Promise.resolve().then(() => {
      const current: T = JSON.parse(JSON.stringify(state));
      this.state = deepFreeze(current);
      return this.fireSubscriptions().then(() => this.state);
    });
  }

  public getState() {
    return this.state;
  }

  public subscribe(fn: Subscription) {
    this.subscriptions.push(fn);
  }

  public unsubscribe(fn: Subscription) {
    this.subscriptions = this.subscriptions.filter(s => s !== fn);
  }
}
