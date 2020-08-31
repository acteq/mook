export declare type HookFunc<T = any, P = any> = (args: P) => T;
declare type Deps<T> = (model: T) => unknown[];
export interface UseHook<T> {
    (depsFn?: Deps<T>): T;
}
export interface WrappedHooks<T> {
    wrapped: HookFunc<T>;
    standin: HookFunc<T>;
}
export interface UseHook<T> {
    (depsFn?: Deps<T>): T;
}
export declare type UseHookFunc<T> = (depsFn?: Deps<T>) => T;
export {};
