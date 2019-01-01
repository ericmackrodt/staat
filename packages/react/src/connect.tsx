import * as React from 'react';
import { Staat } from '@staat/core';
import { Consumer } from './context';

export default function makeConnect<TState, TTransformers>() {
  return function connect<TOwnProps, TStateProps, TTransformerProps>(
    mapStateToProps: (states: TState, ownProps: TOwnProps) => TStateProps,
    mapTransformersToProps?: (
      staat: Staat<TState, TTransformers>
    ) => TTransformerProps
  ) {
    return (
      WrappedComponent: React.ComponentType<
        TOwnProps & TTransformerProps & TStateProps
      >
    ): React.ComponentType<TOwnProps> => {
      return class StaatConnect extends React.Component<TOwnProps> {
        private getStateProps = (staat: Staat<TState, TTransformers>) => {
          return mapStateToProps(staat.currentState, this.props);
        };

        private getTransformerProps = (staat: Staat<TState, TTransformers>) => {
          if (!mapTransformersToProps) {
            return {} as TTransformerProps;
          }
          return mapTransformersToProps(staat);
        };

        public render() {
          return (
            <Consumer>
              {({ states }: { states: Staat<TState, TTransformers> }) => (
                <WrappedComponent
                  {...this.props}
                  {...this.getStateProps(states)}
                  {...this.getTransformerProps(states)}
                />
              )}
            </Consumer>
          );
        }
      };
    };
  };
}
