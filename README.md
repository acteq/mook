English | [简体中文](./README-cn.md)

# mook

easy to learn, no sample code, no useless render, global sharing of react state

## Install

```bash
yarn add @acte/mook
# Or
npm install --save @acte/mook
```

## Quick Start

### create a pair of hooks

By calling `createHooks` with a custom Hook, it will return a pair of hooks, which is used for retrieving, updating and sharing data.

```jsx
import { createHooks } from "mook";
import { useState } from "react";

function useCounter(initialValue) {
  const [count, setCount] = useState(initialValue ?? 0);
  const decrement = () => setCount(count - 1);
  const increment = () => { setCount(count + 1);}
  return {
    count,
    decrement,
    increment
  };
}

export const {wrapped : useCounterModel, standin : useRefCounterModelRef} = createHooks(useCounter);
```

`wrapped` is the wrapped version hook of the input, it is used for retrieving data, updating data, and notifying  its updates.

`standin` is a special hook function，which has the same return value of `wrapped` function。

### use the pair of hooks

The wrapped hook can be use just once, while the standin hook can be used multiple times.

```jsx
import {useCounterModel, useRefCounterModel } from "./couter-model";

function App(props) {
  return (
    <div style={{textAlign:"center"}}>
      <Component1 />
      <Component2 />
      <Component3 />
    </div>
  )
}

function Component1(props) {
  const {count, increment, decrement} = useCounterModel(10);
  return (
    <p>
      Component 1: {count}   <button onClick={increment}>Increment</button> <button onClick={decrement}>decrement</button>
    </p>
  );
}

function Component2(props) {
  const {count, increment, decrement} = useRefCounterModel();
  return (
      <p>
        Component 2: {count}  <button onClick={increment}>Increment</button> <button onClick={decrement}>decrement</button>
      </p>
  );
}

function Component3(props) {
  const {count, increment, decrement} = useRefCounterModel();
  return (
      <p>
        Component 3: {count}  <button onClick={increment}>Increment</button> <button onClick={decrement}>decrement</button>
      </p>
  );
}
```


## API

### createHooks

```typescript
declare function createHooks<T, P>(hook: HookFunc<T, P>): WrappedHooks<T> 
```

Create a pair of hooks.

The parameter is a custom Hook, used for defining the logic of hook/model.

You can call it multiple times to create multiple hooks/models:

```jsx
const {wrapped: useCounterModelA, standin:useRefCounterModelA} = createHooks(useCounter);
const {wrapped: useCounterModelB, standin:useRefCounterModelB} = createHooks(useCounter);
```

**WrappedHooks**

`WrappedHooks` is the return type of `createHooks`. 

```typescript
export interface WrappedHooks<T> {
  wrapped : HookFunc<T>;
  standin : StandInHook<T>;
}
```

**wrapped**

`wrapped` is the wrapped version hook of the input, it is used for retrieving data, updating data, and notifying  its updates.

**standin**

`standin` is a special hook function，which return the refernece value of `wrapped` function return value。

```typescript
type Deps<T> = (model: T) => unknown[];
export type StandInHook<T> = (depsFn?: Deps<T>) => T;
```

In order to control the data you want to subscribe precisely, you can pass an odditional `depsFn` function to `standin`.


```jsx
const counter = useRefCounterModel(model => [model.count, model.x.y]);
```
