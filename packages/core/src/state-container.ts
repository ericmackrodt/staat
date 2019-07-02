import { Subscription } from './types';
import { processLargeArrayAsync } from './utils';

export class StateContainer<T> {
  private state: T;
  private subscriptions: Subscription[];

  constructor(initialState: T) {
    this.state = initialState;
    this.subscriptions = [];
  }

  private fireSubscriptions = () => {
    processLargeArrayAsync(this.subscriptions, s => s());
  };

  public setState(state: T) {
    this.state = state;
    this.fireSubscriptions();
    return this.state;
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
