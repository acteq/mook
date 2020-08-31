import { useEffect, useRef, useState } from "react";
export class Store {
    constructor() {
        this.subscribers = new Set();
    }
    notify() {
        for (const subscriber of this.subscribers) {
            subscriber(this.model);
        }
    }
    setModel(newModel) {
        this.model = newModel;
        setTimeout(() => {
            this.notify();
        }, 0);
    }
}
export function createHooks(hook) {
    const store = new Store();
    const wrapped = (args) => {
        const model = hook(args);
        store.setModel(model);
        return store.model;
    };
    const standin = depsFn => {
        const [state, setState] = useState();
        const depsFnRef = useRef(depsFn);
        depsFnRef.current = depsFn;
        const depsRef = useRef([]);
        useEffect(() => {
            if (!store)
                return;
            function subscriber(val) {
                if (!depsFnRef.current) {
                    setState({});
                }
                else {
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
        return store ? store.model : undefined;
    };
    return { wrapped, standin };
}
function hasChanged(oldDeps, newDeps) {
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
