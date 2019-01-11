# Staat

## A simple state management library.

[![Build Status](https://travis-ci.org/ericmackrodt/staat.svg?branch=master)](https://travis-ci.org/ericmackrodt/staat)
[![Coverage Status](https://coveralls.io/repos/github/ericmackrodt/staat/badge.svg?branch=master)](https://coveralls.io/github/ericmackrodt/staat?branch=master)

The goal of this library is to allow simple state management for smaller applications. It is meant to be simple, typescript friendly and support time travel out of the box.

Staat is not a replacement for Redux by any means, you should weigh which state management system makes more sense for your project.

This library is loosely inspired by Unstated, another really good option for state management.

There are currently two libraries available.

- `staat` is the main state management code.
- `staat-react` is the library that connects staat to react.
- `staat-timetravel` adds time travel to a state.

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
  count: 0,
};

const state = staat(
  {
    add(currentState: typeof initialState, value: number) {
      return { ...currentState, count: currentState.count + value };
    },
    subtract(currentState: typeof initialState, value: number) {
      return { ...currentState, count: currentState.count - value };
    },
  },
  initialState,
);

async function execution() {
  await state.add(10);
  console.log(state.currentState); // { count: 10 }
  await state.subtract(3);
  console.log(state.currentState); // { count: 7 }
}

execution();
```

## Documentation of apis:

- **staat** - For more advanced usages of the core library, go to its [README](https://github.com/ericmackrodt/staat/tree/master/packages/core) file.
- **staat-react** - For how to use the react library, go to its [README](https://github.com/ericmackrodt/staat/tree/master/packages/react) file.
- **staat-timetravel** - For how to use the time travel library, go to its [README](https://github.com/ericmackrodt/staat/tree/master/packages/time-travel) file.
