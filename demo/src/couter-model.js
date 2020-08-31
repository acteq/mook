
import { createHooks } from "../../lib/index.js";
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

export const {wrapped : useCounterModel, standin : useRefCounterModel} = createHooks(useCounter);