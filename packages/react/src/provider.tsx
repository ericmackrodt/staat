import * as React from "react";
import { State } from "@staat/core";
import { Provider, Consumer } from "./context";

export default function makeProvider<
  TContainers extends Record<string, State<any, any>>
>(containers: TContainers): React.ComponentType {
  return class StaatProvider extends React.Component {
    private mounted: boolean;

    constructor(props: {}) {
      super(props);
      this.state = {};
    }

    private onSubscription = () => {
      return Promise.resolve().then(() => {
        if (!this.mounted) {
          return;
        }

        return this.setState({});
      });
    };

    public componentDidMount() {
      this.mounted = true;

      Object.keys(containers).forEach(key =>
        containers[key].subscribe(this.onSubscription)
      );
    }

    public componentWillUnmount() {
      this.mounted = false;
      Object.keys(containers).forEach(key =>
        containers[key].unsubscribe(this.onSubscription)
      );
    }

    public render() {
      const { children } = this.props;
      return (
        <Consumer>
          {(localStates: TContainers | null) => {
            const childStates: TContainers = { ...localStates, ...containers };
            return <Provider value={childStates}>{children}</Provider>;
          }}
        </Consumer>
      );
    }
  };
}
