import * as React from 'react';
import { State } from '@staat/core';
import { MergedStaat } from '@staat/merge';
import { Provider, Consumer } from './context';

export default function makeProvider<
  TContainers extends Record<string, State<any, any>>
>(containers: TContainers): React.ComponentType {
  return class StaatProvider extends React.Component {
    private _mounted: boolean;
    private _merged: MergedStaat<TContainers>;

    constructor(props: {}) {
      super(props);
      this.state = {};
      this._merged = new MergedStaat(containers);
    }

    private onSubscription = () => {
      return Promise.resolve().then(() => {
        if (!this._mounted) {
          return;
        }

        return this.setState({});
      });
    };

    public componentDidMount() {
      this._mounted = true;

      this._merged.subscribe(this.onSubscription);
    }

    public componentWillUnmount() {
      this._mounted = false;
      this._merged.unsubscribe(this.onSubscription);
    }

    public render() {
      const { children } = this.props;
      return (
        <Consumer>
          {merged => {
            return (
              <Provider value={{ states: merged || this._merged }}>
                {children}
              </Provider>
            );
          }}
        </Consumer>
      );
    }
  };
}
