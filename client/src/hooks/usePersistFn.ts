import { useRef } from "react";

type AnyFunction = (...args: any[]) => any;

export function usePersistFn<T extends AnyFunction>(fn: T) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const stableRef = useRef<T | null>(null);
  if (!stableRef.current) {
    stableRef.current = function (this: unknown, ...args: Parameters<T>) {
      return fnRef.current.apply(this, args);
    } as T;
  }
  return stableRef.current;
}
