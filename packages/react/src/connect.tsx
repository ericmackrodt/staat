import * as React from "react";
import { State } from "@staat/core";
import { Consumer } from "./context";

export default function makeConnect<
  T extends Record<string, State<any, any>>
>() {
  return function connect<TOwnProps, TStateProps>(
    mapStateToProps: (states: T, ownProps: TOwnProps) => TStateProps
  ) {
    return (
      WrappedComponent: React.ComponentType<TOwnProps & TStateProps>
    ): React.ComponentType<TOwnProps> => {
      return class StaatConnect extends React.Component<TOwnProps> {
        public render() {
          return (
            <Consumer>
              {(states: T) => (
                <WrappedComponent
                  {...this.props}
                  {...mapStateToProps(states, this.props)}
                />
              )}
            </Consumer>
          );
        }
      };
    };
  };
}
