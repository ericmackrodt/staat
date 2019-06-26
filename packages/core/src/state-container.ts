import { Subscription } from './types';

export class StateContainer<T> {
  private state: T;
  private subscriptions: Subscription[];

  constructor(initialState: T) {
    this.state = initialState;
    this.subscriptions = [];
  }

  private fireSubscriptions = () => {
    const results = this.subscriptions.map(s => s());
    return Promise.all(results);
  };

  public setState(state: T) {
    this.state = state;
    Promise.resolve().then(() =>
      this.fireSubscriptions().then(() => this.state),
    );
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
