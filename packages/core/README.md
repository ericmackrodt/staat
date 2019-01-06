# Staat/Core

## A simple state management library.

The goal of this library is to allow simple state management for smaller applications. It is meant to be simple and be typescript friendly.

Staat is not a replacement for Redux, you should weigh which state management system makes more sense for your project.

This library is loosely inspired by Unstated, another really good option for state management.

## Concepts

- React is supported out of the box, but you can use Staat with other frameworks by using just the core library.
- The state is unmutable and lives in a container.
- This state can only be modified by transformers.
- Transformers are like reducers as in they are plain functions that modify the state.
- The transformers are called by functions that have their signature based on the trasformer itself, no pubsub is used.
- Transformers have an input and an output, they receive the current state, the parameters needed to modify that state and return the new state.
- The functions that call the transformers have a similar signature with the difference that they don't have the current state parameter and they return a promise with the state.
- Transformers can by async, meaning that you can call functions that do async operations from them, such as api calls.
- Keep in mind that it's up to you how testable the transformers are.
- Yes, you can have multiple parameters in your transformer, but in order to make it more readable, using an object as the input is a better option.

## Basic usage

```ts
import staat from 'staat';

const initialState = {
  count: 0
};

const state = staat(
  {
    add(currentState: typeof initialState, value: number) {
      return { ...currentState, count: currentState.count + value };
    },
    subtract(currentState: typeof initialState, value: number) {
      return { ...currentState, count: currentState.count - value };
    }
  },
  initialState
);

async function execution() {
  await state.add(10);
  console.log(state.currentState); // { count: 10 }
  await state.subtract(3);
  console.log(state.currentState); // { count: 7 }
}

execution();
```
