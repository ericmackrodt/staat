# Staat (Core Library)

## A simple state management library.

The goal of this library is to allow simple state management for smaller applications. It is meant to be simple and be typescript friendly.

Staat is not a replacement for Redux, you should weigh which state management solution makes more sense for your project.

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

// Setup the initial state.

const initialState = {
  count: 0,
};

// Setup the transformers and pass them to the staat function.

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

## State slices

As your app progresses, you might need to have state slices for specific purposes in your application. Staat allows you to have that functionality while still maintaining the single state object.

```ts
import staat from 'staat';

// [TS only] Setup the types for the individual state slices.
type CalculatorState = {
  count: number;
};

type UserState = {
  email: string;
};

// [TS only]  Setup the general state.
type AppState = {
  calculator: CalculatorState;
  user: UserState;
};

// Setup the initial state.
const initialState = {
  calculator: {
    count: 0,
  },
  user: {
    email: '',
  },
};

// Setup transformers
const calculator = {
  add(currentState: AppState, value: number) {
    return {
      ...currentState,
      calculator: {
        ...currentState.calculator,
        count: currentState.calculator.count + value,
      },
    };
  },
  subtract(currentState: AppState, value: number) {
    return {
      ...currentState,
      calculator: {
        ...currentState.calculator,
        count: currentState.calculator.count - value,
      },
    };
  },
};

const user = {
  setEmail(currentState: AppState, email: string) {
    return {
      ...currentState,
      user: {
        ...currentState.user,
        email,
      },
    };
  },
};

// Setup the transformers object to pass them to staat.
// The properties here don't have to be the same as the state and you don't need
// to segment the transformers, however it is recommended so the objects are better organized.
const transformers = {
  calculator,
  user,
};

// Pass the initial state and transformers to the staat function.

const state = staat(transformers, initialState);

async function execution() {
  await state.calculator.add(10);
  console.log(state.currentState); // { calculator: { count: 10 }, user: { email: '' } }
  await state.calculator.subtract(3);
  console.log(state.currentState); // { calculator: { count: 7 }, user: { email: '' } }
  await state.user.setEmail('user@test.com');
  console.log(state.currentState); // { calculator: { count: 7 }, user: { email: 'user@test.com' } }
}

execution();
```

## Scopes

In the previous example you may have noticed that it can become a bit cumbersome to update slices of the state by modifying the whole state object. In order to solve this issue, you can make use of the `scope` function to create scoped transformers.

```ts
import staat, { scope } from 'staat';

// [TS only] Setup the types for the individual state slices.
type CalculatorState = {
  count: number;
};

type UserState = {
  email: string;
};

// [TS only]  Setup the general state.
type AppState = {
  calculator: CalculatorState;
  user: UserState;
};

// Setup the initial state.
const initialState = {
  calculator: {
    count: 0,
  },
  user: {
    email: '',
  },
};

// Create scopes
// Scopes can go 5 levels deep on Typescript and virtually as deep as you want
// in plain es6.
// Also, the type of the scope is inferred by the property names passed to the function.
const calculatorScope = scope<AppState, 'calculator'>('calculator');
const userScope = scope<AppState, 'user'>('user');

// Setup transformers
const calculator = {
  add: calculatorScope.transformer((currentState, value: number) => {
    return {
      ...currentState,
      count: currentState.count + value,
    };
  }),
  subtract: calculatorScope.transformer((currentState, value: number) => {
    return {
      ...currentState,
      count: currentState.count - value,
    };
  }),
};

const user = {
  setEmail: userScope.transformer((currentState, email: string) => {
    return {
      ...currentState,
      email,
    };
  }),
};

const transformers = {
  calculator,
  user,
};

// Pass the initial state and transformers to the staat function.

const state = staat(transformers, initialState);

// It works the same way as it did before.
async function execution() {
  await state.calculator.add(10);
  console.log(state.currentState); // { calculator: { count: 10 }, user: { email: '' } }
  await state.calculator.subtract(3);
  console.log(state.currentState); // { calculator: { count: 7 }, user: { email: '' } }
  await state.user.setEmail('user@test.com');
  console.log(state.currentState); // { calculator: { count: 7 }, user: { email: 'user@test.com' } }
}

execution();
```

## More examples

Check out the [example](https://github.com/ericmackrodt/staat/tree/master/packages/example) package for a more complex example of how to use staat, including React and Timetravel.
