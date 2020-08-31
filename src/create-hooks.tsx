import { HookFunc, StandInHook, WrappedHooks } from "./types";
import { useEffect, useRef, useState } from "react";

type Subscriber<T> = (data: T) => void;

export class Store<T = unknown> {
  constructor() {}
  subscribers = new Set<Subscriber<T>>();
  model!: T;

  notify() {
    for (const subscriber of this.subscribers) {
      subscriber(this.model);
    }
  }

  setModel(newModel:T) {
    this.model = newModel;
    setTimeout(()=>{
      this.notify();
    },0 );
  }
}

export function createHooks<T, P>(hook: HookFunc<T, P>): WrappedHooks<T> {
  
  const store = new Store();

  const wrapped: HookFunc<T> = (args:any) => {
    const model = hook(args);
    store.setModel(model);

    return store.model! as T;
  };

  const standin: StandInHook<T> = depsFn => {
    const [state, setState] = useState<Object>();
    const depsFnRef = useRef(depsFn);
    depsFnRef.current = depsFn;
    const depsRef = useRef<unknown[]>([]);
    useEffect(() => {
      if (!store) return;
      function subscriber(val: T) {
        if (!depsFnRef.current) {
          setState({});
        } else {
          const oldDeps = depsRef.current;
          const newDeps = depsFnRef.current(val);
          if (hasChanged(oldDeps, newDeps)) {
            setState({});
          }
          depsRef.current = newDeps;
        }
      }
      store.subscribers.add(subscriber);
      return () => {
        store.subscribers.delete(subscriber);
      };
    }, [store]);
    //if (process.env.NODE_ENV !== 'production' )
    // throw new Error(message)
    return store ? (store.model as T) : undefined;
  };

  return {wrapped, standin};
}

function hasChanged(oldDeps: unknown[], newDeps: unknown[]) {
  if (oldDeps.length !== newDeps.length) {
    return true;
  }
  for (const index in newDeps) {
    if (oldDeps[index] !== newDeps[index]) {
      return true;
    }
  }
  return false;
}
