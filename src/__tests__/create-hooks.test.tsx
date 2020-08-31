import { createHooks } from "..";
import {  useState } from "react";
// import "@testing-library/jest-dom/extend-expect";
import { renderHook,act } from '@testing-library/react-hooks';

function useCounter(initalValue: number) {
  const [count, setCount] = useState(initalValue??0);
  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);
  return { count, decrement, increment };
}

  
test('should use counterModel', () => {
  const {wrapped:useCounterModel, standin: useRefCounterModel} = createHooks(useCounter);
  const { result } = renderHook(useCounterModel,{initialProps: 5})
  expect(result.current.count).toBe(5)
  expect(typeof result.current.increment).toBe('function')
})


test('should increment counter', () => {
  const {wrapped:useCounterModel, standin: useRefCounterModel} = createHooks(useCounter);
  const { result } = renderHook(useCounterModel)
  act(() => {
    result.current.increment()
  })
  expect(result.current.count).toBe(1)
})
/*
test('should use refCounterModel', () => {
  const {wrapped:useCounterModel, standin: useRefCounterModel} = createHooks(useCounter);
  const { result } = renderHook((initialProps) => useCounterModel(initialProps), {initialProps: 5})
  const { result:result2 } = renderHook(useRefCounterModel)
  expect(result2.current.count).toBe(result.current.count)
  expect(typeof result2.current.increment).toBe('function')
})

test('should increment counter', () => {
  const {wrapped:useCounterModel, standin: useRefCounterModel} = createHooks(useCounter);
  const { result } = renderHook((initialProps) => useCounterModel(initialProps), {initialProps: 5})
  const { result:result2 } = renderHook(useRefCounterModel)
  act(() => {
    result2.current.increment()
  })
  expect(result2.current.count).toBe(6)
  expect(result2.current.count).toBe(result.current.count)
})
*/
