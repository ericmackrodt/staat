import * as React from 'react';
import { State } from '@staat/core';
import { MergedStaat } from '@staat/merge';
import { Provider, Consumer } from './context';

export default function makeProvider<
  TContainers extends Record<string, State<any, any>> = {},
  TState = {},
  TTransformers = {}
>(
  staat: MergedStaat<TContainers> | State<TState, TTransformers>
): React.ComponentType {
  return class StaatProvider extends React.Component {
    private _mounted: boolean;

    constructor(props: {}) {
      super(props);
      this.state = {};
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

      staat.subscribe(this.onSubscription);
    }

    public componentWillUnmount() {
      this._mounted = false;
      staat.unsubscribe(this.onSubscription);
    }

    public render() {
      const { children } = this.props;
      return (
        <Consumer>
          {merged => {
            return (
              <Provider value={{ states: merged || staat }}>
                {children}
              </Provider>
            );
          }}
        </Consumer>
      );
    }
  };
}
