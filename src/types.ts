export type HookFunc<T = any, P = any> = (args: P) => T;

export type StandInHook<T> = (depsFn?: Deps<T>) => T;

type Deps<T> = (model: T) => unknown[];

export interface WrappedHooks<T> {
  wrapped : HookFunc<T>;
  standin : StandInHook<T>;
}

