import * as React from 'react';
import { Staat } from 'staat';
import { Provider } from './context';

export default function makeProvider<TState, TTransformers>(
  staat: Staat<TState, TTransformers>
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
      return <Provider value={staat.currentState}>{children}</Provider>;
    }
  };
}
