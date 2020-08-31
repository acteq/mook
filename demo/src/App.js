import React from 'react';

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
export default App;
