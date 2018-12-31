import * as React from 'react';
import { State, Transformers } from '@staat/core';
import { MergedStates, MergedStaat, MergedTransformers } from '@staat/merge';
import { Consumer } from './context';

function isMerged<
  TStates extends Record<string, State<any, any>>,
  TState = {},
  TTransformers = {}
>(
  staat: MergedStaat<TStates> | State<TState, TTransformers>
): staat is MergedStaat<TStates> {
  return (
    !!(staat as MergedStaat<TStates>).currentStates &&
    !(staat as State<TState, TTransformers>).currentState
  );
}

export default function makeConnect<
  TStates extends Record<string, State<any, any>>,
  TState = {},
  TTransformers = {}
>() {
  return function connect<TOwnProps, TStateProps, TTransformerProps>(
    mapStateToProps: (
      states: MergedStates<TStates> | TState,
      ownProps: TOwnProps
    ) => TStateProps,
    mapTransformersToProps?: (
      transformers: MergedTransformers<TStates> | Transformers<TTransformers>
    ) => TTransformerProps
  ) {
    return (
      WrappedComponent: React.ComponentType<
        TOwnProps & TTransformerProps & TStateProps
      >
    ): React.ComponentType<TOwnProps> => {
      return class StaatConnect extends React.Component<TOwnProps> {
        private getStateProps = (
          states: MergedStaat<TStates> | State<TState, TTransformers>
        ) => {
          const state = isMerged<TStates, TState, TTransformers>(states)
            ? states.currentStates
            : states.currentState;
          return mapStateToProps(state, this.props);
        };

        private getTransformerProps = (
          states: MergedStaat<TStates> | State<TState, TTransformers>
        ) => {
          if (!mapTransformersToProps) {
            return {} as TTransformerProps;
          }

          const transformers = isMerged<TStates, TState, TTransformers>(states)
            ? states.transformers
            : states;

          return mapTransformersToProps(transformers);
        };

        public render() {
          return (
            <Consumer>
              {({
                states
              }: {
                states: MergedStaat<TStates> | State<TState, TTransformers>;
              }) => (
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
