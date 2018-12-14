import * as React from "react";
import createReactContext from "create-react-context";
import { IType, StateContainerType, StateContainers } from "../types";

const { Provider, Consumer } = createReactContext(null);

export class StaatSubscription extends React.Component<StaatSubscriptionProps> {
  private unmounted: boolean = false;
  public state = {};
  private containers: StateContainerType<any, any>[] = [];

  private getContainers(map: Map<any, any>, states: StateContainers) {
    this.containers.forEach(container =>
      container.unsubscribe(this.onStateChange)
    );
    this.unsubscribe();

    if (map === null) {
      throw new Error(
        "You must wrap your <StaatSubscription> components with a <StaatProvider>"
      );
    }

    let safeMap = map;
    let instances = states.map(ContainerItem => {
      let instance: StateContainerType<any, any>;

      if (
        typeof ContainerItem === "object" &&
        typeof ContainerItem.currentState === "object"
      ) {
        instance = ContainerItem;
      } else {
        instance = safeMap.get(ContainerItem);
        if (!instance) {
          instance = new (ContainerItem as IType<
            StateContainerType<any, any>
          >)();
          safeMap.set(ContainerItem, instance);
        }
      }

      instance.unsubscribe(this.onStateChange);
      instance.subscribe(this.onStateChange);

      return instance;
    });

    this.containers = instances;
    return instances;
  }

  private onStateChange = (): Promise<void> => {
    return new Promise(resolve => {
      if (!this.unmounted) {
        this.setState({}, resolve);
      } else {
        resolve();
      }
    });
  };

  private unsubscribe() {
    this.containers.forEach(container =>
      container.unsubscribe(this.onStateChange)
    );
  }

  public componentWillUnmount() {
    this.unmounted = true;
    this.unsubscribe();
  }

  public render() {
    const { states, children } = this.props;

    return (
      <Consumer>
        {(map: Map<any, any>) =>
          children.apply(null, this.getContainers(map, states))
        }
      </Consumer>
    );
  }
}

export type StaatSubscriptionProps = {
  states: StateContainers;
  children: (
    ...containers: StateContainerType<any, any>[]
  ) => React.ReactElement<any>;
};

export const StaatProvider: React.StatelessComponent = props => (
  <Consumer>
    {(parentMap: Map<any, any>) => {
      let childMap = new Map(parentMap);
      console.log(childMap);
      return <Provider value={childMap}>{props.children}</Provider>;
    }}
  </Consumer>
);

/* WITH CONTAINERS */

type StateProps = Record<
  string,
  IType<StateContainerType<any, any>> | StateContainerType<any, any>
>;

const getProps = (
  definitions: StateProps,
  ...containers: Array<StateContainerType<any, any>>
) => {
  return Object.keys(definitions).reduce(
    (previous, next, index) => {
      previous[next] = containers[index];
      return previous;
    },
    {} as Record<string, StateContainerType<any, any>>
  );
};

export function connect<TOwnProps, TStateProps>(containers: StateProps) {
  return function wrapper(
    WrappedComponent: React.ComponentType<TOwnProps & TStateProps>
  ) {
    return class ContainersProvider extends React.Component<TOwnProps> {
      public render() {
        return (
          <StaatSubscription
            states={Object.keys(containers).map(key => containers[key])}
          >
            {(...containerProps) => (
              <WrappedComponent
                {...getProps(containers, ...containerProps)}
                {...this.props}
              />
            )}
          </StaatSubscription>
        );
      }
    };
  };
}
