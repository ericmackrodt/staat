import * as React from 'react';
import { Consumer } from './context';

export default function makeConnect<TState>() {
  return function connect<TOwnProps, TStateProps, TTransformerProps>(
    mapStateToProps: (states: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: () => TTransformerProps,
  ) {
    return (
      WrappedComponent: React.ComponentType<
        TOwnProps & TTransformerProps & TStateProps
      >,
    ): React.ComponentType<TOwnProps> => {
      return class StaatConnect extends React.Component<TOwnProps> {
        private getStateProps = (state: TState) => {
          return mapStateToProps(state, this.props);
        };

        private getTransformerProps = () => {
          if (!mapTransformersToProps) {
            return {} as TTransformerProps;
          }
          return mapTransformersToProps();
        };

        public render() {
          return (
            <Consumer>
              {(state: TState) => (
                <WrappedComponent
                  {...this.props}
                  {...this.getStateProps(state)}
                  {...this.getTransformerProps()}
                />
              )}
            </Consumer>
          );
        }
      };
    };
  };
}
