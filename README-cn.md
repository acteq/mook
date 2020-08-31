[English](./README.md) | 简体中文

# mook

简单易懂，无样本代码，无多余渲染，轻松共享React全局状态。


## 安装

```bash
yarn add @acte/mook
# 或
npm install --save @acte/mook
```

## 快速上手

### 创建一对hook函数

自定义一个 custom Hook，经 `createHooks` 包装转换后，会定义一个全局状态，返回一对 hook 函数：一个真身，一个替身。

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

`wrapped` 是对传入的hook函数的包装，它可以获取数据，更新数据，发送通知。

`standin` 是hook函数的替身，它的返回值是对`wrapped`函数返回值的引用。


### 使用返回的hook函数

真身函数只能出现一次，替身函数可在多处使用

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

创建一对 hook。参数是一个 custom Hook ，用于定义 model 的内部逻辑。

多次调用，会创建多对hook, 彼此相互隔离

```jsx
const {wrapped: useCounterModelA, standin:useRefCounterModelA} = createHooks(useCounter);
const {wrapped: useCounterModelB, standin:useRefCounterModelB} = createHooks(useCounter);
```

**WrappedHooks**

```typescript
export interface WrappedHooks<T> {
  wrapped : HookFunc<T>;
  standin : StandInHook<T>;
}
```

**wrapped**

`wrapped` 是对传入的hook函数的包装，它可以获取数据，更新数据，发送通知。

**standin**

`standin` 是hook函数的替身，它的返回值是对wrapped函数返回值的引用。

```typescript
type Deps<T> = (model: T) => unknown[];
export type StandInHook<T> = (depsFn?: Deps<T>) => T;
```

`standin` 支持传入一个 `depsFn` 函数，来精确控制订阅的字段：

```jsx
const counter = useRefCounterModel(model => [model.count, model.x.y]);
```
