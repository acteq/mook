import { HookFunc, WrappedHooks } from "./types";
declare type Subscriber<T> = (data: T) => void;
export declare class Store<T = unknown> {
    constructor();
    subscribers: Set<Subscriber<T>>;
    model: T;
    notify(): void;
    setModel(newModel: T): void;
}
export declare function createHooks<T, P>(hook: HookFunc<T, P>): WrappedHooks<T>;
export {};
