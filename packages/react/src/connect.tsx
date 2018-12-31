import * as React from 'react';
import { State } from '@staat/core';
import { MergedStates, MergedStaat, Transformers } from '@staat/merge';
import { Consumer } from './context';

export default function makeConnect<
  TStates extends Record<string, State<any, any>>
>() {
  return function connect<TOwnProps, TStateProps, TTransformerProps>(
    mapStateToProps: (
      states: MergedStates<TStates>,
      ownProps: TOwnProps
    ) => TStateProps,
    mapTransformersToProps?: (
      transformers: Transformers<TStates>
    ) => TTransformerProps
  ) {
    return (
      WrappedComponent: React.ComponentType<
        TOwnProps & TTransformerProps & TStateProps
      >
    ): React.ComponentType<TOwnProps> => {
      return class StaatConnect extends React.Component<TOwnProps> {
        public render() {
          return (
            <Consumer>
              {({ states }: { states: MergedStaat<TStates> }) => (
                <WrappedComponent
                  {...this.props}
                  {...mapStateToProps(states.currentStates, this.props)}
                  {...(mapTransformersToProps
                    ? mapTransformersToProps(states.transformers)
                    : ({} as TTransformerProps))}
                />
              )}
            </Consumer>
          );
        }
      };
    };
  };
}
