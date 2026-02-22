"use client";

import { useRef, useSyncExternalStore } from "react";

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
type GetState<T> = () => T;
type Subscribe = (listener: () => void) => () => void;

type StateCreator<T> = (set: SetState<T>, get: GetState<T>) => T;

type StoreApi<T> = {
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: Subscribe;
};

type Selector<T, U> = (state: T) => U;
const identity = <T,>(state: T) => state;

export function create<T>(createState: StateCreator<T>) {
  let state: T;
  let version = 0;
  const listeners = new Set<() => void>();

  const getState: GetState<T> = () => state;

  const setState: SetState<T> = (partial) => {
    const nextState =
      typeof partial === "function"
        ? { ...state, ...(partial as (state: T) => Partial<T>)(state) }
        : { ...state, ...partial };

    if (Object.is(nextState, state)) {
      return;
    }

    state = nextState;
    version += 1;
    listeners.forEach((listener) => listener());
  };

  const subscribe: Subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = createState(setState, getState);

  const api: StoreApi<T> = { getState, setState, subscribe };

  function useStore<U>(selector: Selector<T, U> = identity as Selector<T, U>) {
    const cacheRef = useRef<{
      version: number;
      selector: Selector<T, U>;
      value: U;
    } | null>(null);

    const getSnapshot = () => {
      const cached = cacheRef.current;
      if (cached && cached.version === version && cached.selector === selector) {
        return cached.value;
      }

      const nextValue = selector(api.getState());
      if (cached && cached.version === version && Object.is(cached.value, nextValue)) {
        cacheRef.current = { version, selector, value: cached.value };
        return cached.value;
      }

      cacheRef.current = { version, selector, value: nextValue };
      return nextValue;
    };

    return useSyncExternalStore(api.subscribe, getSnapshot, getSnapshot);
  }

  (useStore as typeof useStore & StoreApi<T>).getState = api.getState;
  (useStore as typeof useStore & StoreApi<T>).setState = api.setState;
  (useStore as typeof useStore & StoreApi<T>).subscribe = api.subscribe;

  return useStore as typeof useStore & StoreApi<T>;
}
