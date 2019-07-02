import React from 'react';
import { Staat } from 'staat';

export default function makeProvider<TState>(
  staat: Staat<TState>,
  { Provider }: React.Context<TState>,
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
